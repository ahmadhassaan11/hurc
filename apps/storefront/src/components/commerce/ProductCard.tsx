import { Badge } from '@hurc/ui';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { assetUrl, imageSizes } from '@/lib/asset';

import { PriceTag } from './PriceTag';

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  featuredAsset: {
    source: string;
    preview?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  variantList: {
    items: {
      id: string;
      priceWithTax: number;
      currencyCode: string;
    }[];
  };
  customFields?: {
    activity?: readonly string[] | null;
  } | null;
};

type ProductCardProps = {
  product: ProductCardData;
  locale: Locale;
  /** When true, the card image gets a `priority` hint (for above-the-fold cards). */
  priority?: boolean;
};

export function ProductCard({ product, locale, priority = false }: ProductCardProps) {
  const variant = product.variantList.items[0];
  const activity = product.customFields?.activity?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3 focus-visible:outline-none"
    >
      <div className="relative aspect-[3/4] overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface-800)] transition-colors group-hover:border-[var(--color-fg)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-accent)]">
        {product.featuredAsset !== null ? (
          <Image
            src={assetUrl(product.featuredAsset, { width: 800, quality: 85 })}
            alt={product.name}
            fill
            sizes={imageSizes({ default: '50vw', md: '33vw', lg: '25vw' })}
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-700)] to-[var(--color-surface-900)]"
          />
        )}
        {activity !== undefined ? (
          <Badge className="absolute left-3 top-3" intent="default">
            {activity}
          </Badge>
        ) : null}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-fg)]">
          {product.name}
        </h3>
        {variant !== undefined ? (
          <PriceTag
            amount={variant.priceWithTax}
            currency={variant.currencyCode}
            locale={locale}
            size="sm"
          />
        ) : null}
      </div>
    </Link>
  );
}
