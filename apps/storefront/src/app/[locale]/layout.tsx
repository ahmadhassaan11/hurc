import '../globals.css';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { type ReactNode } from 'react';

import { DraftBanner } from '@/components/editorial/DraftBanner';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { RootProviders } from '@/components/layout/RootProviders';
import { type Locale, routing } from '@/i18n/routing';
import { readConsentCookie } from '@/lib/consent/server';
import { buildMetadata } from '@/lib/seo/metadata';
import { jsonLdString, organizationSchema, websiteSchema } from '@/lib/seo/structured-data';

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`;
  const t = await getTranslations({ locale, namespace: 'common' });
  return buildMetadata({
    title: `${t('brand')} — ${t('tagline')}`,
    path: localePath || '/',
  });
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale as Locale);

  const messages = await getMessages();
  const initialConsent = await readConsentCookie();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-fg)]"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RootProviders initialConsent={initialConsent}>
            <DraftBanner />
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </RootProviders>
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(websiteSchema()) }}
        />
      </body>
    </html>
  );
}
