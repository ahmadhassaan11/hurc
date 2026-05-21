'use client';

import { Button, toast } from '@hurc/ui';
import { Minus, Plus, Trash2 } from '@hurc/ui/icons';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { type Locale } from '@/i18n/routing';
import { adjustOrderLineAction, removeOrderLineAction } from '@/lib/actions/cart';
import { assetUrl } from '@/lib/asset';
import { vendureErrorMessageKey } from '@/lib/vendure/error-messages';

import { PriceTag } from './PriceTag';

export type CartLineData = {
  id: string;
  quantity: number;
  unitPriceWithTax: number;
  linePriceWithTax: number;
  currencyCode: string;
  productVariantName: string;
  productName: string;
  slug: string;
  optionLabels: string[];
  asset: { source: string; preview?: string | null } | null;
};

type Props = {
  line: CartLineData;
  locale: Locale;
};

export function CartLine({ line, locale }: Props) {
  const t = useTranslations('commerce.cart');
  const tErrors = useTranslations();
  const [pending, startTransition] = useTransition();

  function adjust(nextQuantity: number) {
    if (pending) return;
    startTransition(async () => {
      const result = await adjustOrderLineAction({
        orderLineId: line.id,
        quantity: nextQuantity,
      });
      if (result?.data?.ok === false) {
        toast.error(tErrors(vendureErrorMessageKey(result.data.error)));
      }
    });
  }

  function remove() {
    if (pending) return;
    startTransition(async () => {
      const result = await removeOrderLineAction({ orderLineId: line.id });
      if (result?.data?.ok === false) {
        toast.error(tErrors(vendureErrorMessageKey(result.data.error)));
      }
    });
  }

  return (
    <li className="flex gap-4 py-4">
      <div className="relative aspect-[3/4] h-28 shrink-0 overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface-800)]">
        {line.asset !== null ? (
          <Image
            src={assetUrl(line.asset, { width: 240, quality: 80 })}
            alt={line.productName}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em]">{line.productName}</p>
            {line.optionLabels.length > 0 ? (
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {line.optionLabels.join(' · ')}
              </p>
            ) : null}
          </div>
          <PriceTag
            amount={line.linePriceWithTax}
            currency={line.currencyCode}
            locale={locale}
            size="sm"
          />
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="inline-flex items-center border border-[var(--color-line)]">
            <Button
              type="button"
              intent="ghost"
              size="sm"
              aria-label={t('decrement')}
              disabled={pending || line.quantity <= 1}
              onClick={() => {
                adjust(line.quantity - 1);
              }}
              className="h-8 w-8 px-0"
            >
              <Minus className="h-3 w-3" aria-hidden />
            </Button>
            <span
              aria-live="polite"
              className="inline-flex h-8 min-w-8 items-center justify-center text-xs"
            >
              {line.quantity}
            </span>
            <Button
              type="button"
              intent="ghost"
              size="sm"
              aria-label={t('increment')}
              disabled={pending || line.quantity >= 99}
              onClick={() => {
                adjust(line.quantity + 1);
              }}
              className="h-8 w-8 px-0"
            >
              <Plus className="h-3 w-3" aria-hidden />
            </Button>
          </div>

          <Button
            type="button"
            intent="ghost"
            size="sm"
            aria-label={t('remove')}
            disabled={pending}
            onClick={remove}
            className="h-8 w-8 px-0 text-[var(--color-muted)] hover:text-[var(--color-accent)]"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </li>
  );
}
