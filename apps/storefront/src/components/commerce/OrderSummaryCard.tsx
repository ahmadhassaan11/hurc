import { Separator } from '@hurc/ui';
import { useTranslations } from 'next-intl';

import { type Locale } from '@/i18n/routing';
import { formatMoney } from '@/lib/intl/format';

type Props = {
  subtotal: number;
  shipping?: number | null;
  total: number;
  currency: string;
  locale: Locale;
};

export function OrderSummaryCard({ subtotal, shipping, total, currency, locale }: Props) {
  const t = useTranslations('commerce.cart.totals');

  const row = (label: string, amount: number) => (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span className="tabular-nums">{formatMoney(amount, locale, currency)}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 border-t border-[var(--color-line)] pt-4">
      {row(t('subtotal'), subtotal)}
      {shipping !== null && shipping !== undefined ? (
        row(t('shipping'), shipping)
      ) : (
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-[var(--color-muted)]">{t('shipping')}</span>
          <span className="text-[var(--color-muted)]">{t('shippingPending')}</span>
        </div>
      )}
      <Separator className="my-2" />
      <div className="flex items-baseline justify-between">
        <span className="text-sm uppercase tracking-[0.2em]">{t('total')}</span>
        <span className="text-lg font-semibold tabular-nums">
          {formatMoney(total, locale, currency)}
        </span>
      </div>
    </div>
  );
}
