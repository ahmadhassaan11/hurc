import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { JournalCard } from '@/components/editorial/JournalCard';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { loadJournalIndex } from '@/lib/sanity/queries';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: 'journal' });
  return {
    title: t('indexTitle'),
    description: t('indexDescription'),
  };
}

export default async function JournalIndexPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const sp = await searchParams;
  const pageParam = Number.parseInt(sp.page ?? '1', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const t = await getTranslations('journal');
  const { posts, totalPages } = await loadJournalIndex(locale, page);

  return (
    <main id="content" className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
      <header className="mb-16 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-muted)]">
          {t('indexEyebrow')}
        </p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.95] tracking-tight">
          {t('indexTitle')}
        </h1>
        <p className="mt-6 text-lg text-[var(--color-muted)]">{t('indexDescription')}</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-lg text-[var(--color-muted)]">{t('indexEmpty')}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <JournalCard post={post} />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <nav className="mt-16 flex items-center justify-between" aria-label={t('paginationLabel')}>
          {page > 1 ? (
            <Link
              href={{ pathname: '/journal', query: { page: page - 1 } }}
              className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {t('previousPage')}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
            {t('pageIndicator', { page, totalPages })}
          </span>
          {page < totalPages ? (
            <Link
              href={{ pathname: '/journal', query: { page: page + 1 } }}
              className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {t('nextPage')}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </main>
  );
}
