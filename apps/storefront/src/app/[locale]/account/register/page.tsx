import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { RegisterForm } from '@/components/account/RegisterForm';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const customer = await loadActiveCustomer();
  if (customer !== null) {
    redirect('/account');
  }

  const t = await getTranslations('account.register');

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('description')}</p>
      </header>
      <RegisterForm />
      <p className="text-sm text-[var(--color-muted)]">
        {t('haveAccountPrefix')}{' '}
        <Link href="/account/login" className="underline underline-offset-4">
          {t('login')}
        </Link>
      </p>
    </div>
  );
}
