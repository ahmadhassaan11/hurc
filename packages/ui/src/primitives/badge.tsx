import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../lib/cn';
import { cva, type VariantProps } from '../lib/cva';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em]',
  {
    variants: {
      intent: {
        default: 'border-[var(--color-line)] bg-[var(--color-surface-800)] text-[var(--color-fg)]',
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
        destructive:
          'border-[var(--color-accent)]/40 bg-[color:rgba(230,57,70,0.12)] text-[var(--color-accent)]',
      },
    },
    defaultVariants: { intent: 'default' },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, intent, ...props }, ref) => {
    return <span ref={ref} className={cn(badgeVariants({ intent }), className)} {...props} />;
  },
);
Badge.displayName = 'Badge';
