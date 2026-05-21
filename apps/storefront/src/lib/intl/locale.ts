import type { Locale } from '@/i18n/routing';

/**
 * Map a storefront locale code to the Vendure `LanguageCode` enum value.
 * Vendure's enum is exhaustive over ISO 639-1 codes — every storefront
 * locale we support has a one-to-one match. Verified against the Phase 3
 * shop-api SDL snapshot.
 */
const localeToLanguage = {
  en: 'en',
  de: 'de',
  fr: 'fr',
  nl: 'nl',
  es: 'es',
  it: 'it',
} as const satisfies Record<Locale, string>;

export type LanguageCode = (typeof localeToLanguage)[Locale];

export function languageForLocale(locale: Locale): LanguageCode {
  return localeToLanguage[locale];
}

/**
 * Map a locale to the currency it should display. EU locales render EUR.
 * The UK channel (`en-GB`) lands in Phase 6 and adds GBP at that point.
 */
const localeToCurrency = {
  en: 'EUR',
  de: 'EUR',
  fr: 'EUR',
  nl: 'EUR',
  es: 'EUR',
  it: 'EUR',
} as const satisfies Record<Locale, string>;

export type CurrencyCode = (typeof localeToCurrency)[Locale];

export function currencyForLocale(locale: Locale): CurrencyCode {
  return localeToCurrency[locale];
}
