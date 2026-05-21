import 'server-only';

import { cookies } from 'next/headers';

import { parseConsentCookie, payloadToState } from './cookie';
import { type ConsentState, defaultConsent } from './types';
import { CONSENT_COOKIE_NAME } from './version';

/**
 * RSC-safe consent reader. Returns `defaultConsent` if no cookie, malformed
 * JSON, or stale version — never throws. Used by `[locale]/layout.tsx` to
 * hydrate `<ConsentProvider initialValue={...}>` so PostHog/Sentry can
 * initialise on the same render that produced the response.
 */
export async function readConsentCookie(): Promise<ConsentState> {
  try {
    const store = await cookies();
    const raw = store.get(CONSENT_COOKIE_NAME)?.value ?? null;
    const decoded = raw === null ? null : decodeURIComponent(raw);
    return payloadToState(parseConsentCookie(decoded));
  } catch {
    // `cookies()` throws when called outside a request context (e.g. during
    // static generation). Default-deny is the correct fallback there too.
    return defaultConsent;
  }
}
