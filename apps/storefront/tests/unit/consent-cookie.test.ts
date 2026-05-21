import { describe, expect, it } from 'vitest';

import {
  buildPayload,
  parseConsentCookie,
  payloadToState,
  serializeConsentCookie,
} from '../../src/lib/consent/cookie';
import { defaultConsent } from '../../src/lib/consent/types';
import {
  CONSENT_COOKIE_MAX_AGE_SECONDS,
  CONSENT_COOKIE_NAME,
  CONSENT_VERSION,
} from '../../src/lib/consent/version';

const validServices = {
  plausible: true,
  posthog: true,
  sentry: false,
  klaviyo: false,
};

const validRaw = JSON.stringify({ v: CONSENT_VERSION, services: validServices });

describe('parseConsentCookie', () => {
  it('returns null for null/undefined/empty input', () => {
    expect(parseConsentCookie(null)).toBeNull();
    expect(parseConsentCookie(undefined)).toBeNull();
    expect(parseConsentCookie('')).toBeNull();
  });

  it('returns null for malformed JSON', () => {
    expect(parseConsentCookie('not json')).toBeNull();
    expect(parseConsentCookie('{')).toBeNull();
  });

  it('returns null when payload shape is wrong', () => {
    expect(parseConsentCookie(JSON.stringify({}))).toBeNull();
    expect(parseConsentCookie(JSON.stringify({ v: 'x' }))).toBeNull();
    expect(
      parseConsentCookie(JSON.stringify({ v: CONSENT_VERSION, services: { plausible: 'yes' } })),
    ).toBeNull();
  });

  it('returns null when version is stale (deliberate re-prompt)', () => {
    const stale = JSON.stringify({ v: '1900-01-01', services: validServices });
    expect(parseConsentCookie(stale)).toBeNull();
  });

  it('parses a well-formed current-version payload', () => {
    const parsed = parseConsentCookie(validRaw);
    expect(parsed).not.toBeNull();
    expect(parsed?.v).toBe(CONSENT_VERSION);
    expect(parsed?.services).toEqual(validServices);
  });
});

describe('payloadToState', () => {
  it('default-denies on null', () => {
    expect(payloadToState(null)).toEqual(defaultConsent);
  });

  it('flips analytics when posthog OR sentry is granted', () => {
    expect(
      payloadToState({
        v: CONSENT_VERSION,
        services: { plausible: true, posthog: true, sentry: false, klaviyo: false },
      }),
    ).toEqual({ analytics: true, marketing: false });
    expect(
      payloadToState({
        v: CONSENT_VERSION,
        services: { plausible: true, posthog: false, sentry: true, klaviyo: false },
      }),
    ).toEqual({ analytics: true, marketing: false });
  });

  it('flips marketing only when klaviyo is granted', () => {
    expect(
      payloadToState({
        v: CONSENT_VERSION,
        services: { plausible: true, posthog: false, sentry: false, klaviyo: true },
      }),
    ).toEqual({ analytics: false, marketing: true });
  });
});

describe('buildPayload + serializeConsentCookie', () => {
  it('round-trips cleanly', () => {
    const payload = buildPayload(validServices);
    const cookie = serializeConsentCookie(payload);
    const value = cookie.split(';')[0]!.split('=')[1]!;
    const decoded = decodeURIComponent(value);
    expect(parseConsentCookie(decoded)).toEqual(payload);
  });

  it('writes Secure + Lax + Path=/ + Max-Age by default', () => {
    const cookie = serializeConsentCookie(buildPayload(validServices));
    expect(cookie).toContain(`${CONSENT_COOKIE_NAME}=`);
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain(`Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}`);
  });

  it('omits Secure when secure: false (dev http)', () => {
    const cookie = serializeConsentCookie(buildPayload(validServices), { secure: false });
    expect(cookie).not.toContain('Secure');
  });
});
