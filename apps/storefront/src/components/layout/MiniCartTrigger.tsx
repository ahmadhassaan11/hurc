'use client';

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@hurc/ui';
import { ShoppingBag } from '@hurc/ui/icons';
import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';

type Props = {
  /** Total quantity in the active order. */
  count: number;
  /** Server-rendered drawer body composed via children. */
  children: ReactNode;
};

export function MiniCartTrigger({ count, children }: Props) {
  const t = useTranslations('common');
  const showBadge = count > 0;

  return (
    <Sheet>
      <SheetTrigger
        aria-label={t('cart', { count })}
        className="relative inline-flex h-9 w-9 items-center justify-center text-[var(--color-fg)] transition-colors hover:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden />
        {showBadge ? (
          <span
            aria-hidden
            className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-medium text-[var(--color-brand-white)]"
          >
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent side="right" size="md" className="flex flex-col">
        <SheetTitle>{t('cartTitle')}</SheetTitle>
        <SheetDescription className="sr-only">{t('cart', { count })}</SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
}
