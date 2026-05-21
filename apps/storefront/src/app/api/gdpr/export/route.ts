import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';
import { hashSessionKey, rateLimit } from '@/lib/gdpr/rate-limit';
import { logger } from '@/lib/logger/server';

export const dynamic = 'force-dynamic';

const EXPORT_TTL_SECONDS = 60;
const MAX_BYTES = 50 * 1024 * 1024;

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

  const limiterKey = hashSessionKey('gdpr.export', session);
  if (!(await rateLimit(limiterKey, EXPORT_TTL_SECONDS))) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429, headers: NO_STORE_HEADERS });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${backendBaseUrl()}/gdpr/export`, {
      method: 'POST',
      headers: {
        cookie: `session=${session}`,
      },
      cache: 'no-store',
    });
  } catch (err) {
    logger.error({ err }, 'gdpr export upstream network error');
    return NextResponse.json(
      { error: 'UPSTREAM_ERROR' },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: 'UPSTREAM_ERROR', status: upstream.status },
      { status: upstream.status, headers: NO_STORE_HEADERS },
    );
  }

  const contentLengthHeader = upstream.headers.get('content-length');
  if (contentLengthHeader !== null) {
    const declared = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(declared) && declared > MAX_BYTES) {
      return NextResponse.json(
        { error: 'PAYLOAD_TOO_LARGE' },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }
  }

  // Stream the upstream body but enforce the cap on the wire so a runaway
  // export does not OOM the Vercel function.
  const reader = upstream.body?.getReader();
  if (reader === undefined) {
    return NextResponse.json(
      { error: 'UPSTREAM_EMPTY' },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }

  const cappedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > MAX_BYTES) {
          controller.error(new Error('PAYLOAD_TOO_LARGE'));
          return;
        }
        controller.enqueue(value);
      }
      controller.close();
    },
    cancel(reason) {
      void reader.cancel(reason);
    },
  });

  return new Response(cappedStream, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/zip',
      'Content-Disposition':
        upstream.headers.get('content-disposition') ?? 'attachment; filename="hurc-data.zip"',
      ...NO_STORE_HEADERS,
    },
  });
}
