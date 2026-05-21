import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export default async function NotFoundPage() {
  const t = await getTranslations('notFound');
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-start justify-center gap-6 px-6">
      <h1 className="text-4xl font-[var(--font-display)] font-bold">{t('title')}</h1>
      <p className="text-[var(--color-muted)]">{t('description')}</p>
      <Link
        href="/"
        className="border border-[var(--color-line)] px-6 py-3 text-sm uppercase tracking-[0.2em] hover:bg-[var(--color-surface-700)]"
      >
        {t('goHome')}
      </Link>
    </main>
  );
}
