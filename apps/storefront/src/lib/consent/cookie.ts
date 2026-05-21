/**
 * Pure helpers for parsing and serialising the `hurc-consent` cookie.
 *
 * Kept dependency-free and DOM-free so they unit-test under Vitest's `node`
 * environment. The server-side reader (`./server`) and the client bridge
 * (`./client`) both compose these helpers.
 */

import { type ConsentCookiePayload, type ConsentState, defaultConsent } from './types';
import { CONSENT_COOKIE_MAX_AGE_SECONDS, CONSENT_COOKIE_NAME, CONSENT_VERSION } from './version';

const SERVICE_KEYS = ['plausible', 'posthog', 'sentry', 'klaviyo'] as const;

function isPayload(value: unknown): value is ConsentCookiePayload {
  if (typeof value !== 'object' || value === null) return false;
  const v = (value as { v?: unknown }).v;
  const services = (value as { services?: unknown }).services;
  if (typeof v !== 'string') return false;
  if (typeof services !== 'object' || services === null) return false;
  for (const key of SERVICE_KEYS) {
    if (typeof (services as Record<string, unknown>)[key] !== 'boolean') return false;
  }
  return true;
}

/**
 * Parse a raw cookie string. Returns `null` for any of:
 *   - the value is missing or empty,
 *   - the JSON is malformed,
 *   - the shape doesn't match `ConsentCookiePayload`,
 *   - the version doesn't match the current `CONSENT_VERSION`
 *     (stale consents are deliberately ignored — re-prompt the visitor).
 */
export function parseConsentCookie(raw: string | null | undefined): ConsentCookiePayload | null {
  if (raw === null || raw === undefined || raw === '') return null;
  let candidate: unknown;
  try {
    candidate = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isPayload(candidate)) return null;
  if (candidate.v !== CONSENT_VERSION) return null;
  return candidate;
}

/** Project a payload into the coarse `ConsentState` the rest of the app reads. */
export function payloadToState(payload: ConsentCookiePayload | null): ConsentState {
  if (payload === null) return defaultConsent;
  return {
    analytics: payload.services.posthog || payload.services.sentry,
    marketing: payload.services.klaviyo,
  };
}

/** Build a payload from per-service booleans. */
export function buildPayload(services: ConsentCookiePayload['services']): ConsentCookiePayload {
  return { v: CONSENT_VERSION, services };
}

/**
 * Serialise a payload into a `Set-Cookie` header value (first segment +
 * attributes). The result is suitable for both `cookies().set(...)` (which
 * parses attributes from the same string) and `document.cookie =`.
 */
export function serializeConsentCookie(
  payload: ConsentCookiePayload,
  options: { secure?: boolean; sameSite?: 'Lax' | 'Strict' | 'None' } = {},
): string {
  const value = encodeURIComponent(JSON.stringify(payload));
  const attrs = [
    `${CONSENT_COOKIE_NAME}=${value}`,
    `Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}`,
    'Path=/',
    `SameSite=${options.sameSite ?? 'Lax'}`,
  ];
  if (options.secure ?? true) attrs.push('Secure');
  return attrs.join('; ');
}

export { CONSENT_COOKIE_NAME, CONSENT_VERSION };
