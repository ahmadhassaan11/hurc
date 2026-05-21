import { ProductBySlugDocument } from '@hurc/graphql/shop';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BreadcrumbTrail } from '@/components/commerce/BreadcrumbTrail';
import { GpsrPanel } from '@/components/commerce/GpsrPanel';
import { PdpInteraction } from '@/components/commerce/PdpInteraction';
import { ProductGallery } from '@/components/commerce/ProductGallery';
import { type Locale } from '@/i18n/routing';
import { logger } from '@/lib/logger/server';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdString } from '@/lib/seo/structured-data';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';
import { tags } from '@/lib/vendure/revalidation';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

async function loadProduct(slug: string) {
  try {
    const data = await shopRequest(
      ProductBySlugDocument,
      { slug },
      { tags: [tags.product(slug)], revalidate: 600 },
    );
    return data.product ?? null;
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return null;
    }
    logger.warn({ err, slug }, 'product fetch failed');
    return null;
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const product = await loadProduct(slug);
  if (product === null) {
    return buildMetadata({
      path: `/${locale === 'en' ? '' : `${locale}/`}products/${slug}`,
      noIndex: true,
    });
  }
  const ogImage =
    product.featuredAsset !== null
      ? {
          url: product.featuredAsset.preview ?? product.featuredAsset.source,
          alt: product.name,
        }
      : undefined;
  return buildMetadata({
    title: product.name,
    description: product.description?.slice(0, 200) ?? `${product.name} — HURC`,
    path: `/${locale === 'en' ? '' : `${locale}/`}products/${slug}`,
    ...(ogImage !== undefined ? { ogImage } : {}),
  });
}

function productJsonLd(
  product: {
    name: string;
    slug: string;
    description?: string | null;
    featuredAsset?: { preview?: string | null; source: string } | null;
    variants: { priceWithTax: number; currencyCode: string; sku: string; stockLevel: string }[];
  },
  siteUrl: string,
  path: string,
) {
  const offerUrl = `${siteUrl}${path}`;
  const cents = (n: number): string => (n / 100).toFixed(2);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? '',
    image: product.featuredAsset?.preview ?? product.featuredAsset?.source ?? undefined,
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      url: offerUrl,
      sku: v.sku,
      price: cents(v.priceWithTax),
      priceCurrency: v.currencyCode,
      availability:
        v.stockLevel === 'OUT_OF_STOCK'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
    })),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const product = await loadProduct(slug);
  if (product === null) {
    notFound();
  }

  const t = await getTranslations('commerce.pdp');

  // Resolve breadcrumb trail from the product's primary collection. The
  // last crumb (product name) intentionally has no href and is rendered
  // as the current page.
  const primaryCollection = product.collections[0];
  const breadcrumbs: { name: string; href?: string }[] = [
    { name: t('home'), href: '/' },
    ...(primaryCollection !== undefined
      ? primaryCollection.breadcrumbs
          .filter((b) => b.slug !== '__root_collection__')
          .map((b) => ({ name: b.name, href: `/${b.slug}` }))
      : []),
    { name: product.name },
  ];

  const galleryAssets =
    product.assets.length > 0
      ? product.assets
      : product.featuredAsset !== null
        ? [product.featuredAsset]
        : [];

  const variants = product.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    priceWithTax: v.priceWithTax,
    currencyCode: v.currencyCode,
    stockLevel: v.stockLevel,
    options: v.options.map((o) => ({ id: o.id, groupId: o.groupId })),
  }));

  const path = `/${locale === 'en' ? '' : `${locale}/`}products/${slug}`;

  return (
    <>
      <article className="mx-auto max-w-7xl px-4 pt-8 md:px-6 md:pt-12">
        <BreadcrumbTrail trail={breadcrumbs} />

        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <ProductGallery assets={galleryAssets} productName={product.name} />

          <div className="flex flex-col gap-6">
            <header>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                {primaryCollection?.name ?? ''}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{product.name}</h1>
            </header>

            {product.description !== null && product.description !== '' ? (
              <p className="max-w-prose text-sm text-[var(--color-muted)]">{product.description}</p>
            ) : null}

            <PdpInteraction
              optionGroups={product.optionGroups.map((group) => ({
                id: group.id,
                code: group.code,
                name: group.name,
                options: group.options.map((o) => ({
                  id: o.id,
                  code: o.code,
                  name: o.name,
                  groupId: group.id,
                })),
              }))}
              variants={variants}
              locale={locale as Locale}
            />
          </div>
        </div>

        <GpsrPanel customFields={product.customFields ?? {}} />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            productJsonLd(
              {
                name: product.name,
                slug: product.slug,
                description: product.description,
                featuredAsset: product.featuredAsset,
                variants: product.variants.map((v) => ({
                  priceWithTax: v.priceWithTax,
                  currencyCode: v.currencyCode,
                  sku: v.sku,
                  stockLevel: v.stockLevel,
                })),
              },
              new URL(path, 'https://hurc.test').origin,
              path,
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbSchema(
              breadcrumbs.flatMap((b) =>
                b.href !== undefined ? [{ name: b.name, href: b.href }] : [],
              ),
            ),
          ),
        }}
      />
    </>
  );
}
