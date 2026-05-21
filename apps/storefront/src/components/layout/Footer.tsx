import { Separator } from '@hurc/ui';
import { getTranslations } from 'next-intl/server';

import { ManageCookiesButton } from '@/components/consent/ManageCookiesButton';
import { Link } from '@/i18n/navigation';

const linkColumns = [
  {
    key: 'shop',
    items: [
      { key: 'run', href: '/run' },
      { key: 'train', href: '/train' },
      { key: 'yoga', href: '/yoga' },
      { key: 'studio', href: '/studio' },
      { key: 'sale', href: '/sale' },
    ],
  },
  {
    key: 'help',
    items: [
      { key: 'support', href: '/support' },
      { key: 'shipping', href: '/shipping' },
      { key: 'returns', href: '/returns' },
      { key: 'sizeGuide', href: '/size-guide' },
    ],
  },
  {
    key: 'brand',
    items: [
      { key: 'story', href: '/story' },
      { key: 'sustainability', href: '/sustainability' },
      { key: 'editorial', href: '/journal' },
      { key: 'careers', href: '/careers' },
    ],
  },
  {
    key: 'legal',
    items: [
      { key: 'imprint', href: '/legal/imprint' },
      { key: 'terms', href: '/legal/terms' },
      { key: 'privacy', href: '/legal/privacy' },
      { key: 'cookies', href: '/legal/cookies' },
      { key: 'withdrawal', href: '/legal/withdrawal' },
    ],
  },
] as const;

export async function Footer() {
  const t = await getTranslations('footer');
  const tc = await getTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface-900)]">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {linkColumns.map((column) => (
            <div key={column.key} className="flex flex-col gap-4">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-muted)]">
                {t(`columns.${column.key}.title`)}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.items.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--color-fg)] transition-colors hover:text-[var(--color-muted)]"
                    >
                      {t(`columns.${column.key}.items.${item.key}`)}
                    </Link>
                  </li>
                ))}
                {column.key === 'legal' ? (
                  <li>
                    <ManageCookiesButton />
                  </li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12 bg-[var(--color-line)]" />

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            © {year} {tc('brand')} · {t('tagline')}
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            {t('localeBadge', { currency: 'EUR', region: 'EU' })}
          </p>
        </div>
      </div>
    </footer>
  );
}
