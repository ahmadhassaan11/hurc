import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { sendcloudEligibilityChecker } from './eligibility-checker.js';
import { SendcloudClient } from './sendcloud.client.js';
import { sendcloudShippingCalculator } from './shipping-calculator.js';

/**
 * Sendcloud shipping plugin (ADR R2 deviation — no published JS SDK; we hit
 * the v2 REST API directly).
 *
 * Adds one calculator (`sendcloud-rate`) and one eligibility checker
 * (`sendcloud-zone`) to Vendure's shipping options. Each Vendure
 * ShippingMethod row picks them via code + args (zone, sendcloudMethodId,
 * fromCountry, fallbackPrice).
 *
 * Live rates require `SENDCLOUD_PUBLIC_KEY` + `SENDCLOUD_SECRET_KEY`; the
 * calculator falls back to a flat rate when those are unset (dev) or when
 * Sendcloud is unreachable (transient prod failure).
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [SendcloudClient],
  configuration: (config) => {
    config.shippingOptions.shippingCalculators.push(sendcloudShippingCalculator);
    config.shippingOptions.shippingEligibilityCheckers.push(sendcloudEligibilityChecker);
    return config;
  },
  compatibility: '^3.0.0',
})
export class SendcloudPlugin {}
