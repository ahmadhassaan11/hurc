'use server';

import 'server-only';

import { getLocale } from 'next-intl/server';
import { z } from 'zod';

import { env } from '@/env';
import { actionClient } from '@/lib/actions/client';
import { logger } from '@/lib/logger/server';

const subscribeSchema = z.object({
  email: z.string().email(),
  /**
   * Honeypot detector. We accept any string here so a bot that fills
   * the field clears validation and reaches the body — where we
   * silently 200 to fool the bot into believing it succeeded.
   * Validation-rejecting bots gives them a signal to retry differently.
   */
  website: z.string().default(''),
});

function newsletterEndpoint(): string {
  const url = new URL(env.VENDURE_SHOP_API_URL_INTERNAL);
  // Strip the `/shop-api` (or any) path so we hit the backend root.
  url.pathname = '/newsletter/subscribe';
  url.search = '';
  return url.toString();
}

type NewsletterErrorCode = 'INVALID_EMAIL' | 'BOT_DETECTED' | 'UPSTREAM_ERROR';

export const subscribeNewsletterAction = actionClient
  .metadata({ name: 'newsletter/subscribe' })
  .inputSchema(subscribeSchema)
  .action(async ({ parsedInput }) => {
    if (parsedInput.website !== '') {
      // Honeypot tripped — silently accept and drop. Bot scripts read the
      // 200 and stop trying.
      return { ok: true as const, status: 'created' as const };
    }

    const locale = await getLocale();

    let res: Response;
    try {
      res = await fetch(newsletterEndpoint(), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: parsedInput.email, locale }),
        cache: 'no-store',
      });
    } catch (err) {
      logger.error({ err }, 'newsletter/subscribe network error');
      return {
        ok: false as const,
        error: 'UPSTREAM_ERROR' satisfies NewsletterErrorCode,
      };
    }

    if (!res.ok) {
      logger.warn(
        { status: res.status, statusText: res.statusText },
        'newsletter/subscribe non-2xx',
      );
      return {
        ok: false as const,
        error: 'UPSTREAM_ERROR' satisfies NewsletterErrorCode,
      };
    }

    const json = (await res.json()) as
      | { ok: true; status: 'created' | 'pending' | 'already_subscribed' }
      | { ok: false; error: string };

    if (!json.ok) {
      return {
        ok: false as const,
        error: 'UPSTREAM_ERROR' satisfies NewsletterErrorCode,
      };
    }

    return { ok: true as const, status: json.status };
  });
