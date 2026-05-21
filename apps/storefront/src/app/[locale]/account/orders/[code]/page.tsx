import { OrderByCodeDocument } from '@hurc/graphql/shop';
import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { OrderSummaryCard } from '@/components/commerce/OrderSummaryCard';
import { PriceTag } from '@/components/commerce/PriceTag';
import { type Locale } from '@/i18n/routing';
import { formatDate } from '@/lib/intl/format';
import { logger } from '@/lib/logger/server';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string; code: string }>;
};

async function loadOrder(code: string) {
  try {
    const data = await shopRequest(OrderByCodeDocument, { code });
    return data.orderByCode ?? null;
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return null;
    }
    logger.warn({ err, code }, 'order fetch failed');
    return null;
  }
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { locale, code } = await params;
  setRequestLocale(locale as Locale);

  const customer = await loadActiveCustomer();
  if (customer === null) {
    redirect(`/account/login?next=/account/orders/${code}`);
  }

  const order = await loadOrder(code);
  if (order === null) {
    notFound();
  }

  const t = await getTranslations('account.orders.detail');

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {t('eyebrow', { code: order.code })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {order.orderPlacedAt !== null && order.orderPlacedAt !== undefined
            ? formatDate(order.orderPlacedAt, locale as Locale)
            : t('pending')}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {t('state', { state: order.state })}
        </p>
      </header>

      <ul className="flex flex-col divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
        {order.lines.map((line) => (
          <li key={line.id} className="flex items-baseline justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.15em]">
                {line.productVariant.product.name}
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                {line.productVariant.options.map((o) => o.name).join(' · ')} · ×{line.quantity}
              </p>
            </div>
            <PriceTag
              amount={line.linePriceWithTax}
              currency={order.currencyCode}
              locale={locale as Locale}
              size="sm"
            />
          </li>
        ))}
      </ul>

      <OrderSummaryCard
        subtotal={order.subTotalWithTax}
        shipping={order.shippingWithTax}
        total={order.totalWithTax}
        currency={order.currencyCode}
        locale={locale as Locale}
      />
    </div>
  );
}
