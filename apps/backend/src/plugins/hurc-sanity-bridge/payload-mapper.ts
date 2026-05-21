/**
 * Maps a Sanity webhook payload to the list of Next.js cache tags that need
 * revalidation. The storefront's `/api/revalidate` endpoint then calls
 * `revalidateTag(tag)` on each.
 *
 * The storefront's allowlist
 * (`apps/storefront/src/lib/sanity/revalidate-allowlist.ts`) MUST stay in
 * lockstep with the prefixes below. A tag emitted here that the storefront
 * doesn't whitelist gets silently dropped.
 *
 * Conventions:
 *  - `journalPost` documents → `journal:<slug>` (and a global `journal` tag)
 *  - `product` documents     → `product:<slug>` + `product` (the storefront
 *    may stitch Vendure + Sanity product data; revalidate both surfaces)
 *  - `page` documents        → `page:<slug>` + `page`
 *  - `activity` documents    → `activity:<slug>` + `activity`
 *  - `homepage` (singleton)  → `homepage`
 *  - any other type          → falls back to the type name itself, so
 *    storefront pages tagged with `<type>` still update.
 */

export type SanityPayload = {
  _type?: string;
  _id?: string;
  /** Sanity slug fields are typically `{ current: string }`, sometimes plain strings. */
  slug?: { current?: string } | string;
};

function extractSlug(payload: SanityPayload): string | null {
  if (typeof payload.slug === 'string') return payload.slug;
  if (payload.slug && typeof payload.slug === 'object' && payload.slug.current) {
    return payload.slug.current;
  }
  return null;
}

export function payloadToTags(payload: SanityPayload): string[] {
  if (!payload._type) return [];
  const slug = extractSlug(payload);
  switch (payload._type) {
    case 'journalPost':
      return slug ? [`journal:${slug}`, 'journal'] : ['journal'];
    case 'product':
      return slug ? [`product:${slug}`, 'product'] : ['product'];
    case 'page':
      return slug ? [`page:${slug}`, 'page'] : ['page'];
    case 'activity':
      return slug ? [`activity:${slug}`, 'activity'] : ['activity'];
    case 'homepage':
      return ['homepage'];
    default:
      return [payload._type];
  }
}
