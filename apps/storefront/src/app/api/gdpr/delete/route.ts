import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';
import { hashSessionKey, rateLimit } from '@/lib/gdpr/rate-limit';
import { logger } from '@/lib/logger/server';

export const dynamic = 'force-dynamic';

const DELETE_TTL_SECONDS = 60;

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

function backendBaseUrl(): string {
  const url = new URL(env.VENDURE_SHOP_API_URL_INTERNAL);
  url.pathname = '';
  url.search = '';
  return url.toString().replace(/\/$/, '');
}

export async function POST(_request: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (session === undefined) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const limiterKey = hashSessionKey('gdpr.delete', session);
  if (!(await rateLimit(limiterKey, DELETE_TTL_SECONDS))) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429, headers: NO_STORE_HEADERS });
  }

  try {
    const upstream = await fetch(`${backendBaseUrl()}/gdpr/delete`, {
      method: 'POST',
      headers: {
        cookie: `session=${session}`,
        'content-type': 'application/json',
      },
      cache: 'no-store',
    });
    const json = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(json, { status: upstream.status, headers: NO_STORE_HEADERS });
  } catch (err) {
    logger.error({ err }, 'gdpr delete upstream network error');
    return NextResponse.json(
      { error: 'UPSTREAM_ERROR' },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }
}
