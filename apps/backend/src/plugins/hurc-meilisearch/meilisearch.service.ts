import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
// EntityHydrator / JobQueueService / Logger / ProductVariantService /
// RequestContextService are runtime values (DI tokens, decorators, static
// methods). The linter wants to flatten them to type-only imports.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI + Vendure Logger require runtime references
import {
  EntityHydrator,
  type JobQueue,
  JobQueueService,
  Logger,
  type ProductVariant,
  ProductVariantService,
  RequestContextService,
} from '@vendure/core';
import { type Index, Meilisearch } from 'meilisearch';

import { env } from '../../env.js';
import {
  type Activity,
  MEILI_FILTERABLE_ATTRIBUTES,
  MEILI_PRODUCT_INDEX,
  MEILI_QUEUE_NAME,
  MEILI_SEARCHABLE_ATTRIBUTES,
  MEILI_SORTABLE_ATTRIBUTES,
  type MeiliIndexJob,
  type MeiliProductDoc,
} from './document.types.js';
import { processIndexJob } from './indexer.handler.js';

const loggerCtx = 'MeilisearchService';

const SUPPORTED_ACTIVITIES: ReadonlySet<Activity> = new Set(['RUN', 'TRAIN', 'LIFT', 'REST']);

function asActivities(value: unknown): readonly Activity[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is Activity => typeof v === 'string' && SUPPORTED_ACTIVITIES.has(v as Activity),
  );
}

@Injectable()
export class MeilisearchService implements OnApplicationBootstrap {
  private client: Meilisearch | null = null;
  private queue: JobQueue<MeiliIndexJob> | null = null;

  constructor(
    private readonly productVariantService: ProductVariantService,
    private readonly requestContextService: RequestContextService,
    private readonly entityHydrator: EntityHydrator,
    private readonly jobQueueService: JobQueueService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.queue = await this.jobQueueService.createQueue<MeiliIndexJob>({
      name: MEILI_QUEUE_NAME,
      process: (job) => processIndexJob(this, job.data),
    });
    if (env.search.kind !== 'enabled') {
      Logger.info('Meilisearch disabled (MEILI_HOST not set) — indexing is a no-op', loggerCtx);
      return;
    }
    this.client = new Meilisearch({
      host: env.search.host,
      apiKey: env.search.apiKey,
    });
    try {
      await this.ensureIndex();
      Logger.info('Meilisearch index ready', loggerCtx);
    } catch (err) {
      Logger.error(
        `Meilisearch boot init failed: ${err instanceof Error ? err.message : String(err)}`,
        loggerCtx,
      );
    }
  }

  enqueue(job: MeiliIndexJob): void {
    if (!this.queue) {
      Logger.warn('JobQueue not yet initialised; dropping enqueue', loggerCtx);
      return;
    }
    void this.queue.add(job);
  }

  async enqueueMany(jobs: readonly MeiliIndexJob[]): Promise<number> {
    if (!this.queue) return 0;
    for (const job of jobs) {
      await this.queue.add(job);
    }
    return jobs.length;
  }

  /** Whether the service has a live Meilisearch connection. */
  isEnabled(): boolean {
    return this.client !== null;
  }

  private async ensureIndex(): Promise<void> {
    if (!this.client) return;
    // createIndex throws if it already exists; treat that as success.
    try {
      await this.client.createIndex(MEILI_PRODUCT_INDEX, { primaryKey: 'id' });
    } catch {
      // index already exists — fine.
    }
    const index = this.client.index<MeiliProductDoc>(MEILI_PRODUCT_INDEX);
    await index.updateSearchableAttributes([...MEILI_SEARCHABLE_ATTRIBUTES]);
    await index.updateFilterableAttributes([...MEILI_FILTERABLE_ATTRIBUTES]);
    await index.updateSortableAttributes([...MEILI_SORTABLE_ATTRIBUTES]);
  }

  private requireIndex(): Index<MeiliProductDoc> | null {
    if (!this.client) return null;
    return this.client.index<MeiliProductDoc>(MEILI_PRODUCT_INDEX);
  }

  async upsertVariant(variantId: string): Promise<void> {
    const index = this.requireIndex();
    if (!index) return;
    const ctx = await this.requestContextService.create({ apiType: 'admin' });
    const variant = await this.productVariantService.findOne(ctx, variantId);
    if (!variant) {
      // Variant gone — remove any stale doc.
      await this.removeVariant(variantId);
      return;
    }
    await this.entityHydrator.hydrate(ctx, variant, {
      relations: ['product', 'collections'],
    });
    const doc = this.variantToDoc(variant);
    if (!doc) return;
    await index.addDocuments([doc]);
  }

  async removeVariant(variantId: string): Promise<void> {
    const index = this.requireIndex();
    if (!index) return;
    await index.deleteDocument(variantId);
  }

  async upsertAllVariantsOfProduct(productId: string): Promise<void> {
    const index = this.requireIndex();
    if (!index) return;
    const ctx = await this.requestContextService.create({ apiType: 'admin' });
    const variants = await this.productVariantService.getVariantsByProductId(ctx, productId);
    for (const v of variants.items) {
      await this.upsertVariant(v.id.toString());
    }
  }

  async removeAllVariantsOfProduct(productId: string): Promise<void> {
    const index = this.requireIndex();
    if (!index) return;
    const ctx = await this.requestContextService.create({ apiType: 'admin' });
    const variants = await this.productVariantService.getVariantsByProductId(ctx, productId);
    if (variants.items.length === 0) return;
    await index.deleteDocuments(variants.items.map((v) => v.id.toString()));
  }

  async indexBatch(productIds: string[]): Promise<void> {
    if (!this.requireIndex()) return;
    for (const id of productIds) {
      await this.upsertAllVariantsOfProduct(id);
    }
  }

  private variantToDoc(variant: ProductVariant): MeiliProductDoc | null {
    const product = variant.product;
    if (!product) {
      Logger.warn(`Variant ${variant.id} has no hydrated product; skipping`, loggerCtx);
      return null;
    }
    const customFields = (product.customFields ?? {}) as {
      activity?: unknown;
    };
    const enabled = variant.enabled && product.enabled && !product.deletedAt;
    return {
      id: variant.id.toString(),
      sku: variant.sku,
      name: variant.name || product.name,
      slug: product.slug,
      description: product.description ?? '',
      price: variant.priceWithTax,
      currency: variant.currencyCode,
      activity: asActivities(customFields.activity),
      collections: (variant.collections ?? []).map((c) => c.slug),
      facets: {},
      // Stock-level integration is a follow-up; for now `inStock` follows the
      // enabled flag. StockMovementEvent will tighten this in a subsequent PR.
      inStock: enabled,
    };
  }
}
