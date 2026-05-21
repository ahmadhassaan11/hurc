import { describe, expect, it } from 'vitest';

import {
  MEILI_FILTERABLE_ATTRIBUTES,
  MEILI_PRODUCT_INDEX,
  MEILI_QUEUE_NAME,
  MEILI_REINDEX_BATCH_SIZE,
  MEILI_SEARCHABLE_ATTRIBUTES,
  MEILI_SORTABLE_ATTRIBUTES,
} from './document.types.js';

describe('Meilisearch document constants', () => {
  it('uses the spec index name "products"', () => {
    expect(MEILI_PRODUCT_INDEX).toBe('products');
  });

  it('reindex batch size is the ADR-mandated 200', () => {
    expect(MEILI_REINDEX_BATCH_SIZE).toBe(200);
  });

  it('queue name is hurc-meili-index', () => {
    expect(MEILI_QUEUE_NAME).toBe('hurc-meili-index');
  });

  it('declares searchable / filterable / sortable attribute lists', () => {
    expect(MEILI_SEARCHABLE_ATTRIBUTES).toContain('name');
    expect(MEILI_FILTERABLE_ATTRIBUTES).toContain('inStock');
    expect(MEILI_SORTABLE_ATTRIBUTES).toContain('price');
  });
});
