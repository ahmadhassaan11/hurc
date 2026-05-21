import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The client reads env at construction time, so we import it lazily after
// installing env mocks.

describe('SendcloudClient', () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'development',
      DATABASE_URL: 'postgres://hurc:hurc@localhost:5432/hurc',
      REDIS_URL: 'redis://localhost:6379',
      COOKIE_SECRET: 'a'.repeat(48),
      SUPERADMIN_USERNAME: 'admin',
      SUPERADMIN_PASSWORD: 'admin',
      STOREFRONT_URL: 'http://localhost:3001',
      BACKEND_PUBLIC_URL: 'http://localhost:3000',
      RESEND_API_KEY: 'rk',
      EMAIL_FROM: 'HURC <hello@hurc.local>',
      SANITY_WEBHOOK_SECRET: 'a'.repeat(32),
      NEXT_REVALIDATE_SECRET: 'a'.repeat(32),
      SENDCLOUD_PUBLIC_KEY: 'public',
      SENDCLOUD_SECRET_KEY: 'secret',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    vi.resetModules();
  });

  it('returns SHIPPING_PROVIDER_DISABLED when credentials missing', async () => {
    delete process.env.SENDCLOUD_PUBLIC_KEY;
    delete process.env.SENDCLOUD_SECRET_KEY;
    const { SendcloudClient } = await import('./sendcloud.client.js');
    const c = new SendcloudClient();
    const r = await c.listShippingMethods({ fromCountry: 'NL', toCountry: 'DE' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe('SHIPPING_PROVIDER_DISABLED');
      expect(r.error.retriable).toBe(false);
    }
  });

  it('classifies 5xx as retriable SHIPPING_PROVIDER_UNAVAILABLE', async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response('upstream down', {
          status: 503,
          headers: { 'content-type': 'text/plain' },
        }),
    );
    const { SendcloudClient } = await import('./sendcloud.client.js');
    const c = new SendcloudClient();
    const r = await c.listShippingMethods({ fromCountry: 'NL', toCountry: 'DE' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe('SHIPPING_PROVIDER_UNAVAILABLE');
      expect(r.error.status).toBe(503);
      expect(r.error.retriable).toBe(true);
    }
  });

  it('classifies 4xx as terminal SHIPPING_PROVIDER_4XX', async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response('bad request', {
          status: 422,
          headers: { 'content-type': 'text/plain' },
        }),
    );
    const { SendcloudClient } = await import('./sendcloud.client.js');
    const c = new SendcloudClient();
    const r = await c.listShippingMethods({ fromCountry: 'NL', toCountry: 'DE' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe('SHIPPING_PROVIDER_4XX');
      expect(r.error.retriable).toBe(false);
    }
  });

  it('parses a valid shipping_methods response', async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            shipping_methods: [
              {
                id: 8,
                name: 'DHL Standard',
                carrier: 'dhl',
                countries: [{ iso_2: 'DE', iso_3: 'DEU', price: '5.95' }],
              },
            ],
          }),
          { status: 200, headers: { 'content-type': 'application/json' } },
        ),
    );
    const { SendcloudClient } = await import('./sendcloud.client.js');
    const c = new SendcloudClient();
    const r = await c.listShippingMethods({ fromCountry: 'NL', toCountry: 'DE' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).toHaveLength(1);
      expect(r.data[0]?.name).toBe('DHL Standard');
    }
  });
});
