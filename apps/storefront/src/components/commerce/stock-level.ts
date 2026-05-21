export type StockLevel = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

/**
 * Reduce Vendure's free-form `stockLevel` string to one of three
 * buckets. Vendure's defaults are "IN_STOCK", "OUT_OF_STOCK", and a
 * numeric string when configured for low-stock display.
 */
export function deriveStockLevel(raw: string): StockLevel {
  if (raw === 'OUT_OF_STOCK') return 'OUT_OF_STOCK';
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric > 0 && numeric <= 5) return 'LOW_STOCK';
  return 'IN_STOCK';
}
