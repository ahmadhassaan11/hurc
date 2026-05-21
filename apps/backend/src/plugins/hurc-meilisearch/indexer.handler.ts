import type { MeiliIndexJob } from './document.types.js';
import type { MeilisearchService } from './meilisearch.service.js';

/**
 * Job processor for the `hurc-meili-index` queue. Dispatches the discriminated
 * `MeiliIndexJob` payload to the right MeilisearchService method. Errors throw
 * so BullMQ retries per the queue's retention/backoff policy.
 */
export async function processIndexJob(
  service: MeilisearchService,
  data: MeiliIndexJob,
): Promise<void> {
  switch (data.kind) {
    case 'upsert-variant':
      await service.upsertVariant(data.variantId);
      return;
    case 'remove-variant':
      await service.removeVariant(data.variantId);
      return;
    case 'upsert-product':
      await service.upsertAllVariantsOfProduct(data.productId);
      return;
    case 'remove-product':
      await service.removeAllVariantsOfProduct(data.productId);
      return;
    case 'reindex-batch':
      await service.indexBatch(data.productIds);
      return;
  }
}
