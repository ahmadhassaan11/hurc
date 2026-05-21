/**
 * Tag prefixes that the storefront's /api/revalidate endpoint accepts from
 * the backend's hurc-sanity-bridge. Mirrors the `_type` switch in
 * `apps/backend/src/plugins/hurc-sanity-bridge/payload-mapper.ts`.
 *
 * If you add a new Sanity document type, update both files in the same
 * commit; tag prefixes not in this list are silently dropped at the
 * revalidate endpoint (logged as warn) — defence in depth on top of the
 * `?secret=` check.
 */

export const ALLOWED_TAG_PREFIXES = ['journal', 'product', 'homepage', 'page', 'activity'] as const;

export type AllowedTagPrefix = (typeof ALLOWED_TAG_PREFIXES)[number];

export function isAllowedTag(tag: string): boolean {
  for (const prefix of ALLOWED_TAG_PREFIXES) {
    if (tag === prefix) return true;
    if (tag.startsWith(`${prefix}:`) && tag.length > prefix.length + 1) {
      return true;
    }
  }
  return false;
}
