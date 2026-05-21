import { describe, expect, it } from 'vitest';

import { allVatRates, euVatRates, ukVatRate } from '../src/tax.js';

describe('tax tables', () => {
  it('covers all 27 EU member states', () => {
    expect(euVatRates).toHaveLength(27);
  });

  it('UK row is GB at 20%', () => {
    expect(ukVatRate.iso).toBe('GB');
    expect(ukVatRate.standardRate).toBe(20);
  });

  it('every EU row has a 2-letter ISO and a positive rate', () => {
    for (const row of euVatRates) {
      expect(row.iso).toMatch(/^[A-Z]{2}$/);
      expect(row.standardRate).toBeGreaterThan(0);
      expect(row.standardRate).toBeLessThan(40);
    }
  });

  it('preserves Finland 25.5% and Hungary 27% as the EU max', () => {
    expect(euVatRates.find((r) => r.iso === 'FI')?.standardRate).toBe(25.5);
    expect(euVatRates.find((r) => r.iso === 'HU')?.standardRate).toBe(27);
    const max = Math.max(...euVatRates.map((r) => r.standardRate));
    expect(max).toBe(27);
  });

  it('allVatRates is the union of EU + UK', () => {
    expect(allVatRates).toHaveLength(28);
  });

  it('has no duplicate ISO codes', () => {
    const codes = allVatRates.map((r) => r.iso);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
