import 'server-only';

import { loadPage, type PageDoc } from '@/lib/sanity/queries';

import { type LegalSlug } from './slugs';

/**
 * Sanity overlay for legal copy. Editors patch typos through Sanity Studio
 * by creating a `page` document with slug `legal-${slug}` (e.g. an editor
 * patching the imprint creates a doc with slug `legal-imprint`). When that
 * document exists, the legal route renders it via the existing
 * Portable-Text pipeline. When it doesn't, the dispatcher falls back to
 * the static body component in `content/`.
 *
 * The static body is the source of truth at launch — Sanity is an
 * override, not a dependency.
 */
export async function loadLegalOverlay(slug: LegalSlug, locale: string): Promise<PageDoc | null> {
  return loadPage(`legal-${slug}`, locale);
}
