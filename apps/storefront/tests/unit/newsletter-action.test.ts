import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const VALID_ENV = {
  NODE_ENV: 'test',
  APP_ENV: 'dev',
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: 'http://localhost:3001/shop-api',
  VENDURE_SHOP_API_URL_INTERNAL: 'http://localhost:3001/shop-api',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'hurc.local',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_dummy',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com',
};
const ORIGINAL = { ...process.env };

vi.mock('server-only', () => ({}));
vi.mock('next-intl/server', () => ({
  getLocale: async () => 'en',
}));

beforeAll(() => {
  Object.assign(process.env, VALID_ENV);
});

afterAll(() => {
  for (const k of Object.keys(VALID_ENV)) delete process.env[k];
  Object.assign(process.env, ORIGINAL);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('subscribeNewsletterAction', () => {
  it('POSTs to /newsletter/subscribe stripping the /shop-api path', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, status: 'created' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const { subscribeNewsletterAction } = await import('../../src/lib/actions/newsletter');
    const result = await subscribeNewsletterAction({
      email: 'test@example.com',
      website: '',
    });

    expect(result?.data?.ok).toBe(true);
    if (result?.data?.ok === true) {
      expect(result.data.status).toBe('created');
    }
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe('http://localhost:3001/newsletter/subscribe');
    expect((init as RequestInit).method).toBe('POST');
    const body = JSON.parse((init as RequestInit).body as string) as {
      email: string;
      locale: string;
    };
    expect(body.email).toBe('test@example.com');
    expect(body.locale).toBe('en');
  });

  it('silently accepts honeypot trip', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { subscribeNewsletterAction } = await import('../../src/lib/actions/newsletter');
    const result = await subscribeNewsletterAction({
      email: 'bot@example.com',
      website: 'http://spam.example',
    });
    expect(result?.data?.ok).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns UPSTREAM_ERROR on 500', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('boom', { status: 500 }));
    const { subscribeNewsletterAction } = await import('../../src/lib/actions/newsletter');
    const result = await subscribeNewsletterAction({
      email: 'a@b.com',
      website: '',
    });
    expect(result?.data?.ok).toBe(false);
    if (result?.data?.ok === false) {
      expect(result.data.error).toBe('UPSTREAM_ERROR');
    }
  });

  it('returns UPSTREAM_ERROR on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('ECONNREFUSED'));
    const { subscribeNewsletterAction } = await import('../../src/lib/actions/newsletter');
    const result = await subscribeNewsletterAction({
      email: 'a@b.com',
      website: '',
    });
    expect(result?.data?.ok).toBe(false);
  });

  it('rejects malformed email at the input schema', async () => {
    const { subscribeNewsletterAction } = await import('../../src/lib/actions/newsletter');
    const result = await subscribeNewsletterAction({
      email: 'not-an-email',
      website: '',
    });
    expect(result?.validationErrors).toBeDefined();
  });
});
