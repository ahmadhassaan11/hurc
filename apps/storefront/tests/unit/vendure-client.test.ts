import { parse } from 'graphql';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

const VALID_ENV = {
  NODE_ENV: 'test',
  APP_ENV: 'dev',
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: 'http://localhost:3001/shop-api',
  VENDURE_SHOP_API_URL_INTERNAL: 'http://internal:3001/shop-api',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'hurc.local',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_dummy',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com',
};
const ORIGINAL = { ...process.env };

type CookieEntry = { name: string; value: string };

const fakeCookieStore = {
  store: new Map<string, CookieEntry>(),
  setCalls: [] as Array<{ name: string; value: string; opts: unknown }>,
  reset() {
    this.store.clear();
    this.setCalls = [];
  },
  get(name: string): CookieEntry | undefined {
    return this.store.get(name);
  },
  set(name: string, value: string, opts: unknown): void {
    this.store.set(name, { name, value });
    this.setCalls.push({ name, value, opts });
  },
};

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => fakeCookieStore,
  headers: async () => new Headers(),
}));
vi.mock('next-intl/server', () => ({
  getLocale: async () => 'en',
}));

const ActiveChannelDoc = parse(/* GraphQL */ `
  query ActiveChannel {
    activeChannel {
      id
      code
    }
  }
`) as unknown as TypedDocumentNode<
  { activeChannel: { id: string; code: string } },
  Record<string, never>
>;

beforeAll(() => {
  Object.assign(process.env, VALID_ENV);
});

afterAll(() => {
  for (const k of Object.keys(VALID_ENV)) delete process.env[k];
  Object.assign(process.env, ORIGINAL);
});

afterEach(() => {
  fakeCookieStore.reset();
  vi.restoreAllMocks();
});

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

describe('shopRequest', () => {
  it('POSTs to VENDURE_SHOP_API_URL_INTERNAL with the printed query', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ data: { activeChannel: { id: '1', code: 'eu' } } }));

    const { shopRequest } = await import('../../src/lib/vendure/client');
    const data = await shopRequest(ActiveChannelDoc, {});
    expect(data).toEqual({ activeChannel: { id: '1', code: 'eu' } });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe('http://internal:3001/shop-api');
    expect((init as RequestInit).method).toBe('POST');
    const body = JSON.parse((init as RequestInit).body as string) as {
      query: string;
      operationName?: string;
    };
    expect(body.query).toContain('activeChannel');
    expect(body.operationName).toBe('ActiveChannel');
  });

  it('forwards the visitor session cookie when present', async () => {
    fakeCookieStore.store.set('session', { name: 'session', value: 'tok-123' });
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ data: { activeChannel: { id: '1', code: 'eu' } } }));

    const { shopRequest } = await import('../../src/lib/vendure/client');
    await shopRequest(ActiveChannelDoc, {});

    const init = fetchSpy.mock.calls[0]![1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.cookie).toBe('session=tok-123');
    expect(headers['accept-language']).toBe('en');
  });

  it('attaches Next.js cache tags when supplied and omits cache: no-store', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ data: { activeChannel: { id: '1', code: 'eu' } } }));

    const { shopRequest } = await import('../../src/lib/vendure/client');
    const { tags } = await import('../../src/lib/vendure/revalidation');
    await shopRequest(
      ActiveChannelDoc,
      {},
      {
        tags: [tags.channel('eu')],
        revalidate: 60,
      },
    );

    const init = fetchSpy.mock.calls[0]![1] as RequestInit & {
      next?: { tags?: string[]; revalidate?: number };
    };
    expect(init.next?.tags).toEqual(['channel:eu']);
    expect(init.next?.revalidate).toBe(60);
    expect(init.cache).toBeUndefined();
  });

  it('uses cache: no-store when no tags are supplied', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ data: { activeChannel: { id: '1', code: 'eu' } } }));

    const { shopRequest } = await import('../../src/lib/vendure/client');
    await shopRequest(ActiveChannelDoc, {});

    const init = fetchSpy.mock.calls[0]![1] as RequestInit & {
      next?: unknown;
    };
    expect(init.cache).toBe('no-store');
    expect(init.next).toBeUndefined();
  });

  it('throws GraphQLClientError on HTTP failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('upstream error', { status: 502, statusText: 'Bad Gateway' }),
    );

    const { shopRequest } = await import('../../src/lib/vendure/client');
    const { GraphQLClientError } = await import('../../src/lib/vendure/errors');

    await expect(shopRequest(ActiveChannelDoc, {})).rejects.toBeInstanceOf(GraphQLClientError);
  });

  it('throws GraphQLClientError when the body contains errors[]', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({
        data: null,
        errors: [{ message: 'permission denied' }],
      }),
    );

    const { shopRequest } = await import('../../src/lib/vendure/client');
    const { GraphQLClientError } = await import('../../src/lib/vendure/errors');

    const promise = shopRequest(ActiveChannelDoc, {});
    await expect(promise).rejects.toBeInstanceOf(GraphQLClientError);
    await expect(promise).rejects.toMatchObject({
      reason: { kind: 'graphql' },
    });
  });

  it('throws on malformed JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('<<not json>>', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      }),
    );

    const { shopRequest } = await import('../../src/lib/vendure/client');
    const { GraphQLClientError } = await import('../../src/lib/vendure/errors');
    await expect(shopRequest(ActiveChannelDoc, {})).rejects.toBeInstanceOf(GraphQLClientError);
  });

  it('wraps fetch network errors as GraphQLClientError network', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('ECONNREFUSED'));

    const { shopRequest } = await import('../../src/lib/vendure/client');
    const promise = shopRequest(ActiveChannelDoc, {});
    await expect(promise).rejects.toMatchObject({
      reason: { kind: 'network' },
    });
  });
});

describe('shopMutation', () => {
  it('rotates the session cookie when Vendure issues Set-Cookie', async () => {
    fakeCookieStore.store.set('session', { name: 'session', value: 'old-tok' });

    const setCookie = 'session=new-tok; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000';
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: { logout: { success: true } } }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'set-cookie': setCookie,
        },
      }),
    );

    const LogoutDoc = parse(/* GraphQL */ `
      mutation Logout {
        logout {
          success
        }
      }
    `) as unknown as TypedDocumentNode<{ logout: { success: boolean } }, Record<string, never>>;

    const { shopMutation } = await import('../../src/lib/vendure/client');
    const data = await shopMutation(LogoutDoc, {});
    expect(data.logout.success).toBe(true);

    expect(fakeCookieStore.setCalls).toHaveLength(1);
    expect(fakeCookieStore.setCalls[0]).toMatchObject({
      name: 'session',
      value: 'new-tok',
    });
    const opts = fakeCookieStore.setCalls[0]!.opts as Record<string, unknown>;
    expect(opts.httpOnly).toBe(true);
    expect(opts.sameSite).toBe('lax');
    expect(opts.path).toBe('/');
    expect(opts.maxAge).toBe(2592000);
  });

  it('issues no-store fetches', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ data: { logout: { success: true } } }));

    const LogoutDoc = parse(/* GraphQL */ `
      mutation Logout {
        logout {
          success
        }
      }
    `) as unknown as TypedDocumentNode<{ logout: { success: boolean } }, Record<string, never>>;

    const { shopMutation } = await import('../../src/lib/vendure/client');
    await shopMutation(LogoutDoc, {});

    const init = fetchSpy.mock.calls[0]![1] as RequestInit;
    expect(init.cache).toBe('no-store');
  });
});
