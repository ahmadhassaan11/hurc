import * as LabelPrimitive from '@radix-ui/react-label';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import { cn } from '../lib/cn';

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

export const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          'text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Label.displayName = 'Label';
