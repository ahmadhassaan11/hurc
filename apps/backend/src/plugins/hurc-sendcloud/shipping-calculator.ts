// Logger / ShippingCalculator / LanguageCode are runtime values.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- runtime references
import { Injector, LanguageCode, Logger, ShippingCalculator } from '@vendure/core';

import { SendcloudClient } from './sendcloud.client.js';

const loggerCtx = 'SendcloudShippingCalculator';

let _injector: Injector | undefined;
const getInjector = (): Injector => {
  if (!_injector) {
    throw new Error('Sendcloud shipping calculator init() never ran');
  }
  return _injector;
};

/**
 * Vendure ShippingCalculator backed by Sendcloud. Each Vendure ShippingMethod
 * row carries the `sendcloudMethodId` for the underlying carrier method
 * (DHL Standard, Royal Mail Tracked, etc.) and the `fromCountry` warehouse
 * origin. At checkout, the calculator pulls live rates from Sendcloud's
 * `/shipping_methods` endpoint for the order's destination.
 *
 * Failure modes (Sendcloud disabled, 5xx, malformed response) all fall back
 * to `fallbackPrice` so the customer can still complete checkout. The error
 * is logged at error level for paging.
 */
export const sendcloudShippingCalculator = new ShippingCalculator({
  code: 'sendcloud-rate',
  description: [
    {
      languageCode: LanguageCode.en,
      value: 'Sendcloud — live rate for selected carrier method',
    },
  ],
  args: {
    sendcloudMethodId: {
      type: 'int',
      label: [{ languageCode: LanguageCode.en, value: 'Sendcloud method ID' }],
    },
    fromCountry: {
      type: 'string',
      defaultValue: 'NL',
      label: [{ languageCode: LanguageCode.en, value: 'Warehouse country (ISO-2)' }],
    },
    fallbackPrice: {
      type: 'int',
      defaultValue: 595,
      label: [
        {
          languageCode: LanguageCode.en,
          value: 'Fallback price (minor units, used on Sendcloud failure)',
        },
      ],
    },
  },
  init: (injector) => {
    _injector = injector;
  },
  calculate: async (_ctx, order, args) => {
    const client = getInjector().get(SendcloudClient);
    const toCountry = order.shippingAddress?.countryCode;

    if (!toCountry) {
      return {
        price: args.fallbackPrice,
        priceIncludesTax: true,
        taxRate: 0,
      };
    }

    if (!client.isEnabled()) {
      Logger.warn(
        `Sendcloud disabled — falling back to ${args.fallbackPrice} minor units for ${toCountry}`,
        loggerCtx,
      );
      return {
        price: args.fallbackPrice,
        priceIncludesTax: true,
        taxRate: 0,
      };
    }

    const result = await client.listShippingMethods({
      fromCountry: args.fromCountry,
      toCountry,
    });

    if (!result.ok) {
      Logger.error(
        `Sendcloud rate fetch failed (${result.error.code} ${result.error.status}): ${result.error.message}`,
        loggerCtx,
      );
      return {
        price: args.fallbackPrice,
        priceIncludesTax: true,
        taxRate: 0,
      };
    }

    const method = result.data.find((m) => m.id === args.sendcloudMethodId);
    const countryRate = method?.countries.find((c) => c.iso_2 === toCountry);
    const parsed = countryRate?.price ? Number(countryRate.price) : NaN;
    const priceMinor = Number.isFinite(parsed) ? Math.round(parsed * 100) : args.fallbackPrice;

    return {
      price: priceMinor,
      priceIncludesTax: true,
      taxRate: 0,
    };
  },
});
