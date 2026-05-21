'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@hurc/ui';
import { Globe } from '@hurc/ui/icons';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, routing } from '@/i18n/routing';

const localeLabels: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  nl: 'Nederlands',
  es: 'Español',
  it: 'Italiano',
};

type Props = {
  current: Locale;
};

export function LocaleSwitcher({ current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const t = useTranslations('common');

  const onSelect = (next: Locale) => {
    if (next === current) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('language')}
        className="inline-flex h-9 items-center gap-2 px-3 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        disabled={pending}
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span>{current.toUpperCase()}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => {
              onSelect(locale);
            }}
            data-active={locale === current ? 'true' : undefined}
            className="data-[active=true]:text-[var(--color-fg)]"
          >
            <span className="w-8 text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {locale}
            </span>
            <span>{localeLabels[locale]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
