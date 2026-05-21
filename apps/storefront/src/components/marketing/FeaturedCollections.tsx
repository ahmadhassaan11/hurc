import { CollectionTreeNavDocument } from '@hurc/graphql/shop';
import { ArrowRight } from '@hurc/ui/icons';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { assetUrl, imageSizes } from '@/lib/asset';
import { logger } from '@/lib/logger/server';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';
import { tags } from '@/lib/vendure/revalidation';

const FEATURED_LIMIT = 3;

type FeaturedCollection = {
  slug: string;
  name: string;
  asset: {
    source: string;
    preview: string | null;
    width: number | null;
    height: number | null;
  } | null;
};

async function loadFeatured(channelToken: string): Promise<FeaturedCollection[]> {
  try {
    const data = await shopRequest(
      CollectionTreeNavDocument,
      {},
      {
        tags: [tags.collectionList(channelToken)],
        revalidate: 600,
      },
    );
    return data.collections.items.slice(0, FEATURED_LIMIT).map((c) => ({
      slug: c.slug,
      name: c.name,
      asset: c.featuredAsset
        ? {
            source: c.featuredAsset.source,
            preview: c.featuredAsset.preview ?? null,
            width: c.featuredAsset.width ?? null,
            height: c.featuredAsset.height ?? null,
          }
        : null,
    }));
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      // Backend offline during static build / preview — degrade gracefully.
      return [];
    }
    logger.warn({ err }, 'FeaturedCollections fetch failed; rendering empty fallback');
    return [];
  }
}

type Props = {
  /** Channel token used as the cache-tag namespace. Defaults to "default". */
  channelToken?: string;
};

export async function FeaturedCollections({ channelToken = 'default' }: Props) {
  const t = await getTranslations('home.featured');
  const collections = await loadFeatured(channelToken);

  if (collections.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="featured-title" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            {t('eyebrow')}
          </p>
          <h2 id="featured-title" className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h2>
        </div>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          {t('viewAll')}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {collections.map((collection) => (
          <li key={collection.slug}>
            <Link
              href={`/${collection.slug}`}
              className="group block aspect-[4/5] overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <div className="relative h-full w-full">
                {collection.asset ? (
                  <Image
                    src={assetUrl(collection.asset, { width: 800, quality: 85 })}
                    alt=""
                    fill
                    sizes={imageSizes({ default: '100vw', md: '33vw' })}
                    className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-700)] to-[var(--color-surface-900)]"
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-2xl font-bold uppercase tracking-tight text-[var(--color-brand-white)]">
                    {collection.name}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
