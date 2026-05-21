import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { raw as expressRaw } from 'express';

import { SanityRevalidateService } from './revalidate.service.js';
import { SanityWebhookController } from './webhook.controller.js';

/**
 * Sanity → Next.js ISR bridge.
 *
 * Receives `POST /webhooks/sanity` from Sanity Studio's webhook hook,
 * verifies the HMAC signature, maps the document payload to one or more
 * revalidation tags, and POSTs them to the storefront's
 * `/api/revalidate?secret=…` endpoint.
 *
 * The HMAC is computed over the **raw HTTP body bytes**, so this plugin
 * registers an `express.raw()` middleware that runs before Vendure's JSON
 * parser for this single route — `req.body` arrives as a `Buffer`.
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [SanityRevalidateService],
  controllers: [SanityWebhookController],
  configuration: (config) => {
    config.apiOptions.middleware = config.apiOptions.middleware ?? [];
    config.apiOptions.middleware.push({
      handler: expressRaw({ type: '*/*', limit: '5mb' }),
      route: 'webhooks/sanity',
      beforeListen: true,
    });
    return config;
  },
  compatibility: '^3.0.0',
})
export class SanityBridgePlugin {}
