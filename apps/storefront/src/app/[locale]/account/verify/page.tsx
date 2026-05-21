import { getTranslations, setRequestLocale } from 'next-intl/server';

import { VerifyAccountClient } from '@/components/account/VerifyAccountClient';
import { type Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VerifyPage({ params, searchParams }: PageProps) {
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

  const t = await getTranslations('account.verify');

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      </header>
      {token === null ? (
        <p className="text-sm text-[var(--color-muted)]">{t('checkInbox')}</p>
      ) : (
        <VerifyAccountClient token={token} />
      )}
    </div>
  );
}
