import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LogoutButton } from '@/components/account/LogoutButton';
import { type Locale } from '@/i18n/routing';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AccountDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const customer = await loadActiveCustomer();
  if (customer === null) {
    redirect('/account/login?next=/account');
  }

  const t = await getTranslations('account.dashboard');

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {t('eyebrow')}
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {t('greeting', { firstName: customer.firstName })}
        </h1>
      </header>

      <p className="text-sm text-[var(--color-muted)]">{t('description')}</p>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}
