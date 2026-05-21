import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { CustomerStepForm } from '@/components/checkout/CustomerStepForm';
import { type Locale } from '@/i18n/routing';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';
import { loadActiveOrder } from '@/lib/vendure/active-order';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutCustomerStep({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const cart = await loadActiveOrder();
  if (cart === null || cart.lines.length === 0) {
    redirect('/');
  }

  const customer = await loadActiveCustomer();
  const t = await getTranslations('checkout.customer');

  return (
    <div className="flex flex-col gap-8">
      <CheckoutSteps current="customer" />
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('description')}</p>
      </header>
      <CustomerStepForm
        initial={{
          ...(customer?.emailAddress !== undefined ? { emailAddress: customer.emailAddress } : {}),
          ...(customer?.firstName !== undefined ? { firstName: customer.firstName } : {}),
          ...(customer?.lastName !== undefined ? { lastName: customer.lastName } : {}),
          ...(customer?.phoneNumber !== null && customer?.phoneNumber !== undefined
            ? { phoneNumber: customer.phoneNumber }
            : {}),
        }}
      />
    </div>
  );
}
