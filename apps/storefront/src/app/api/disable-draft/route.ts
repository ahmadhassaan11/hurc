import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import { logger } from '@/lib/logger/server';

export const dynamic = 'force-dynamic';

/**
 * Disable Next draft mode. Visible to editors via the `<DraftBanner />`
 * client island; not secret-protected (you can only call this if you've
 * already opted into draft mode for this browser session).
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const slugParam = url.searchParams.get('slug');
  const slug = slugParam && slugParam.startsWith('/') ? slugParam : '/';

  (await draftMode()).disable();
  logger.info({ route: '/api/disable-draft', slug }, 'draft mode disabled');
  redirect(slug);
}
