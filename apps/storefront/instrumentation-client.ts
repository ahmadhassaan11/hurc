/**
 * Client-side Sentry init runs only after the user grants analytics consent.
 * Phase 8 wires the read against the first-party `hurc-consent` cookie that
 * the Klaro bridge mirrors on every change. Sentry's browser SDK is loaded
 * by Next's instrumentation hook only if the cookie's `sentry` flag is
 * `true` at first paint; subsequent flips are handled by Klaro's own
 * service `callback` (which reloads the page is *not* desired — Sentry
 * gracefully starts after a navigation when consent flips on).
 */

import * as Sentry from '@sentry/nextjs';

import { clientEnv } from '@/env.client';
import { readConsentClient } from '@/lib/consent/client';

function getClientConsent(): boolean {
  if (typeof document === 'undefined') return false;
  const payload = readConsentClient();
  return payload?.services.sentry === true;
}

if (
  typeof window !== 'undefined' &&
  clientEnv.NEXT_PUBLIC_SENTRY_DSN !== undefined &&
  getClientConsent()
) {
  Sentry.init({
    dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
