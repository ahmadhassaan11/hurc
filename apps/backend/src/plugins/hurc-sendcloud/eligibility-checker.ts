import { LanguageCode, ShippingEligibilityChecker } from '@vendure/core';

import { euVatRates } from '../../tax.js';

const EU_COUNTRY_SET: ReadonlySet<string> = new Set(euVatRates.map((row) => row.iso));

/**
 * Pure zone match. The two HURC zones (EU and UK) cover the spec's full
 * geography. A Vendure ShippingMethod row picks one zone via `args.zone`,
 * and only orders shipping there see the method as eligible.
 */
export const sendcloudEligibilityChecker = new ShippingEligibilityChecker({
  code: 'sendcloud-zone',
  description: [
    {
      languageCode: LanguageCode.en,
      value: 'Sendcloud — destination matches HURC shipping zone',
    },
  ],
  args: {
    zone: {
      type: 'string',
      label: [{ languageCode: LanguageCode.en, value: 'Zone' }],
      ui: { component: 'select-form-input', options: [{ value: 'EU' }, { value: 'UK' }] },
    },
  },
  check: (_ctx, order, args) => {
    const country = order.shippingAddress?.countryCode;
    if (!country) return false;
    if (args.zone === 'EU') return EU_COUNTRY_SET.has(country);
    if (args.zone === 'UK') return country === 'GB';
    return false;
  },
});
