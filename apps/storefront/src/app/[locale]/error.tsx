'use client';

import * as Sentry from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('errors');

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-start justify-center gap-6 px-6">
      <h1 className="text-4xl font-[var(--font-display)] font-bold">{t('title')}</h1>
      <p className="text-[var(--color-muted)]">{t('description')}</p>
      <button
        type="button"
        onClick={reset}
        className="border border-[var(--color-line)] px-6 py-3 text-sm uppercase tracking-[0.2em] hover:bg-[var(--color-surface-700)]"
      >
        {t('retry')}
      </button>
    </main>
  );
}
