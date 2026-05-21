import { Truck } from '@hurc/ui/icons';
import { useTranslations } from 'next-intl';

import { type Locale } from '@/i18n/routing';
import { formatMoney } from '@/lib/intl/format';

type Props = {
  /** Cart subtotal in integer minor units (matches Vendure's `subTotalWithTax`). */
  subtotal: number;
  /** Threshold in integer minor units. */
  threshold: number;
  currency: string;
  locale: Locale;
};

export function FreeShippingProgress({ subtotal, threshold, currency, locale }: Props) {
  const t = useTranslations('commerce.cart.shipping');
  const reached = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div role="status" aria-live="polite" className="border-t border-[var(--color-line)] pt-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
        <Truck className="h-4 w-4 text-[var(--color-muted)]" aria-hidden />
        {reached ? (
          <span className="text-[var(--color-fg)]">{t('reached')}</span>
        ) : (
          <span className="text-[var(--color-muted)]">
            {t('remaining', { amount: formatMoney(remaining, locale, currency) })}
          </span>
        )}
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden bg-[var(--color-surface-700)]">
        <div
          aria-hidden
          className="h-full bg-[var(--color-fg)] transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${String(pct)}%` }}
        />
      </div>
    </div>
  );
}
