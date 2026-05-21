import { describe, expect, it } from 'vitest';

import {
  CONSENT_COOKIE_MAX_AGE_SECONDS,
  CONSENT_COOKIE_NAME,
  CONSENT_VERSION,
} from '../../src/lib/consent/version';

describe('consent version constants', () => {
  it('exposes a non-empty cookie name', () => {
    expect(CONSENT_COOKIE_NAME).toMatch(/^[a-z0-9-]+$/i);
    expect(CONSENT_COOKIE_NAME.length).toBeGreaterThan(0);
  });

  it('exposes a date-shaped version token', () => {
    // Bumping the version is a deliberate act — the date format makes the
    // intent obvious in diffs. Format is YYYY-MM-DD; runtime treats it as
    // an opaque string.
    expect(CONSENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('caps the cookie at 12 months — DSGVO upper bound', () => {
    const twelveMonths = 60 * 60 * 24 * 365;
    expect(CONSENT_COOKIE_MAX_AGE_SECONDS).toBe(twelveMonths);
  });
});
