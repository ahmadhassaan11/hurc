import { Controller, Post } from '@nestjs/common';
// Allow / Ctx are decorator factories (runtime), Permission is an enum
// (runtime), ProductService is a DI token (runtime).
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- decorators + DI require runtime references
import { Allow, Ctx, Permission, ProductService, type RequestContext } from '@vendure/core';

import { MEILI_REINDEX_BATCH_SIZE, type MeiliIndexJob } from './document.types.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime MeilisearchService
import { MeilisearchService } from './meilisearch.service.js';

type ReindexResponse = {
  ok: true;
  productCount: number;
  batchCount: number;
};

/**
 * `POST /hurc/meili/reindex` — superadmin-only. Slices the full product set
 * into batches of MEILI_REINDEX_BATCH_SIZE and enqueues one job per batch.
 *
 * (The matching admin-UI button is a Vendure UI extension; deferred to the
 * admin-UI extension PR. Until then this endpoint is callable directly.)
 */
@Controller('hurc/meili')
export class ReindexButtonController {
  constructor(
    private readonly meilisearch: MeilisearchService,
    private readonly productService: ProductService,
  ) {}

  @Post('reindex')
  @Allow(Permission.SuperAdmin)
  async reindex(@Ctx() ctx: RequestContext): Promise<ReindexResponse> {
    if (!this.meilisearch.isEnabled()) {
      return { ok: true, productCount: 0, batchCount: 0 };
    }
    const productIds = await this.collectAllProductIds(ctx);
    const batches: MeiliIndexJob[] = [];
    for (let i = 0; i < productIds.length; i += MEILI_REINDEX_BATCH_SIZE) {
      batches.push({
        kind: 'reindex-batch',
        productIds: [...productIds.slice(i, i + MEILI_REINDEX_BATCH_SIZE)],
      });
    }
    await this.meilisearch.enqueueMany(batches);
    return {
      ok: true,
      productCount: productIds.length,
      batchCount: batches.length,
    };
  }

  private async collectAllProductIds(ctx: RequestContext): Promise<string[]> {
    const ids: string[] = [];
    let skip = 0;
    const take = 500;
    for (;;) {
      const page = await this.productService.findAll(ctx, { skip, take });
      for (const p of page.items) ids.push(p.id.toString());
      if (page.items.length < take) break;
      skip += take;
    }
    return ids;
  }
}
