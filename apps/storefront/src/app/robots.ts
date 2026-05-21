import type { MetadataRoute } from 'next';

import { env } from '@/env';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account/', '/checkout/', '/monitoring', '/studio'],
      },
      // Cookie + withdrawal pages have legal value, not SEO value. Keep
      // them reachable but out of search results. Imprint / privacy /
      // terms remain indexable (they back legal-disclosure trust signals).
      {
        userAgent: '*',
        disallow: ['/legal/cookies', '/legal/withdrawal'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
