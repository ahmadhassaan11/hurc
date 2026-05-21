import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

const links = [
  { key: 'dashboard', href: '/account' },
  { key: 'profile', href: '/account/profile' },
  { key: 'addresses', href: '/account/addresses' },
  { key: 'orders', href: '/account/orders' },
  { key: 'data', href: '/account/data' },
] as const;

export async function AccountSidebar() {
  const t = await getTranslations('account.sidebar');

  return (
    <nav
      aria-label={t('title')}
      className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-1"
    >
      {links.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          className="whitespace-nowrap border border-transparent px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-line)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          {t(link.key)}
        </Link>
      ))}
    </nav>
  );
}
