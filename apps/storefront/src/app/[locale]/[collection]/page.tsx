import {
  CollectionBySlugDocument,
  SearchProductsDocument,
  type SearchResultFieldsFragment,
  type SortOrder,
} from '@hurc/graphql/shop';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BreadcrumbTrail } from '@/components/commerce/BreadcrumbTrail';
import { PaginationLinks } from '@/components/commerce/PaginationLinks';
import { ProductCard, type ProductCardData } from '@/components/commerce/ProductCard';
import { ProductSort } from '@/components/commerce/ProductSort';
import { DEFAULT_SORT, isSortValue, type SortValue } from '@/components/commerce/sort';
import { type Locale } from '@/i18n/routing';
import { logger } from '@/lib/logger/server';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdString } from '@/lib/seo/structured-data';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';
import { tags } from '@/lib/vendure/revalidation';

const PER_PAGE = 24;

type PageProps = {
  params: Promise<{ locale: string; collection: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSingleParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = params[key];
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
  return undefined;
}

function parsePage(raw: string | undefined): number {
  if (raw === undefined) return 1;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function sortInput(sort: SortValue): {
  name?: SortOrder;
  price?: SortOrder;
} {
  switch (sort) {
    case 'name-asc':
      return { name: 'ASC' };
    case 'name-desc':
      return { name: 'DESC' };
    case 'price-asc':
      return { price: 'ASC' };
    case 'price-desc':
      return { price: 'DESC' };
  }
}

function priceFromResult(result: SearchResultFieldsFragment): number {
  const p = result.priceWithTax;
  if (p.__typename === 'SinglePrice') return p.value;
  if (p.__typename === 'PriceRange') return p.min;
  return 0;
}

function adaptSearchResult(result: SearchResultFieldsFragment): ProductCardData {
  return {
    id: result.productId,
    slug: result.slug,
    name: result.productName,
    description: result.description,
    featuredAsset: result.productAsset
      ? { source: result.productAsset.preview, preview: result.productAsset.preview }
      : null,
    variantList: {
      items: [
        {
          id: `${result.productId}-card`,
          priceWithTax: priceFromResult(result),
          currencyCode: result.currencyCode,
        },
      ],
    },
    customFields: null,
  };
}

async function loadCollection(slug: string) {
  try {
    const data = await shopRequest(
      CollectionBySlugDocument,
      { slug },
      { tags: [tags.collection(slug)], revalidate: 600 },
    );
    return data.collection ?? null;
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return null;
    }
    logger.warn({ err, slug }, 'collection fetch failed');
    return null;
  }
}

async function loadSearch(input: {
  collectionSlug: string;
  page: number;
  sort: SortValue;
  channelToken: string;
}) {
  try {
    const data = await shopRequest(
      SearchProductsDocument,
      {
        input: {
          collectionSlug: input.collectionSlug,
          take: PER_PAGE,
          skip: (input.page - 1) * PER_PAGE,
          groupByProduct: true,
          sort: sortInput(input.sort),
        },
      },
      {
        tags: [tags.collection(input.collectionSlug), tags.productList(input.channelToken)],
        revalidate: 600,
      },
    );
    return {
      items: data.search.items,
      totalItems: data.search.totalItems,
    };
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return { items: [], totalItems: 0 };
    }
    logger.warn({ err, slug: input.collectionSlug }, 'search fetch failed');
    return { items: [], totalItems: 0 };
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { locale, collection: slug } = await props.params;
  const collection = await loadCollection(slug);
  if (collection === null) {
    return buildMetadata({ path: `/${locale === 'en' ? '' : `${locale}/`}${slug}`, noIndex: true });
  }
  return buildMetadata({
    title: collection.name,
    description: `${collection.name} — HURC`,
    path: `/${locale === 'en' ? '' : `${locale}/`}${slug}`,
  });
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { locale, collection: slug } = await params;
  setRequestLocale(locale as Locale);

  const search = await searchParams;
  const sortRaw = readSingleParam(search, 'sort');
  const sort: SortValue = isSortValue(sortRaw) ? sortRaw : DEFAULT_SORT;
  const page = parsePage(readSingleParam(search, 'page'));

  const collection = await loadCollection(slug);
  if (collection === null) {
    notFound();
  }

  const channelToken = 'default';
  const result = await loadSearch({
    collectionSlug: slug,
    page,
    sort,
    channelToken,
  });

  const t = await getTranslations('commerce.plp');
  const totalPages = Math.max(1, Math.ceil(result.totalItems / PER_PAGE));
  const products = result.items.map(adaptSearchResult);

  const sitePath = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`;
  const breadcrumbs = [
    { name: t('home'), href: '/' },
    ...collection.breadcrumbs
      .filter((b) => b.slug !== '__root_collection__')
      .map((b) => ({ name: b.name, href: `/${b.slug}` })),
  ];

  function hrefForPage(p: number): string {
    const q = new URLSearchParams();
    if (sort !== DEFAULT_SORT) q.set('sort', sort);
    if (p > 1) q.set('page', String(p));
    const qs = q.toString();
    return qs === '' ? sitePath : `${sitePath}?${qs}`;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-8 md:px-6 md:pt-12">
        <BreadcrumbTrail trail={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">{collection.name}</h1>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            {t('total', { count: result.totalItems })}
          </p>
          <ProductSort
            current={sort}
            preservedQuery={{ page: page > 1 ? String(page) : undefined }}
          />
        </div>

        {products.length === 0 ? (
          <div className="border border-dashed border-[var(--color-line)] py-24 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t('empty')}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} locale={locale as Locale} priority={index < 4} />
              </li>
            ))}
          </ul>
        )}

        <PaginationLinks currentPage={page} totalPages={totalPages} hrefForPage={hrefForPage} />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(breadcrumbSchema(breadcrumbs)),
        }}
      />
    </>
  );
}
