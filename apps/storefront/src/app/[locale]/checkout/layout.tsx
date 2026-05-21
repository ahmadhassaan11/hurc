import { type ReactNode } from 'react';

import { Link } from '@/i18n/navigation';

type Props = {
  children: ReactNode;
};

/**
 * Checkout chrome — explicitly omits the global header nav so the
 * customer can't wander away from the funnel by accident. Logo links
 * back to home; everything else is intentionally absent.
 */
export default function CheckoutLayout({ children }: Props) {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-line)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] text-[var(--color-fg)] hover:text-[var(--color-muted)]"
          >
            HURC
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">{children}</main>
    </div>
  );
}
