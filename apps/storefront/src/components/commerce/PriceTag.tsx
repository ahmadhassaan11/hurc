import { cn } from '@hurc/ui';

import { type Locale } from '@/i18n/routing';
import { formatMoney } from '@/lib/intl/format';

type PriceTagProps = {
  amount: number;
  currency: string;
  locale: Locale;
  /** When provided, renders a strikethrough original price next to the discounted amount. */
  originalAmount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function PriceTag({
  amount,
  currency,
  locale,
  originalAmount,
  size = 'md',
  className,
}: PriceTagProps) {
  const isDiscounted = originalAmount !== undefined && originalAmount > amount;
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  } satisfies Record<NonNullable<PriceTagProps['size']>, string>;

  return (
    <span
      className={cn('inline-flex items-baseline gap-2 tabular-nums', sizeClasses[size], className)}
    >
      <span className={cn(isDiscounted && 'text-[var(--color-accent)]')}>
        {formatMoney(amount, locale, currency)}
      </span>
      {isDiscounted ? (
        <span
          aria-label="Original price"
          className="text-xs text-[var(--color-muted)] line-through"
        >
          {formatMoney(originalAmount, locale, currency)}
        </span>
      ) : null}
    </span>
  );
}
