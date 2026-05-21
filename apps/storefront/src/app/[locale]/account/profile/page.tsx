import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ProfileForm } from '@/components/account/ProfileForm';
import { type Locale } from '@/i18n/routing';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const customer = await loadActiveCustomer();
  if (customer === null) {
    redirect('/account/login?next=/account/profile');
  }

  const t = await getTranslations('account.profile');

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('description')}</p>
      </header>
      <ProfileForm
        initialValues={{
          firstName: customer.firstName,
          lastName: customer.lastName,
          phoneNumber: customer.phoneNumber,
          emailAddress: customer.emailAddress,
        }}
      />
    </div>
  );
}
