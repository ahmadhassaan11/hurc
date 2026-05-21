import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { PaymentStepForm } from '@/components/checkout/PaymentStepForm';
import { WithdrawalNotice } from '@/components/checkout/WithdrawalNotice';
import { OrderSummaryCard } from '@/components/commerce/OrderSummaryCard';
import { type Locale } from '@/i18n/routing';
import { loadActiveOrder } from '@/lib/vendure/active-order';
import { loadEligiblePaymentMethods } from '@/lib/vendure/checkout-loaders';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PaymentStepPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const cart = await loadActiveOrder();
  if (cart === null || cart.lines.length === 0) {
    redirect('/');
  }

  const methods = await loadEligiblePaymentMethods();
  const t = await getTranslations('checkout.payment');

  return (
    <div className="flex flex-col gap-8">
      <CheckoutSteps current="payment" />
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('description')}</p>
      </header>

      {methods.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">{t('methodsEmpty')}</p>
      ) : (
        <PaymentStepForm methods={methods} />
      )}

      <OrderSummaryCard
        subtotal={cart.subTotalWithTax}
        shipping={cart.shippingWithTax > 0 ? cart.shippingWithTax : null}
        total={cart.totalWithTax}
        currency={cart.currencyCode}
        locale={locale as Locale}
      />

      <WithdrawalNotice />
    </div>
  );
}
