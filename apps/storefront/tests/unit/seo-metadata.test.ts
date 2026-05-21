import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const VALID_ENV = {
  NODE_ENV: 'test',
  APP_ENV: 'dev',
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: 'http://localhost:3001/shop-api',
  VENDURE_SHOP_API_URL_INTERNAL: 'http://localhost:3001/shop-api',
  NEXT_PUBLIC_SITE_URL: 'https://hurc.test',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'hurc.test',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_dummy',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com',
};

const ORIGINAL = { ...process.env };

beforeAll(() => {
  vi.resetModules();
  Object.assign(process.env, VALID_ENV);
});

afterAll(() => {
  for (const k of Object.keys(VALID_ENV)) delete process.env[k];
  Object.assign(process.env, ORIGINAL);
});

describe('buildMetadata', () => {
  it('produces a canonical URL on the configured site host', async () => {
    const { buildMetadata } = await import('../../src/lib/seo/metadata');
    const m = buildMetadata({ path: '/de/products/meridian-jacket' });
    expect(m.alternates?.canonical).toBe('https://hurc.test/de/products/meridian-jacket');
  });

  it('prefixes a missing leading slash on the path', async () => {
    const { buildMetadata } = await import('../../src/lib/seo/metadata');
    const m = buildMetadata({ path: 'about' });
    expect(m.alternates?.canonical).toBe('https://hurc.test/about');
  });

  it('honours noIndex by emitting robots noindex/nofollow', async () => {
    const { buildMetadata } = await import('../../src/lib/seo/metadata');
    const m = buildMetadata({ path: '/checkout', noIndex: true });
    expect(m.robots).toMatchObject({ index: false, follow: false });
  });

  it('attaches OG image when provided', async () => {
    const { buildMetadata } = await import('../../src/lib/seo/metadata');
    const m = buildMetadata({
      path: '/',
      ogImage: { url: 'https://cdn/og.png', alt: 'HURC' },
    });
    expect(m.openGraph?.images).toBeDefined();
    expect(m.twitter?.images).toBeDefined();
  });
});
