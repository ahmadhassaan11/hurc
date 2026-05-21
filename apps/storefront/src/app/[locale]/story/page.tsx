import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { EditorialImage } from '@/components/editorial/EditorialImage';
import { PortableText } from '@/components/editorial/PortableText';
import { env } from '@/env';
import { type Locale } from '@/i18n/routing';
import { loadPage } from '@/lib/sanity/queries';
import { jsonLdString } from '@/lib/seo/structured-data';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await loadPage('story', locale);
  if (!page) {
    const t = await getTranslations({ locale, namespace: 'story' });
    return { title: t('title') };
  }
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const page = await loadPage('story', locale);
  if (!page) notFound();

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const canonical = `${siteUrl}/${locale}/story`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.seo?.description,
    inLanguage: page.language,
    mainEntityOfPage: canonical,
  };

  return (
    <>
      <main id="content" className="mx-auto max-w-3xl px-4 py-24 md:px-6 md:py-32">
        <header>
          {page.eyebrow ? (
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-muted)]">
              {page.eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.95] tracking-tight">
            {page.title}
          </h1>
        </header>

        {page.heroImage ? (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface-800)]">
            <EditorialImage
              source={page.heroImage as never}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              fill
              className="object-cover"
            />
          </div>
        ) : null}

        <PortableText value={page.body} className="mt-12" />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </>
  );
}
