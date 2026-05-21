import { cn } from '@hurc/ui';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  selected?: boolean;
  outOfStock?: boolean;
};

export const SizeChip = forwardRef<HTMLButtonElement, Props>(
  ({ label, selected, outOfStock, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        aria-disabled={outOfStock}
        className={cn(
          'inline-flex h-10 min-w-12 items-center justify-center border px-3 text-xs font-medium uppercase tracking-[0.2em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
          selected
            ? 'border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]'
            : 'border-[var(--color-line)] text-[var(--color-fg)] hover:border-[var(--color-fg)]',
          outOfStock && 'line-through opacity-40',
          className,
        )}
        {...props}
      >
        {label}
      </button>
    );
  },
);
SizeChip.displayName = 'SizeChip';
