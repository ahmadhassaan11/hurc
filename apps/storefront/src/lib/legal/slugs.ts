/**
 * The legal-page slug whitelist. The dispatcher route validates `[slug]`
 * against this list and 404s anything outside it. The Sanity overlay uses
 * `legal-${slug}` as the document slug (so editors cannot accidentally
 * create a `legal-impring` document — typo-on-the-other-side won't match).
 */
export const LEGAL_SLUGS = ['imprint', 'terms', 'privacy', 'cookies', 'withdrawal'] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

/**
 * Indexable subset. The cookie policy and withdrawal form are low-value
 * pages we don't want crawled / ranked — they have legal value, not SEO
 * value. Imprint, terms, and privacy stay indexable.
 */
export const LEGAL_INDEXABLE: ReadonlySet<LegalSlug> = new Set(['imprint', 'terms', 'privacy']);

export function isIndexable(slug: LegalSlug): boolean {
  return LEGAL_INDEXABLE.has(slug);
}
