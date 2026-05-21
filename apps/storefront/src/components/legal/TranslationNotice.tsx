import { getTranslations } from 'next-intl/server';

import { type Locale, routing } from '@/i18n/routing';

type Props = {
  locale: Locale;
};

/**
 * Visible notice for non-English legal pages until professional translations
 * land in Phase 9. Renders nothing for English. The text is intentionally
 * direct — visitors should know what they're reading is a placeholder.
 */
export async function TranslationNotice({ locale }: Props) {
  if (locale === routing.defaultLocale) return null;
  const t = await getTranslations({ locale, namespace: 'legal.shell' });
  return (
    <aside
      role="note"
      className="mb-12 border border-[var(--color-line)] bg-[var(--color-surface-900)] px-4 py-3 text-xs text-[var(--color-muted)]"
    >
      {t('translationPending')}
    </aside>
  );
}
