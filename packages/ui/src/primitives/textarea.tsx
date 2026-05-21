import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../lib/cn';
import { cva, type VariantProps } from '../lib/cva';

export const textareaVariants = cva(
  'min-h-[120px] w-full bg-transparent p-4 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-ink-300)] transition-colors focus-visible:outline-none focus-visible:border-[var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-50',
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

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, ...props }, ref) => {
    return <textarea ref={ref} className={cn(textareaVariants({ state }), className)} {...props} />;
  },
);
Textarea.displayName = 'Textarea';
