import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../lib/cn';
import { cva, type VariantProps } from '../lib/cva';

export const skeletonVariants = cva(
  'animate-pulse bg-[var(--color-surface-700)] motion-reduce:animate-none',
  {
    variants: {
      radius: {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: { radius: 'md' },
  },
);

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, radius, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden
        className={cn(skeletonVariants({ radius }), className)}
        {...props}
      />
    );
  },
);
Skeleton.displayName = 'Skeleton';
