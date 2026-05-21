import { getTranslations } from 'next-intl/server';

export async function SkipToContent() {
  const t = await getTranslations('common');
  return (
    <a
      href="#main"
      className="absolute left-1/2 z-[60] -translate-x-1/2 -translate-y-full bg-[var(--color-fg)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-bg)] transition-transform focus-visible:translate-y-0"
    >
      {t('skipToContent')}
    </a>
  );
}
