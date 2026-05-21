import { Injectable } from '@nestjs/common';
// EventBus / TransactionalConnection are runtime DI tokens; Customer is a
// runtime entity class for repository lookups.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI + TypeORM repos require runtime references
import {
  Customer,
  EventBus,
  Logger,
  type RequestContext,
  TransactionalConnection,
} from '@vendure/core';

import { env } from '../../env.js';
import { NewsletterConfirmRequestedEvent } from './newsletter-confirm-requested.event.js';
import { NewsletterSubscription } from './newsletter-subscription.entity.js';
import { issueToken, verifyToken } from './token.js';

const loggerCtx = 'NewsletterService';

export type SubscribeResult =
  | { ok: true; status: 'pending' }
  | { ok: true; status: 'already-verified' }
  | { ok: false; error: 'INVALID_EMAIL' };

export type ConfirmResult =
  | { ok: true; email: string }
  | { ok: false; error: 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'NOT_FOUND' };

export type UnsubscribeResult = { ok: true; removedCount: number };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normaliseLocale(input: string | undefined): 'en' | 'de' {
  return input && input.toLowerCase().startsWith('de') ? 'de' : 'en';
}

@Injectable()
export class NewsletterService {
  constructor(
    private readonly connection: TransactionalConnection,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Add or re-issue a pending subscription. Idempotent for already-verified
   * emails (returns `already-verified` without sending another confirmation).
   */
  async subscribe(
    ctx: RequestContext,
    rawEmail: string,
    rawLocale?: string,
  ): Promise<SubscribeResult> {
    const email = rawEmail.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return { ok: false, error: 'INVALID_EMAIL' };
    }
    const locale = normaliseLocale(rawLocale);
    const repo = this.connection.getRepository(ctx, NewsletterSubscription);
    const existing = await repo.findOne({ where: { email } });

    if (existing?.status === 'verified') {
      return { ok: true, status: 'already-verified' };
    }

    if (existing) {
      await repo.update(existing.id, {
        locale,
        status: 'pending',
      });
    } else {
      await repo.save(repo.create({ email, locale, status: 'pending', verifiedAt: null }));
    }

    const token = issueToken(email, env.COOKIE_SECRET);
    await this.eventBus.publish(new NewsletterConfirmRequestedEvent(ctx, email, locale, token));
    return { ok: true, status: 'pending' };
  }

  /**
   * Verify an HMAC token and promote the matching pending row to verified.
   * If a Customer with the same email exists, also stamp
   * `customer.customFields.marketingOptInAt` so opt-in is timestamped at the
   * legally meaningful moment (the click, not the submit).
   */
  async confirm(ctx: RequestContext, token: string): Promise<ConfirmResult> {
    const verified = verifyToken(token, env.COOKIE_SECRET);
    if (!verified.ok) {
      return {
        ok: false,
        error: verified.reason === 'expired' ? 'EXPIRED_TOKEN' : 'INVALID_TOKEN',
      };
    }
    const repo = this.connection.getRepository(ctx, NewsletterSubscription);
    const row = await repo.findOne({ where: { email: verified.email } });
    if (!row) return { ok: false, error: 'NOT_FOUND' };

    const now = new Date();
    await repo.update(row.id, { status: 'verified', verifiedAt: now });

    await this.markCustomerOptedIn(ctx, verified.email, now);

    Logger.info(`Newsletter subscription verified for ${verified.email}`, loggerCtx);
    return { ok: true, email: verified.email };
  }

  async unsubscribe(ctx: RequestContext, rawEmail: string): Promise<UnsubscribeResult> {
    const email = rawEmail.trim().toLowerCase();
    const repo = this.connection.getRepository(ctx, NewsletterSubscription);
    const result = await repo.update({ email }, { status: 'unsubscribed', verifiedAt: null });
    await this.markCustomerOptedOut(ctx, email);
    return { ok: true, removedCount: result.affected ?? 0 };
  }

  private async markCustomerOptedIn(ctx: RequestContext, email: string, at: Date): Promise<void> {
    const repo = this.connection.getRepository(ctx, Customer);
    const customer = await repo.findOne({ where: { emailAddress: email } });
    if (!customer) return;
    await repo.update(customer.id, {
      customFields: {
        ...(customer.customFields ?? {}),
        marketingOptIn: true,
        marketingOptInAt: at,
      },
    });
  }

  private async markCustomerOptedOut(ctx: RequestContext, email: string): Promise<void> {
    const repo = this.connection.getRepository(ctx, Customer);
    const customer = await repo.findOne({ where: { emailAddress: email } });
    if (!customer) return;
    await repo.update(customer.id, {
      customFields: {
        ...(customer.customFields ?? {}),
        marketingOptIn: false,
      },
    });
  }
}
