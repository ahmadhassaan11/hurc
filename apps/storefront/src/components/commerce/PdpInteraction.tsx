'use client';

import { useMemo, useState } from 'react';

import { type Locale } from '@/i18n/routing';

import { AddToCartButton } from './AddToCartButton';
import { PriceTag } from './PriceTag';
import { deriveStockLevel } from './stock-level';
import { StockBadge } from './StockBadge';
import {
  type ProductOptionGroup,
  type ProductVariantSummary,
  VariantPicker,
} from './VariantPicker';

type Variant = ProductVariantSummary & {
  priceWithTax: number;
  currencyCode: string;
};

type Props = {
  optionGroups: ProductOptionGroup[];
  variants: Variant[];
  locale: Locale;
};

export function PdpInteraction({ optionGroups, variants, locale }: Props) {
  // We need a default variant to render price/stock before any pick.
  const [defaultVariant] = useState(
    () => variants.find((v) => v.stockLevel !== 'OUT_OF_STOCK') ?? variants[0],
  );

  const variantById = useMemo(() => new Map(variants.map((v) => [v.id, v])), [variants]);

  return (
    <VariantPicker optionGroups={optionGroups} variants={variants}>
      {(selected) => {
        const active =
          (selected !== undefined ? variantById.get(selected.id) : undefined) ?? defaultVariant;
        if (active === undefined) {
          return null;
        }
        const stock = deriveStockLevel(active.stockLevel);
        return (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <PriceTag
                amount={active.priceWithTax}
                currency={active.currencyCode}
                locale={locale}
                size="lg"
              />
              <StockBadge level={stock} />
            </div>
            <AddToCartButton
              variantId={selected !== undefined ? active.id : undefined}
              disabled={stock === 'OUT_OF_STOCK'}
            />
          </div>
        );
      }}
    </VariantPicker>
  );
}
