export const SORT_VALUES = ['name-asc', 'name-desc', 'price-asc', 'price-desc'] as const;
export type SortValue = (typeof SORT_VALUES)[number];

export const DEFAULT_SORT: SortValue = 'name-asc';

export function isSortValue(value: string | undefined): value is SortValue {
  return value !== undefined && (SORT_VALUES as readonly string[]).includes(value);
}
