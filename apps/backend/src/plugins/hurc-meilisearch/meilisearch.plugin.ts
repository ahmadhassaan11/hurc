import { type OnApplicationBootstrap } from '@nestjs/common';
// EventBus is a runtime DI token; type-only import would break NestJS DI.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime EventBus
import {
  EventBus,
  PluginCommonModule,
  ProductEvent,
  ProductVariantEvent,
  StockMovementEvent,
  VendurePlugin,
} from '@vendure/core';

import { MeilisearchService } from './meilisearch.service.js';
import { ReindexButtonController } from './reindex-button.controller.js';

/**
 * HURC Meilisearch indexing plugin.
 *
 * Subscribes to ProductEvent / ProductVariantEvent / StockMovementEvent and
 * enqueues jobs onto the `hurc-meili-index` Vendure JobQueue (which is
 * backed by BullMQ via the BullMQJobQueuePlugin wired in 2.2). The job
 * processor is owned by `MeilisearchService.onApplicationBootstrap`.
 *
 * Admin trigger: `POST /hurc/meili/reindex` slices all products into batches
 * of MEILI_REINDEX_BATCH_SIZE and enqueues one job per batch.
 *
 * If MEILI_HOST is unset (dev), the service is enabled but every write is a
 * no-op — events still fire and jobs still enqueue, but the service skips
 * the actual Meilisearch round-trip.
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [MeilisearchService],
  controllers: [ReindexButtonController],
  compatibility: '^3.0.0',
})
export class MeilisearchPlugin implements OnApplicationBootstrap {
  constructor(
    private readonly eventBus: EventBus,
    private readonly meilisearch: MeilisearchService,
  ) {}

  onApplicationBootstrap(): void {
    this.eventBus.ofType(ProductEvent).subscribe((event: ProductEvent) => {
      const productId = event.entity.id.toString();
      this.meilisearch.enqueue(
        event.type === 'deleted'
          ? { kind: 'remove-product', productId }
          : { kind: 'upsert-product', productId },
      );
    });

    this.eventBus.ofType(ProductVariantEvent).subscribe((event: ProductVariantEvent) => {
      for (const variant of event.entity) {
        const variantId = variant.id.toString();
        this.meilisearch.enqueue(
          event.type === 'deleted'
            ? { kind: 'remove-variant', variantId }
            : { kind: 'upsert-variant', variantId },
        );
      }
    });

    this.eventBus.ofType(StockMovementEvent).subscribe((event: StockMovementEvent) => {
      const variantIds = new Set<string>();
      for (const m of event.stockMovements) {
        if (m.productVariant?.id !== undefined) {
          variantIds.add(m.productVariant.id.toString());
        }
      }
      for (const variantId of variantIds) {
        this.meilisearch.enqueue({ kind: 'upsert-variant', variantId });
      }
    });
  }
}
