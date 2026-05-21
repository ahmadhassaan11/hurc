import { type RequestContext, VendureEvent } from '@vendure/core';

/**
 * Published by NewsletterService when a new subscription needs its
 * confirmation email sent. The hurc-email handler list subscribes to this
 * event and renders the `newsletter-confirm` template via the existing
 * EmailPlugin pipeline (so retries inherit the BullMQ semantics).
 */
export class NewsletterConfirmRequestedEvent extends VendureEvent {
  constructor(
    public readonly ctx: RequestContext,
    public readonly email: string,
    public readonly locale: 'en' | 'de',
    public readonly token: string,
  ) {
    super();
  }
}
