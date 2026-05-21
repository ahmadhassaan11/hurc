import 'server-only';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql';
import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { env } from '@/env';

import { GraphQLClientError, type GraphQLErrorPayload } from './errors';
import type { Tag } from './revalidation';

/**
 * Vendure session cookie name. Vendure 3.x defaults to `session`; if a
 * future Vendure config customises `apiOptions.sessionCookieName`, update
 * this constant in lockstep.
 */
const SESSION_COOKIE = 'session';

type ReadOptions = {
  /** Cache tags for `revalidateTag` invalidation. Omit for personalized data. */
  tags?: readonly Tag[];
  /** Revalidate window in seconds. `false` means tag-only invalidation. */
  revalidate?: number | false;
  /** Forward the visitor's session cookie. Default true. */
  session?: boolean;
};

type MutateOptions = {
  /** Forward the visitor's session cookie. Default true. */
  session?: boolean;
};

type GraphQLBody<TVariables> = {
  query: string;
  variables: TVariables;
  operationName?: string;
};

function endpoint(): string {
  return env.VENDURE_SHOP_API_URL_INTERNAL;
}

async function buildHeaders(forwardSession: boolean): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json',
  };

  if (forwardSession) {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;
    if (session !== undefined) {
      headers.cookie = `${SESSION_COOKIE}=${session}`;
    }
  }

  try {
    const locale = await getLocale();
    headers['accept-language'] = locale;
  } catch {
    // getLocale throws outside a request scope (e.g. during static
    // generation of /robots.txt). Locale-less requests fall back to the
    // channel default — acceptable for non-locale-sensitive queries.
  }

  return headers;
}

async function applySetCookie(setCookieHeader: string | null): Promise<void> {
  if (setCookieHeader === null) return;
  const sessionPart = setCookieHeader
    .split(/,(?=[^;]+=[^;]+)/)
    .find((part) => part.trim().toLowerCase().startsWith(`${SESSION_COOKIE}=`));
  if (sessionPart === undefined) return;

  const segments = sessionPart.split(';').map((s) => s.trim());
  const first = segments[0];
  if (first === undefined) return;
  const equalsIndex = first.indexOf('=');
  if (equalsIndex < 0) return;
  const value = first.slice(equalsIndex + 1);

  const attrs: {
    maxAge?: number;
    expires?: Date;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
  } = {};
  for (const segment of segments.slice(1)) {
    const [rawKey, ...rest] = segment.split('=');
    const key = (rawKey ?? '').toLowerCase();
    const v = rest.join('=');
    if (key === 'max-age') attrs.maxAge = Number(v);
    else if (key === 'expires') attrs.expires = new Date(v);
    else if (key === 'path') attrs.path = v;
    else if (key === 'secure') attrs.secure = true;
    else if (key === 'httponly') attrs.httpOnly = true;
    else if (key === 'samesite') {
      const lower = v.toLowerCase();
      if (lower === 'lax' || lower === 'strict' || lower === 'none') {
        attrs.sameSite = lower;
      }
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, value, {
    httpOnly: attrs.httpOnly ?? true,
    secure: attrs.secure ?? env.NODE_ENV === 'production',
    sameSite: attrs.sameSite ?? 'lax',
    path: attrs.path ?? '/',
    ...(attrs.maxAge !== undefined ? { maxAge: attrs.maxAge } : {}),
    ...(attrs.expires !== undefined ? { expires: attrs.expires } : {}),
  });
}

function pickOperationName(query: string): string | undefined {
  const match = /\b(?:query|mutation|subscription)\s+(\w+)/.exec(query);
  return match?.[1];
}

async function parseResponse<TResult>(
  res: Response,
): Promise<{ data?: TResult; errors?: GraphQLErrorPayload[] }> {
  let body: unknown;
  try {
    body = await res.json();
  } catch (cause) {
    throw new GraphQLClientError({ kind: 'malformed', cause });
  }

  if (typeof body !== 'object' || body === null) {
    throw new GraphQLClientError({
      kind: 'malformed',
      cause: new Error('GraphQL response was not an object'),
    });
  }

  return body as { data?: TResult; errors?: GraphQLErrorPayload[] };
}

/**
 * Read a Vendure shop-api query in a Server Component. Tagged for
 * `revalidateTag` invalidation. Forwards the session cookie. Cannot rotate
 * cookies — use `shopMutation` for writes that change the session.
 */
export async function shopRequest<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
  options: ReadOptions = {},
): Promise<TResult> {
  const query = print(document);
  const body: GraphQLBody<TVariables> = {
    query,
    variables,
    ...(pickOperationName(query) !== undefined
      ? { operationName: pickOperationName(query) as string }
      : {}),
  };

  const useTags = options.tags !== undefined && options.tags.length > 0;
  const forwardSession = options.session !== false;

  let res: Response;
  try {
    res = await fetch(endpoint(), {
      method: 'POST',
      headers: await buildHeaders(forwardSession),
      body: JSON.stringify(body),
      credentials: 'include',
      ...(useTags
        ? {
            next: {
              tags: [...(options.tags ?? [])],
              ...(options.revalidate !== undefined ? { revalidate: options.revalidate } : {}),
            },
          }
        : { cache: 'no-store' as const }),
    });
  } catch (cause) {
    throw new GraphQLClientError({ kind: 'network', cause });
  }

  if (!res.ok) {
    throw new GraphQLClientError({
      kind: 'http',
      status: res.status,
      statusText: res.statusText,
    });
  }

  const json = await parseResponse<TResult>(res);
  if (json.errors !== undefined && json.errors.length > 0) {
    throw new GraphQLClientError({ kind: 'graphql', errors: json.errors });
  }

  if (json.data === undefined) {
    throw new GraphQLClientError({
      kind: 'malformed',
      cause: new Error('GraphQL response had no data'),
    });
  }

  return json.data;
}

/**
 * Issue a Vendure shop-api mutation from a Server Action or Route Handler.
 * Always uncached. Propagates a rotated session cookie back to the caller
 * via Next.js's mutable `cookies()` API — calling this from a Server
 * Component will throw at runtime (by design).
 */
export async function shopMutation<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
  options: MutateOptions = {},
): Promise<TResult> {
  const query = print(document);
  const body: GraphQLBody<TVariables> = {
    query,
    variables,
    ...(pickOperationName(query) !== undefined
      ? { operationName: pickOperationName(query) as string }
      : {}),
  };

  const forwardSession = options.session !== false;

  let res: Response;
  try {
    res = await fetch(endpoint(), {
      method: 'POST',
      headers: await buildHeaders(forwardSession),
      body: JSON.stringify(body),
      credentials: 'include',
      cache: 'no-store',
    });
  } catch (cause) {
    throw new GraphQLClientError({ kind: 'network', cause });
  }

  if (!res.ok) {
    throw new GraphQLClientError({
      kind: 'http',
      status: res.status,
      statusText: res.statusText,
    });
  }

  if (forwardSession) {
    await applySetCookie(res.headers.get('set-cookie'));
  }

  const json = await parseResponse<TResult>(res);
  if (json.errors !== undefined && json.errors.length > 0) {
    throw new GraphQLClientError({ kind: 'graphql', errors: json.errors });
  }

  if (json.data === undefined) {
    throw new GraphQLClientError({
      kind: 'malformed',
      cause: new Error('GraphQL response had no data'),
    });
  }

  return json.data;
}
