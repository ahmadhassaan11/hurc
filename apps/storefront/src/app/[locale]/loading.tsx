import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('common');
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex min-h-dvh max-w-2xl items-center justify-center px-6 text-[var(--color-muted)]"
    >
      <span className="sr-only">{t('loading')}</span>
      <span aria-hidden className="text-sm uppercase tracking-[0.3em]">
        {t('loading')}
      </span>
    </div>
  );
}
