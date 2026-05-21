import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

import { EditorialImage } from '@/components/editorial/EditorialImage';
import { PortableText } from '@/components/editorial/PortableText';
import { env } from '@/env';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { loadJournalPost } from '@/lib/sanity/queries';
import { jsonLdString } from '@/lib/seo/structured-data';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await loadJournalPost(slug, locale);
  if (!post) return { title: 'Not found' };
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    alternates: {
      languages:
        post.language === locale
          ? undefined
          : { [post.language]: `/${post.language}/journal/${slug}` },
    },
  };
}

export default async function JournalPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const post = await loadJournalPost(slug, locale);
  if (!post) notFound();

  const t = await getTranslations('journal');
  const format = await getFormatter();
  const dateString = format.dateTime(new Date(post.publishedAt), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const canonical = `${siteUrl}/${locale}/journal/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author ?? 'HURC' },
    description: post.excerpt,
    inLanguage: post.language,
    mainEntityOfPage: canonical,
  };

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-24 md:px-6 md:py-32">
        <Link
          href="/journal"
          className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          ← {t('backToIndex')}
        </Link>

        <header className="mt-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            {dateString} · {post.author ?? 'HURC'}
          </p>
          <h1 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.95] tracking-tight">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-8 text-xl text-[var(--color-muted)]">{post.excerpt}</p>
          ) : null}
        </header>

        {post.heroImage ? (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface-800)]">
            <EditorialImage
              source={post.heroImage as never}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              fill
              className="object-cover"
            />
          </div>
        ) : null}

        <PortableText value={post.body} className="mt-12" />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </>
  );
}
