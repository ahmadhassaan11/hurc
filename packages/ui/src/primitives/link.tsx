import { type AnchorHTMLAttributes, forwardRef } from 'react';

import { cn } from '../lib/cn';
import { cva, type VariantProps } from '../lib/cva';

export const linkVariants = cva(
  'inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
  {
    variants: {
      intent: {
        default: 'text-[var(--color-fg)] hover:text-[var(--color-muted)]',
        accent: 'text-[var(--color-accent)] hover:opacity-80',
        muted: 'text-[var(--color-muted)] hover:text-[var(--color-fg)]',
      },
      underline: {
        none: 'no-underline',
        hover: 'no-underline hover:underline underline-offset-4',
        always: 'underline underline-offset-4',
      },
    },
    defaultVariants: { intent: 'default', underline: 'hover' },
  },
);

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof linkVariants>;

/**
 * Plain `<a>` styled with the link variant system. The locale-aware
 * `<Link>` from `next-intl/navigation` lives in the storefront — this
 * primitive is the visual layer; consumers wrap a next-intl `<Link>`
 * around `<UiLink asChild>` style or pass `href` for external links.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, intent, underline, children, ...props }, ref) => {
    return (
      <a ref={ref} className={cn(linkVariants({ intent, underline }), className)} {...props}>
        {children}
      </a>
    );
  },
);
Link.displayName = 'Link';
