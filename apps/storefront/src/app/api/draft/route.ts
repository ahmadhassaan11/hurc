import { timingSafeEqual } from 'node:crypto';

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import { env } from '@/env';
import { logger } from '@/lib/logger/server';

export const dynamic = 'force-dynamic';

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Enable Next draft mode for previewing unpublished Sanity content.
 *
 * Wired from Sanity Studio's Presentation tool: editors click "Preview"
 * on a document and land here with `?secret=…&slug=/path`. We verify the
 * secret against `SANITY_REVALIDATE_SECRET` (same secret as the
 * revalidate endpoint — one shared editor-side credential) and redirect
 * to the slug with `draftMode` enabled.
 *
 * Slugs are constrained to internal paths starting with `/` to prevent
 * the handler being abused as an open redirect.
 */
export async function GET(request: Request): Promise<Response> {
  const expected = env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return new Response('Draft mode not configured', { status: 503 });
  }

  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const slugParam = url.searchParams.get('slug');

  if (!secret || !constantTimeEqual(secret, expected)) {
    logger.warn({ route: '/api/draft' }, 'rejected draft request: bad-or-missing secret');
    return new Response('Invalid token', { status: 401 });
  }

  const slug = slugParam && slugParam.startsWith('/') ? slugParam : '/';

  (await draftMode()).enable();
  logger.info({ route: '/api/draft', slug }, 'draft mode enabled');
  redirect(slug);
}
