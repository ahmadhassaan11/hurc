import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type AnchorHTMLAttributes, forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../lib/cn';
import { cva, type VariantProps } from '../lib/cva';

export type PaginationProps = HTMLAttributes<HTMLElement>;

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
      />
    );
  },
);
Pagination.displayName = 'Pagination';

export const PaginationContent = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    return (
      <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
    );
  },
);
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return <li ref={ref} className={cn('', className)} {...props} />;
  },
);
PaginationItem.displayName = 'PaginationItem';

const paginationLinkVariants = cva(
  'inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
  {
    variants: {
      active: {
        true: 'bg-[var(--color-fg)] text-[var(--color-bg)]',
        false: 'text-[var(--color-fg)] hover:bg-[var(--color-surface-700)]',
      },
    },
    defaultVariants: { active: false },
  },
);

export type PaginationLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof paginationLinkVariants>;

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-current={active ? 'page' : undefined}
        className={cn(paginationLinkVariants({ active }), className)}
        {...props}
      >
        {children}
      </a>
    );
  },
);
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-label="Previous page"
        className={cn(
          'inline-flex h-10 items-center justify-center gap-1 px-3 text-sm transition-colors hover:bg-[var(--color-surface-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] aria-disabled:pointer-events-none aria-disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        <span>{children}</span>
      </a>
    );
  },
);
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-label="Next page"
        className={cn(
          'inline-flex h-10 items-center justify-center gap-1 px-3 text-sm transition-colors hover:bg-[var(--color-surface-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] aria-disabled:pointer-events-none aria-disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        <ChevronRight className="h-4 w-4" aria-hidden />
      </a>
    );
  },
);
PaginationNext.displayName = 'PaginationNext';

export function PaginationEllipsis() {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 items-center justify-center text-[var(--color-muted)]"
    >
      …
    </span>
  );
}
