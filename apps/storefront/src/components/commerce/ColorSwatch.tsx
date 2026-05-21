import { cn } from '@hurc/ui';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Hex / CSS color string. */
  color: string;
  /** Visible name for screen readers. */
  name: string;
  selected?: boolean;
  outOfStock?: boolean;
};

/**
 * A circular color chip used in the PDP variant picker. The button
 * carries the option name as `aria-label` for screen readers; the
 * chip itself is the visible target.
 */
export const ColorSwatch = forwardRef<HTMLButtonElement, Props>(
  ({ color, name, selected, outOfStock, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={name}
        aria-pressed={selected}
        aria-disabled={outOfStock}
        className={cn(
          'relative h-8 w-8 rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
          selected
            ? 'border-[var(--color-fg)] ring-1 ring-[var(--color-fg)] ring-offset-2 ring-offset-[var(--color-bg)]'
            : 'border-[var(--color-line)] hover:border-[var(--color-fg)]',
          outOfStock && 'line-through opacity-40',
          className,
        )}
        {...props}
      >
        <span
          aria-hidden
          style={{ background: color }}
          className="block h-full w-full rounded-full"
        />
      </button>
    );
  },
);
ColorSwatch.displayName = 'ColorSwatch';
