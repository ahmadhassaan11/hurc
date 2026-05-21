import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

// `NEXT_PUBLIC_POSTHOG_HOST` has a default in env.ts and is intentionally
// omitted here.
const REQUIRED_KEYS = [
  'NEXT_PUBLIC_VENDURE_SHOP_API_URL',
  'VENDURE_SHOP_API_URL_INTERNAL',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'NEXT_PUBLIC_POSTHOG_KEY',
] as const;

const VALID_ENV: Record<string, string> = {
  NODE_ENV: 'test',
  APP_ENV: 'dev',
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: 'http://localhost:3001/shop-api',
  VENDURE_SHOP_API_URL_INTERNAL: 'http://localhost:3001/shop-api',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'hurc.local',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_dummy',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com',
};

const ORIGINAL_ENV = { ...process.env };

function resetEnv(): void {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) delete process.env[key];
  }
  Object.assign(process.env, ORIGINAL_ENV);
  for (const key of Object.keys(VALID_ENV)) {
    delete process.env[key];
  }
}

beforeEach(() => {
  resetEnv();
  vi.resetModules();
});

afterAll(() => {
  resetEnv();
});

describe('storefront env', () => {
  it('parses a valid environment', async () => {
    Object.assign(process.env, VALID_ENV);
    const mod = await import('../../src/env');
    expect(mod.env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000');
    expect(mod.env.NODE_ENV).toBe('test');
  });

  it.each(REQUIRED_KEYS)('rejects missing %s', async (key) => {
    Object.assign(process.env, VALID_ENV);
    delete process.env[key];

    await expect(import('../../src/env')).rejects.toThrow();
  });

  it('rejects malformed URLs', async () => {
    Object.assign(process.env, VALID_ENV, {
      NEXT_PUBLIC_SITE_URL: 'not-a-url',
    });
    await expect(import('../../src/env')).rejects.toThrow();
  });
});
