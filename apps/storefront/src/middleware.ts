import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip api, _next assets, _vercel internals, files with extensions, and the
  // Sentry tunnel route.
  matcher: ['/((?!api|monitoring|_next|_vercel|.*\\..*).*)'],
};
