import { env } from '@/env';

/**
 * Render a JSON-LD `<script>` payload safely. The data is built from
 * Vendure responses and never contains user input directly, but we
 * still escape `</` per OWASP guidance to make a closing-tag injection
 * impossible.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

type WithContext<T extends string> = {
  '@context': 'https://schema.org';
  '@type': T;
};

export type OrganizationSchema = WithContext<'Organization'> & {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
};

export type WebSiteSchema = WithContext<'WebSite'> & {
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: { '@type': 'EntryPoint'; urlTemplate: string };
    'query-input': string;
  };
};

export type BreadcrumbSchema = WithContext<'BreadcrumbList'> & {
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }[];
};

export function organizationSchema(): OrganizationSchema {
  const url = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HURC',
    url,
    logo: `${url}/icon.svg`,
  };
}

export function websiteSchema(): WebSiteSchema {
  const url = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HURC',
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]): BreadcrumbSchema {
  const url = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((node, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: node.name,
      item: node.href.startsWith('http') ? node.href : `${url}${node.href}`,
    })),
  };
}
