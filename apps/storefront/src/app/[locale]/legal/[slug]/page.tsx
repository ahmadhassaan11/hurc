import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { EditorialImage } from '@/components/editorial/EditorialImage';
import { PortableText } from '@/components/editorial/PortableText';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { TranslationNotice } from '@/components/legal/TranslationNotice';
import { env } from '@/env';
import { type Locale, routing } from '@/i18n/routing';
import { legalBodies } from '@/lib/legal/content';
import { loadLegalOverlay } from '@/lib/legal/load';
import { isIndexable, isLegalSlug, LEGAL_SLUGS, type LegalSlug } from '@/lib/legal/slugs';
import { jsonLdString } from '@/lib/seo/structured-data';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => LEGAL_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLegalSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: 'legal.titles' });
  const indexable = isIndexable(slug);
  const overlay = await loadLegalOverlay(slug, locale);
  return {
    title: overlay?.seo?.title ?? overlay?.title ?? t(slug),
    description: overlay?.seo?.description,
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  setRequestLocale(locale as Locale);

  const overlay = await loadLegalOverlay(slug, locale);
  const t = await getTranslations({ locale, namespace: 'legal.titles' });
  const tShell = await getTranslations({ locale, namespace: 'legal.shell' });
  const title = overlay?.title ?? t(slug);
  const eyebrow = overlay?.eyebrow ?? tShell('eyebrow');

  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const canonical = `${siteUrl}/${locale}/legal/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    inLanguage: overlay?.language ?? locale,
    mainEntityOfPage: canonical,
  };

  if (overlay !== null) {
    return (
      <>
        <LegalPageShell eyebrow={eyebrow} title={title}>
          <TranslationNotice locale={locale as Locale} />
          {overlay.heroImage !== undefined ? (
            <div className="not-prose relative my-12 aspect-[16/9] overflow-hidden border border-[var(--color-line)]">
              <EditorialImage
                source={overlay.heroImage as never}
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 768px"
                fill
                className="object-cover"
              />
            </div>
          ) : null}
          <PortableText value={overlay.body} />
        </LegalPageShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
        />
      </>
    );
  }

  const Body = legalBodies[slug as LegalSlug];

  return (
    <>
      <LegalPageShell eyebrow={eyebrow} title={title}>
        <TranslationNotice locale={locale as Locale} />
        <Body />
      </LegalPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </>
  );
}
