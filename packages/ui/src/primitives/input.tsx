import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../lib/cn';
import { cva, type VariantProps } from '../lib/cva';

export const inputVariants = cva(
  'h-12 w-full bg-transparent px-4 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-ink-300)] transition-colors focus-visible:outline-none focus-visible:border-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border border-[var(--color-line)]',
        error: 'border border-[var(--color-accent)]',
      },
    },
    defaultVariants: { state: 'default' },
  },
);

export type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type ?? 'text'}
        className={cn(inputVariants({ state }), className)}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
