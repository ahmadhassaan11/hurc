import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { NewsletterController } from './newsletter.controller.js';
import { NewsletterService } from './newsletter.service.js';
import { NewsletterSubscription } from './newsletter-subscription.entity.js';

/**
 * Newsletter double-opt-in plugin.
 *
 * Endpoints (all `Permission.Public`):
 *   - POST /newsletter/subscribe    body: { email, locale? }
 *   - POST /newsletter/confirm      body: { token }
 *   - POST /newsletter/unsubscribe  body: { email }
 *
 * Tokens are HMAC-SHA256 over `<emailB64>.<tsB64>` with COOKIE_SECRET; valid
 * for 24 hours. The confirmation email is rendered + delivered through the
 * existing EmailPlugin pipeline (handler in src/email/handlers.ts) so retries
 * inherit BullMQ semantics.
 *
 * Resend Audience sync (verified contacts → marketing audience) is a planned
 * follow-up; the local NewsletterSubscription table is currently the sole
 * source of truth.
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [NewsletterSubscription],
  providers: [NewsletterService],
  controllers: [NewsletterController],
  compatibility: '^3.0.0',
})
export class NewsletterPlugin {}
