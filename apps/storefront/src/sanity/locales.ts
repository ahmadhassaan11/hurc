/**
 * Locale codes recognized by editorial documents. The list is duplicated
 * from `apps/storefront/src/i18n/routing.ts` (`locales` array) on purpose
 * — Sanity schemas can't import from `next-intl`-aware code without
 * pulling its module graph into the studio bundle.
 *
 * If you add a locale in `i18n/routing.ts`, add it here too. The
 * `messages-shape.test.ts` drift detector covers the message side; this
 * file is editorial-side and is a one-line maintenance note.
 */

export const EDITORIAL_LOCALES = ['en', 'de', 'fr', 'nl', 'es', 'it'] as const;
export type EditorialLocale = (typeof EDITORIAL_LOCALES)[number];

export const EDITORIAL_LOCALE_LIST = EDITORIAL_LOCALES.map((code) => ({
  title: code.toUpperCase(),
  value: code,
}));
