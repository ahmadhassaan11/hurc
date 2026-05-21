import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import { cn } from '../lib/cn';

export type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;

export const Separator = forwardRef<ElementRef<typeof SeparatorPrimitive.Root>, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        orientation={orientation}
        decorative={decorative}
        className={cn(
          'shrink-0 bg-[var(--color-line)]',
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Separator';
