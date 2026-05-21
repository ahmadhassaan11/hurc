import { OrderByCodeDocument } from '@hurc/graphql/shop';
import { CheckCircle2 } from '@hurc/ui/icons';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { OrderSummaryCard } from '@/components/commerce/OrderSummaryCard';
import { PriceTag } from '@/components/commerce/PriceTag';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { logger } from '@/lib/logger/server';
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

export default async function ConfirmationPage({ params }: PageProps) {
  const { locale, code } = await params;
  setRequestLocale(locale as Locale);

  const order = await loadOrder(code);
  if (order === null) {
    notFound();
  }

  const t = await getTranslations('checkout.confirmation');

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 aria-hidden className="h-16 w-16 text-emerald-400" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t('title')}</h1>
        <p className="text-sm text-[var(--color-muted)]">
          {t('description', { code: order.code })}
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

      <Link
        href="/account/orders"
        className="self-start text-sm uppercase tracking-[0.2em] text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-fg)] hover:underline"
      >
        {t('viewOrders')}
      </Link>
    </div>
  );
}
