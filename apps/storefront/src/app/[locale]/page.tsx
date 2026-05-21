import { setRequestLocale } from 'next-intl/server';

import { ActivityGrid } from '@/components/marketing/ActivityGrid';
import { BrandStatement } from '@/components/marketing/BrandStatement';
import { FeaturedCollections } from '@/components/marketing/FeaturedCollections';
import { Hero } from '@/components/marketing/Hero';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';
import { type Locale } from '@/i18n/routing';
import { loadActivities, loadHomepage } from '@/lib/sanity/queries';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const [homepage, activities] = await Promise.all([loadHomepage(locale), loadActivities(locale)]);

  return (
    <>
      <Hero override={homepage?.heroOverride ?? null} />
      <ActivityGrid
        overrides={activities.map((a) => ({
          slug: a.slug,
          eyebrow: a.eyebrow,
          title: a.title,
          heroImage: a.heroImage,
        }))}
      />
      <FeaturedCollections />
      <BrandStatement override={homepage?.brandStatementOverride ?? null} />
      <NewsletterForm />
    </>
  );
}
