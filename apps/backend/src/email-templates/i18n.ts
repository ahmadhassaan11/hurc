/**
 * Phase 2 ships English and German copy. The other Phase-2 locales (fr, nl,
 * es, it) fall back to English — the ADR explicitly calls this "placeholder
 * copy" until translation lands in a later phase.
 */
export type EmailLocale = 'en' | 'de';

export function resolveEmailLocale(languageCode: string | undefined): EmailLocale {
  if (languageCode && languageCode.toLowerCase().startsWith('de')) return 'de';
  return 'en';
}

export type Translations = Record<EmailLocale, string>;

export function t(locale: EmailLocale, copy: Translations): string {
  return copy[locale];
}
