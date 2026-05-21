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
  SANITY_REVALIDATE_SECRET: 'test-secret-at-least-16-bytes-long',
};
const ORIGINAL = { ...process.env };

const revalidateTagSpy = vi.fn();

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({
  revalidateTag: (tag: string) => revalidateTagSpy(tag),
}));

beforeAll(() => {
  Object.assign(process.env, VALID_ENV);
});
afterAll(() => {
  for (const k of Object.keys(VALID_ENV)) delete process.env[k];
  Object.assign(process.env, ORIGINAL);
});
afterEach(() => {
  revalidateTagSpy.mockClear();
});

async function callPost(url: string, body: unknown): Promise<{ status: number; json: unknown }> {
  const { POST } = await import('../../src/app/api/revalidate/route');
  // NextRequest is structurally a Request; the route reads .nextUrl + .json().
  const req = new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  const res = await POST(req as never);
  return { status: res.status, json: await res.json() };
}

describe('/api/revalidate', () => {
  it('returns 401 when secret is missing', async () => {
    const { status, json } = await callPost('http://localhost/api/revalidate', {
      tags: ['journal'],
    });
    expect(status).toBe(401);
    expect(json).toMatchObject({ ok: false, error: 'unauthorized' });
    expect(revalidateTagSpy).not.toHaveBeenCalled();
  });

  it('returns 401 when secret is wrong', async () => {
    const { status, json } = await callPost('http://localhost/api/revalidate?secret=nope', {
      tags: ['journal'],
    });
    expect(status).toBe(401);
    expect(json).toMatchObject({ ok: false, error: 'unauthorized' });
    expect(revalidateTagSpy).not.toHaveBeenCalled();
  });

  it('returns 401 when secret length differs (constant-time guard)', async () => {
    const { status } = await callPost('http://localhost/api/revalidate?secret=short', {
      tags: ['journal'],
    });
    expect(status).toBe(401);
  });

  it('accepts a valid secret and revalidates whitelisted tags', async () => {
    const { status, json } = await callPost(
      `http://localhost/api/revalidate?secret=${encodeURIComponent(VALID_ENV.SANITY_REVALIDATE_SECRET)}`,
      { tags: ['journal:abc', 'journal', 'page:story', 'homepage'] },
    );
    expect(status).toBe(200);
    expect(json).toMatchObject({
      ok: true,
      revalidated: ['journal:abc', 'journal', 'page:story', 'homepage'],
      rejected: [],
    });
    expect(revalidateTagSpy).toHaveBeenCalledTimes(4);
    expect(revalidateTagSpy).toHaveBeenNthCalledWith(1, 'journal:abc');
    expect(revalidateTagSpy).toHaveBeenNthCalledWith(2, 'journal');
    expect(revalidateTagSpy).toHaveBeenNthCalledWith(3, 'page:story');
    expect(revalidateTagSpy).toHaveBeenNthCalledWith(4, 'homepage');
  });

  it('drops non-whitelisted tags but does not 4xx', async () => {
    const { status, json } = await callPost(
      `http://localhost/api/revalidate?secret=${encodeURIComponent(VALID_ENV.SANITY_REVALIDATE_SECRET)}`,
      { tags: ['cart:abc', 'siteSettings', 'journal:ok'] },
    );
    expect(status).toBe(200);
    expect(json).toMatchObject({
      ok: true,
      revalidated: ['journal:ok'],
      rejected: ['cart:abc', 'siteSettings'],
    });
    expect(revalidateTagSpy).toHaveBeenCalledTimes(1);
    expect(revalidateTagSpy).toHaveBeenCalledWith('journal:ok');
  });

  it('returns 400 on malformed JSON', async () => {
    const { status, json } = await callPost(
      `http://localhost/api/revalidate?secret=${encodeURIComponent(VALID_ENV.SANITY_REVALIDATE_SECRET)}`,
      'not-json{',
    );
    expect(status).toBe(400);
    expect(json).toMatchObject({ ok: false, error: 'invalid-json' });
  });

  it('returns 400 on missing tags array', async () => {
    const { status, json } = await callPost(
      `http://localhost/api/revalidate?secret=${encodeURIComponent(VALID_ENV.SANITY_REVALIDATE_SECRET)}`,
      { foo: 'bar' },
    );
    expect(status).toBe(400);
    expect(json).toMatchObject({ ok: false, error: 'invalid-body' });
  });

  it('accepts empty tag arrays as a no-op', async () => {
    const { status, json } = await callPost(
      `http://localhost/api/revalidate?secret=${encodeURIComponent(VALID_ENV.SANITY_REVALIDATE_SECRET)}`,
      { tags: [] },
    );
    expect(status).toBe(200);
    expect(json).toMatchObject({ ok: true, revalidated: [], rejected: [] });
    expect(revalidateTagSpy).not.toHaveBeenCalled();
  });
});
