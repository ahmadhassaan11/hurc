import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LoginForm } from '@/components/account/LoginForm';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { loadActiveCustomer } from '@/lib/vendure/active-customer';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const customer = await loadActiveCustomer();
  if (customer !== null) {
    redirect('/account');
  }

  const t = await getTranslations('account.login');

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t('description')}</p>
      </header>
      <LoginForm />
      <p className="text-sm text-[var(--color-muted)]">
        {t('forgotPasswordPrefix')}{' '}
        <Link href="/account/reset-password" className="underline underline-offset-4">
          {t('forgotPassword')}
        </Link>
      </p>
      <p className="text-sm text-[var(--color-muted)]">
        {t('noAccountPrefix')}{' '}
        <Link href="/account/register" className="underline underline-offset-4">
          {t('register')}
        </Link>
      </p>
    </div>
  );
}
