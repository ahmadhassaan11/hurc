import { timingSafeEqual } from 'node:crypto';

import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { env } from '@/env';
import { logger } from '@/lib/logger/server';
import { isAllowedTag } from '@/lib/sanity/revalidate-allowlist';

export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  tags: z.array(z.string().min(1).max(200)).max(100),
});

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function POST(
  request: Request,
): Promise<
  NextResponse<{ ok: boolean; revalidated?: string[]; rejected?: string[]; error?: string }>
> {
  const expected = env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    logger.error({ route: '/api/revalidate' }, 'SANITY_REVALIDATE_SECRET not configured');
    return NextResponse.json({ ok: false, error: 'revalidate-not-configured' }, { status: 503 });
  }

  const provided = new URL(request.url).searchParams.get('secret');
  if (!provided || !constantTimeEqual(provided, expected)) {
    logger.warn(
      { route: '/api/revalidate' },
      'rejected revalidate request: bad-or-missing secret (must match backend NEXT_REVALIDATE_SECRET)',
    );
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid-body' }, { status: 400 });
  }

  const revalidated: string[] = [];
  const rejected: string[] = [];
  for (const tag of parsed.data.tags) {
    if (isAllowedTag(tag)) {
      revalidateTag(tag);
      revalidated.push(tag);
    } else {
      rejected.push(tag);
    }
  }

  if (rejected.length > 0) {
    logger.warn(
      { route: '/api/revalidate', rejected },
      'dropped tags not in allowlist; check payload-mapper.ts ↔ revalidate-allowlist.ts',
    );
  }

  logger.info(
    { route: '/api/revalidate', revalidated: revalidated.length, rejected: rejected.length },
    'revalidate request accepted',
  );

  return NextResponse.json({ ok: true, revalidated, rejected });
}
