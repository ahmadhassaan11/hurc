import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AddressForm } from '@/components/account/AddressForm';
import { AddressList } from '@/components/account/AddressList';
import { type Locale } from '@/i18n/routing';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';
import { loadCountries } from '@/lib/vendure/countries';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AddressesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const customer = await loadActiveCustomer();
  if (customer === null) {
    redirect('/account/login?next=/account/addresses');
  }

  const countries = await loadCountries();
  const t = await getTranslations('account.address');

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('description')}</p>
      </header>

      <AddressList addresses={customer.addresses} />

      <section className="border-t border-[var(--color-line)] pt-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.2em]">{t('addNew')}</h2>
        <div className="mt-6">
          <AddressForm countries={countries} />
        </div>
      </section>
    </div>
  );
}
