import { describe, expect, it } from 'vitest';

import { routing } from '../../src/i18n/routing';
import { formatDate, formatMoney } from '../../src/lib/intl/format';
import { currencyForLocale, languageForLocale } from '../../src/lib/intl/locale';

describe('locale → language / currency mapping', () => {
  it('maps every storefront locale to a Vendure LanguageCode', () => {
    for (const locale of routing.locales) {
      expect(languageForLocale(locale)).toBe(locale);
    }
  });

  it('returns EUR for every Phase 4 locale', () => {
    for (const locale of routing.locales) {
      expect(currencyForLocale(locale)).toBe('EUR');
    }
  });
});

describe('intl formatters', () => {
  it('formats integer minor units as currency', () => {
    expect(formatMoney(1999, 'en')).toMatch(/€\s?19\.99/);
    expect(formatMoney(1999, 'de')).toMatch(/19,99\s?€/);
  });

  it('formats dates using the locale long form', () => {
    const dec = new Date('2026-12-24T00:00:00Z');
    expect(formatDate(dec, 'en')).toMatch(/December/);
    expect(formatDate(dec, 'de')).toMatch(/Dezember/);
  });
});
