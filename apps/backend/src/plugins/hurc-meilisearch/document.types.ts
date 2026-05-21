/**
 * Meilisearch index "products". One document per active variant — the
 * variant is the searchable unit (size/colour each have their own SKU and
 * price). The product-level fields (name/description/activity/collections)
 * are denormalised onto every variant so a search hit can render a card
 * without a follow-up DB query.
 */

export const MEILI_PRODUCT_INDEX = 'products' as const;

export type Activity = 'RUN' | 'TRAIN' | 'LIFT' | 'REST';

export type MeiliProductDoc = {
  /** Variant id, used as the Meilisearch primaryKey. */
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  /** Minor units, gross of VAT (channel `pricesIncludeTax: true`). */
  price: number;
  currency: string;
  activity: readonly Activity[];
  collections: readonly string[];
  facets: Readonly<Record<string, string | readonly string[]>>;
  inStock: boolean;
};

export const MEILI_SEARCHABLE_ATTRIBUTES: readonly (keyof MeiliProductDoc)[] = [
  'name',
  'sku',
  'description',
];

export const MEILI_FILTERABLE_ATTRIBUTES: readonly (keyof MeiliProductDoc)[] = [
  'activity',
  'collections',
  'currency',
  'inStock',
];

export const MEILI_SORTABLE_ATTRIBUTES: readonly (keyof MeiliProductDoc)[] = ['price'];

/**
 * Job payload for the `hurc-meili-index` BullMQ queue. Vendure's JobQueue
 * constrains payloads to `JsonCompatible<T>` — no `readonly` modifiers on
 * nested arrays, so `productIds` is a regular `string[]`.
 */
export type MeiliIndexJob =
  | { kind: 'upsert-variant'; variantId: string }
  | { kind: 'remove-variant'; variantId: string }
  | { kind: 'upsert-product'; productId: string }
  | { kind: 'remove-product'; productId: string }
  | { kind: 'reindex-batch'; productIds: string[] };

export const MEILI_QUEUE_NAME = 'hurc-meili-index' as const;
export const MEILI_REINDEX_BATCH_SIZE = 200;
