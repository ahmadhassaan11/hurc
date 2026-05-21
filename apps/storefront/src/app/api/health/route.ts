import { type NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger/server';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('fail') === '1') {
    logger.error({ route: '/api/health' }, 'health probe forced to fail');
    throw new Error('forced /api/health failure (probe)');
  }

  return NextResponse.json({
    ok: true,
    service: 'hurc-storefront',
    time: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  });
}
