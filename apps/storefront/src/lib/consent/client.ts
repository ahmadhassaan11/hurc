/**
 * Client-side cookie helpers for the Klaro bridge. These exist because
 * Klaro stores its decisions in its own cookie (`klaro-cookie`) but our
 * server reads `hurc-consent` — the bridge mirrors one to the other on
 * every Klaro change event.
 *
 * Kept thin; serialisation lives in `./cookie` so it is testable under
 * Vitest's `node` environment.
 */

import { buildPayload, parseConsentCookie, serializeConsentCookie } from './cookie';
import { type ConsentCookiePayload, type ConsentState } from './types';
import { CONSENT_COOKIE_NAME } from './version';

function readDocumentCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

export function readConsentClient(): ConsentCookiePayload | null {
  return parseConsentCookie(readDocumentCookie(CONSENT_COOKIE_NAME));
}

export function writeConsentClient(services: ConsentCookiePayload['services']): void {
  if (typeof document === 'undefined') return;
  const isSecure = window.location.protocol === 'https:';
  document.cookie = serializeConsentCookie(buildPayload(services), { secure: isSecure });
}

/** Project per-service decisions into the coarse `ConsentState` the app uses. */
export function servicesToState(services: ConsentCookiePayload['services']): ConsentState {
  return {
    analytics: services.posthog || services.sentry,
    marketing: services.klaviyo,
  };
}
