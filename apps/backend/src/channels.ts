/**
 * Channel + Zone seed data. Consumed by the seed script (sub-task 2.9) and by
 * any future tooling that needs to know "what shape does HURC's commerce graph
 * look like before any orders flow."
 *
 * - `default` is admin-only (every Vendure install needs a default channel; we
 *   don't sell from it).
 * - `eu` covers all 27 EU member states, EUR, prices include VAT.
 * - `uk` is GB only, GBP, prices include VAT.
 */

import { type CountryIso, euVatRates, ukVatRate } from './tax.js';

export type SupportedLanguage = 'en' | 'de' | 'fr' | 'nl' | 'es' | 'it';
export type SupportedCurrency = 'EUR' | 'GBP';
export type ChannelCode = 'default' | 'eu' | 'uk';

export type ChannelDefinition = {
  code: ChannelCode;
  /**
   * Vendure Channel `token` — referenced as `vendure-token` HTTP header to
   * scope shop-api requests. Storefront reads these via env, so they need to
   * be stable strings, not auto-generated. Doppler can override per-env.
   */
  token: string;
  defaultLanguageCode: SupportedLanguage;
  availableLanguageCodes: readonly SupportedLanguage[];
  defaultCurrencyCode: SupportedCurrency;
  availableCurrencyCodes: readonly SupportedCurrency[];
  pricesIncludeTax: boolean;
  trackInventory: boolean;
};

export const channels: readonly ChannelDefinition[] = [
  {
    code: 'default',
    token: 'hurc-default',
    defaultLanguageCode: 'en',
    availableLanguageCodes: ['en'],
    defaultCurrencyCode: 'EUR',
    availableCurrencyCodes: ['EUR'],
    pricesIncludeTax: true,
    trackInventory: true,
  },
  {
    code: 'eu',
    token: 'hurc-eu',
    defaultLanguageCode: 'en',
    availableLanguageCodes: ['en', 'de', 'fr', 'nl', 'es', 'it'],
    defaultCurrencyCode: 'EUR',
    availableCurrencyCodes: ['EUR'],
    pricesIncludeTax: true,
    trackInventory: true,
  },
  {
    code: 'uk',
    token: 'hurc-uk',
    defaultLanguageCode: 'en',
    availableLanguageCodes: ['en'],
    defaultCurrencyCode: 'GBP',
    availableCurrencyCodes: ['GBP'],
    pricesIncludeTax: true,
    trackInventory: true,
  },
];

export type ZoneCode = 'EU' | 'UK';

export type ZoneDefinition = {
  code: ZoneCode;
  name: string;
  countryCodes: readonly CountryIso[];
};

export const zones: readonly ZoneDefinition[] = [
  {
    code: 'EU',
    name: 'European Union',
    countryCodes: euVatRates.map((row) => row.iso),
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    countryCodes: [ukVatRate.iso],
  },
];

/**
 * Each channel binds to exactly one tax zone. The seed script wires this into
 * Vendure as a `defaultTaxZone` on the channel.
 */
export const channelToZone: Readonly<Record<ChannelCode, ZoneCode | null>> = {
  default: null,
  eu: 'EU',
  uk: 'UK',
};
