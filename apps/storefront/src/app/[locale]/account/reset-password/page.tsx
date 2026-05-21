import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  RequestPasswordResetForm,
  ResetPasswordForm,
} from '@/components/account/PasswordResetForms';
import { type Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResetPasswordPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const search = await searchParams;
  const tokenRaw = search.token;
  const token =
    typeof tokenRaw === 'string'
      ? tokenRaw
      : Array.isArray(tokenRaw) && typeof tokenRaw[0] === 'string'
        ? tokenRaw[0]
        : null;

  const t = await getTranslations('account.passwordReset');

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          {token === null ? t('request.title') : t('complete.title')}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {token === null ? t('request.description') : t('complete.description')}
        </p>
      </header>
      {token === null ? <RequestPasswordResetForm /> : <ResetPasswordForm token={token} />}
    </div>
  );
}
