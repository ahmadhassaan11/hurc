import { useTranslations } from 'next-intl';

import { PriceTag } from '@/components/commerce/PriceTag';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { formatDate } from '@/lib/intl/format';

type Order = {
  id: string;
  code: string;
  state: string;
  totalQuantity: number;
  totalWithTax: number;
  currencyCode: string;
  orderPlacedAt?: string | null;
};

type Props = {
  order: Order;
  locale: Locale;
};

export function OrderCard({ order, locale }: Props) {
  const t = useTranslations('account.orders');

  return (
    <Link
      href={`/account/orders/${order.code}`}
      className="flex items-center justify-between gap-4 border border-[var(--color-line)] bg-[var(--color-surface-800)] p-6 transition-colors hover:border-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {t('code', { code: order.code })}
        </p>
        <p className="text-sm">
          {order.orderPlacedAt !== null && order.orderPlacedAt !== undefined
            ? formatDate(order.orderPlacedAt, locale)
            : t('pending')}
        </p>
        <p className="text-xs text-[var(--color-muted)]">
          {t('state', { state: order.state })} · {t('items', { count: order.totalQuantity })}
        </p>
      </div>
      <PriceTag
        amount={order.totalWithTax}
        currency={order.currencyCode}
        locale={locale}
        size="md"
      />
    </Link>
  );
}
