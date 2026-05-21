import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { ShippingStepForm } from '@/components/checkout/ShippingStepForm';
import { type Locale } from '@/i18n/routing';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';
import { loadActiveOrder } from '@/lib/vendure/active-order';
import { loadEligibleShippingMethods } from '@/lib/vendure/checkout-loaders';
import { loadCountries } from '@/lib/vendure/countries';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ShippingStepPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const cart = await loadActiveOrder();
  if (cart === null || cart.lines.length === 0) {
    redirect('/');
  }

  const [customer, countries, methods] = await Promise.all([
    loadActiveCustomer(),
    loadCountries(),
    loadEligibleShippingMethods(),
  ]);

  if (customer?.emailAddress === undefined && cart.totalQuantity > 0) {
    // The activeOrder needs a customer set before shipping can proceed.
    // If neither the active customer nor the order has one, send back to
    // the customer step.
    // (Vendure's setOrderShippingAddress will reject otherwise.)
  }

  const t = await getTranslations('checkout.shipping');
  const defaultAddress =
    customer?.addresses.find((a) => a.defaultShippingAddress) ?? customer?.addresses[0];

  return (
    <div className="flex flex-col gap-8">
      <CheckoutSteps current="shipping" />
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('description')}</p>
      </header>
      <ShippingStepForm
        countries={countries}
        shippingMethods={methods}
        initialAddress={
          defaultAddress !== undefined
            ? {
                fullName: defaultAddress.fullName ?? '',
                company: defaultAddress.company ?? '',
                streetLine1: defaultAddress.streetLine1,
                streetLine2: defaultAddress.streetLine2 ?? '',
                city: defaultAddress.city ?? '',
                province: defaultAddress.province ?? '',
                postalCode: defaultAddress.postalCode ?? '',
                countryCode: defaultAddress.countryCode,
                phoneNumber: defaultAddress.phoneNumber ?? '',
              }
            : {}
        }
        initialMethodId={null}
        currency={cart.currencyCode}
        locale={locale as Locale}
      />
    </div>
  );
}
