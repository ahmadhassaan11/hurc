import 'server-only';

import { defineQuery } from 'next-sanity';

import { tags } from '@/lib/vendure/revalidation';

import { fetchEditorial } from './draft-mode';

/**
 * Server-only GROQ loaders. Each loader:
 *  - falls back from the requested locale to `en` when the localised
 *    document doesn't exist (so a German shopper sees the English post
 *    rather than a 404 — see ADR-0008 R5);
 *  - tags the RSC fetch so Sanity webhooks via `/api/revalidate` can
 *    bust the cache surgically;
 *  - swaps to the draft client + `cache: 'no-store'` when draft mode is
 *    active (via `fetchEditorial`);
 *  - returns `null` (or `[]` for list shapes) when Sanity isn't
 *    configured or the document doesn't exist.
 */

const PAGE_SIZE = 12;

const homepageQuery = defineQuery(`
  *[_type == "homepage" && language in [$locale, "en"]]
  | order(language == $locale desc, language == "en" desc)[0]
`);

const pageQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug && language in [$locale, "en"]]
  | order(language == $locale desc, language == "en" desc)[0] {
    _id,
    title,
    "slug": slug.current,
    language,
    eyebrow,
    heroImage,
    body,
    seo
  }
`);

const journalPostQuery = defineQuery(`
  *[_type == "journalPost" && slug.current == $slug && language in [$locale, "en"]]
  | order(language == $locale desc, language == "en" desc)[0] {
    _id,
    title,
    "slug": slug.current,
    language,
    publishedAt,
    author,
    excerpt,
    heroImage,
    body,
    seo
  }
`);

const journalIndexQuery = defineQuery(`
  *[_type == "journalPost" && language in [$locale, "en"]]
  | order(publishedAt desc)
  [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    language,
    publishedAt,
    author,
    excerpt,
    heroImage
  }
`);

const journalCountQuery = defineQuery(`
  count(*[_type == "journalPost" && language in [$locale, "en"]])
`);

const activityListQuery = defineQuery(`
  *[_type == "activity" && language in [$locale, "en"]]
  | order(language == $locale desc, language == "en" desc) {
    _id,
    title,
    "slug": slug.current,
    language,
    eyebrow,
    heroImage,
    description
  }
`);

export type HomepageDoc = {
  _id: string;
  language: string;
  heroOverride?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    image?: { asset?: { _ref: string }; alt?: string };
    primaryCta?: { label?: string; href?: string };
  };
  brandStatementOverride?: {
    eyebrow?: string;
    headline?: string;
    body?: string;
  };
};

export type PageDoc = {
  _id: string;
  title: string;
  slug: string;
  language: string;
  eyebrow?: string;
  heroImage?: { asset?: { _ref: string }; alt?: string };
  body: unknown;
  seo?: { title?: string; description?: string; image?: unknown };
};

export type JournalPostDoc = {
  _id: string;
  title: string;
  slug: string;
  language: string;
  publishedAt: string;
  author?: string;
  excerpt?: string;
  heroImage?: { asset?: { _ref: string }; alt?: string };
  body: unknown;
  seo?: { title?: string; description?: string; image?: unknown };
};

export type JournalCardDoc = Omit<JournalPostDoc, 'body' | 'seo'>;

export type ActivityDoc = {
  _id: string;
  title: string;
  slug: string;
  language: string;
  eyebrow?: string;
  heroImage?: { asset?: { _ref: string }; alt?: string };
  description?: string;
};

export async function loadHomepage(locale: string): Promise<HomepageDoc | null> {
  return fetchEditorial<HomepageDoc>(homepageQuery, { locale }, [tags.homepage()]);
}

export async function loadPage(slug: string, locale: string): Promise<PageDoc | null> {
  return fetchEditorial<PageDoc>(pageQuery, { slug, locale }, [tags.page(slug), 'page']);
}

export async function loadJournalPost(
  slug: string,
  locale: string,
): Promise<JournalPostDoc | null> {
  return fetchEditorial<JournalPostDoc>(journalPostQuery, { slug, locale }, [
    tags.journal(slug),
    tags.journalList(),
  ]);
}

export type JournalIndex = {
  posts: JournalCardDoc[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function loadJournalIndex(locale: string, page = 1): Promise<JournalIndex> {
  const start = (Math.max(1, page) - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const [posts, total] = await Promise.all([
    fetchEditorial<JournalCardDoc[]>(journalIndexQuery, { locale, start, end }, [
      tags.journalList(),
    ]),
    fetchEditorial<number>(journalCountQuery, { locale }, [tags.journalList()]),
  ]);
  const safeTotal = total ?? 0;
  return {
    posts: posts ?? [],
    total: safeTotal,
    page: Math.max(1, page),
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(safeTotal / PAGE_SIZE)),
  };
}

export async function loadActivities(locale: string): Promise<ActivityDoc[]> {
  const result = await fetchEditorial<ActivityDoc[]>(activityListQuery, { locale }, ['activity']);
  return result ?? [];
}
