import type { Metadata } from 'next';

import { env } from '@/env';

type BuildMetadataInput = {
  title?: string;
  description?: string;
  /** Path on the canonical host, e.g. `/de/products/meridian-jacket`. */
  path: string;
  ogImage?: { url: string; alt: string };
  noIndex?: boolean;
};

const defaultTitle = 'HURC — Hustle Unleashed, Resilience Crafted';
const defaultDescription =
  'Premium European activewear. Engineered for movement, designed without compromise.';

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const path = input.path.startsWith('/') ? input.path : `/${input.path}`;
  const canonical = `${siteUrl}${path}`;

  const title = input.title ?? defaultTitle;
  const description = input.description ?? defaultDescription;

  return {
    title,
    description,
    alternates: { canonical },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'HURC',
      type: 'website',
      ...(input.ogImage !== undefined
        ? { images: [{ url: input.ogImage.url, alt: input.ogImage.alt }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(input.ogImage !== undefined ? { images: [input.ogImage.url] } : {}),
    },
  };
}
