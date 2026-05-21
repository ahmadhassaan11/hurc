import { describe, expect, it } from 'vitest';

import {
  ANALYTICS_SERVICES,
  KLARO_SERVICE_NAMES,
  klaroServiceCatalog,
  MARKETING_SERVICES,
} from '../../src/lib/consent/service-catalog';

describe('klaroServiceCatalog', () => {
  it('declares exactly five services (functional + four processors)', () => {
    expect(klaroServiceCatalog.map((s) => s.name).sort()).toEqual(
      ['functional', 'klaviyo', 'plausible', 'posthog', 'sentry'].sort(),
    );
  });

  it('marks functional + plausible as required (run regardless of consent)', () => {
    const functional = klaroServiceCatalog.find((s) => s.name === KLARO_SERVICE_NAMES.functional);
    const plausible = klaroServiceCatalog.find((s) => s.name === KLARO_SERVICE_NAMES.plausible);
    expect(functional?.required).toBe(true);
    expect(plausible?.required).toBe(true);
  });

  it('marks posthog/sentry/klaviyo as optional, default-deny', () => {
    for (const name of [
      KLARO_SERVICE_NAMES.posthog,
      KLARO_SERVICE_NAMES.sentry,
      KLARO_SERVICE_NAMES.klaviyo,
    ]) {
      const svc = klaroServiceCatalog.find((s) => s.name === name);
      expect(svc?.required).toBe(false);
      expect(svc?.default ?? false).toBe(false);
    }
  });

  it('every service declares at least one purpose', () => {
    for (const svc of klaroServiceCatalog) {
      expect(svc.purposes.length).toBeGreaterThan(0);
    }
  });

  it('analytics-flipping services are exactly posthog + sentry', () => {
    expect([...ANALYTICS_SERVICES].sort()).toEqual(['posthog', 'sentry']);
  });

  it('marketing-flipping services are exactly klaviyo', () => {
    expect([...MARKETING_SERVICES]).toEqual(['klaviyo']);
  });
});
