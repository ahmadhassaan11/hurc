import type { MetadataRoute } from 'next';

import { env } from '@/env';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const lastModified = new Date();

  // Phase 4 ships only the locale roots. Phase 6 expands the sitemap to
  // include every product slug + collection slug per locale via the shop-api.
  return routing.locales.map((locale) => {
    const path = locale === routing.defaultLocale ? '' : `/${locale}`;
    return {
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === routing.defaultLocale ? 1.0 : 0.9,
    };
  });
}
