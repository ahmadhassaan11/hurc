import { ActiveCustomerOrdersDocument } from '@hurc/graphql/shop';
import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { OrderCard } from '@/components/account/OrderCard';
import { type Locale } from '@/i18n/routing';
import { logger } from '@/lib/logger/server';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';
import { shopRequest } from '@/lib/vendure/client';
import { GraphQLClientError } from '@/lib/vendure/errors';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

async function loadOrders() {
  try {
    const data = await shopRequest(ActiveCustomerOrdersDocument, {
      options: { take: 20, sort: { createdAt: 'DESC' } },
    });
    return data.activeCustomer?.orders.items ?? [];
  } catch (err) {
    if (err instanceof GraphQLClientError && err.reason.kind === 'network') {
      return [];
    }
    logger.warn({ err }, 'orders fetch failed');
    return [];
  }
}

export default async function OrdersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const customer = await loadActiveCustomer();
  if (customer === null) {
    redirect('/account/login?next=/account/orders');
  }

  const orders = await loadOrders();
  const t = await getTranslations('account.orders');

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      </header>
      {orders.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">{t('empty')}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard
                order={{
                  id: order.id,
                  code: order.code,
                  state: order.state,
                  totalQuantity: order.totalQuantity,
                  totalWithTax: order.totalWithTax,
                  currencyCode: order.currencyCode,
                  orderPlacedAt: order.orderPlacedAt ?? null,
                }}
                locale={locale as Locale}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
