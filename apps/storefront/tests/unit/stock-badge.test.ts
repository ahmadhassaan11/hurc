import { describe, expect, it } from 'vitest';

import { deriveStockLevel } from '../../src/components/commerce/stock-level';

describe('deriveStockLevel', () => {
  it('maps OUT_OF_STOCK to OUT_OF_STOCK', () => {
    expect(deriveStockLevel('OUT_OF_STOCK')).toBe('OUT_OF_STOCK');
  });

  it('maps numeric ≤ 5 to LOW_STOCK', () => {
    expect(deriveStockLevel('1')).toBe('LOW_STOCK');
    expect(deriveStockLevel('5')).toBe('LOW_STOCK');
  });

  it('maps numeric > 5 and IN_STOCK strings to IN_STOCK', () => {
    expect(deriveStockLevel('6')).toBe('IN_STOCK');
    expect(deriveStockLevel('1000')).toBe('IN_STOCK');
    expect(deriveStockLevel('IN_STOCK')).toBe('IN_STOCK');
  });

  it('maps zero numeric to IN_STOCK (Vendure shows OUT_OF_STOCK string when 0)', () => {
    expect(deriveStockLevel('0')).toBe('IN_STOCK');
  });
});
