import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const BASE_ENV = {
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: 'http://localhost:3001/shop-api',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'hurc.local',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_dummy',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com',
};
const ORIGINAL = { ...process.env };

afterAll(() => {
  for (const k of Object.keys(BASE_ENV)) delete process.env[k];
  delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  delete process.env.NEXT_PUBLIC_SANITY_DATASET;
  Object.assign(process.env, ORIGINAL);
});

beforeEach(() => {
  vi.resetModules();
});

describe('urlFor (Sanity not configured)', () => {
  beforeEach(() => {
    Object.assign(process.env, BASE_ENV);
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_SANITY_DATASET;
  });

  it('returns null for any source', async () => {
    const { urlFor } = await import('../../src/lib/sanity/image');
    expect(urlFor({ asset: { _ref: 'image-abc-100x100-jpg' } })).toBeNull();
    expect(urlFor(null)).toBeNull();
    expect(urlFor(undefined)).toBeNull();
  });
});

describe('urlFor (Sanity configured)', () => {
  beforeEach(() => {
    Object.assign(process.env, BASE_ENV);
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'abc123';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  });

  it('returns a builder that produces a CDN URL', async () => {
    const { urlFor } = await import('../../src/lib/sanity/image');
    const builder = urlFor({ asset: { _ref: 'image-abc-100x100-jpg' } });
    expect(builder).not.toBeNull();
    const url = builder!.width(640).quality(80).url();
    expect(url).toContain('cdn.sanity.io');
    expect(url).toContain('abc123');
    expect(url).toContain('production');
  });

  it('returns null for a null source even when configured', async () => {
    const { urlFor } = await import('../../src/lib/sanity/image');
    expect(urlFor(null)).toBeNull();
  });
});
