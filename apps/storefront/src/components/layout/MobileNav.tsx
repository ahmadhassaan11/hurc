'use client';

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@hurc/ui';
import { Menu } from '@hurc/ui/icons';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

import { primaryNav } from './nav-items';

export function MobileNav() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');

  return (
    <Sheet>
      <SheetTrigger
        aria-label={tc('openMenu')}
        className="inline-flex h-9 w-9 items-center justify-center text-[var(--color-fg)] transition-colors hover:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </SheetTrigger>
      <SheetContent side="left" size="md">
        <SheetTitle>{tc('brand')}</SheetTitle>
        <SheetDescription className="sr-only">{tc('navMenu')}</SheetDescription>
        <nav aria-label={tc('navMenu')} className="mt-8 flex flex-col gap-6">
          {primaryNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-2xl font-medium uppercase tracking-[0.2em] hover:text-[var(--color-muted)]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
