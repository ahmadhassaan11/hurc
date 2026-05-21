import type { Locale } from '@/i18n/routing';

import { currencyForLocale } from './locale';

/**
 * Format an integer minor-unit amount as a currency string in the given
 * locale. Vendure exposes prices as integer minor units (CLAUDE.md §8); the
 * storefront only formats at the edge.
 *
 * `currency` accepts any ISO 4217 string — Vendure's `CurrencyCode` enum
 * is exhaustive over the world's currencies; we don't try to narrow the
 * input here because callers source the value from server responses.
 */
export function formatMoney(
  minorUnits: number,
  locale: Locale,
  currency: string = currencyForLocale(locale),
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  return formatter.format(minorUnits / 100);
}

export function formatDate(value: string | Date, locale: Locale): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
