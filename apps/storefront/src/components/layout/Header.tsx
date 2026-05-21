import { getLocale, getTranslations } from 'next-intl/server';

import { CartDrawerBody } from '@/components/commerce/CartDrawerBody';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { loadActiveOrder } from '@/lib/vendure/active-order';

import { LocaleSwitcher } from './LocaleSwitcher';
import { MiniCartTrigger } from './MiniCartTrigger';
import { MobileNav } from './MobileNav';
import { primaryNav } from './nav-items';
import { SkipToContent } from './SkipToContent';

export async function Header() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('nav');
  const tc = await getTranslations('common');

  const cart = await loadActiveOrder();

  return (
    <header className="bg-[var(--color-bg)]/90 supports-[backdrop-filter]:bg-[var(--color-bg)]/70 sticky top-0 z-50 border-b border-[var(--color-line)] backdrop-blur">
      <SkipToContent />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:gap-8 md:px-6">
        <MobileNav />

        <Link
          href="/"
          aria-label={tc('home')}
          className="text-xl font-bold tracking-[0.2em] text-[var(--color-fg)] hover:text-[var(--color-muted)]"
        >
          {tc('brand')}
        </Link>

        <nav
          aria-label={tc('navMenu')}
          className="hidden flex-1 items-center justify-center gap-6 md:flex"
        >
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <LocaleSwitcher current={locale} />
          <Link
            href="/account"
            aria-label={tc('account')}
            className="hidden h-9 px-3 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)] md:inline-flex md:items-center"
          >
            {tc('account')}
          </Link>
          <MiniCartTrigger count={cart?.totalQuantity ?? 0}>
            <CartDrawerBody cart={cart} locale={locale} />
          </MiniCartTrigger>
        </div>
      </div>
    </header>
  );
}
