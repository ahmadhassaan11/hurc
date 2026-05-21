import {
  Children,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
} from 'react';

import { cn } from '../lib/cn';
import { Label } from './label';

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  /** The visible label for the control. */
  label: ReactNode;
  /** Helper / hint shown below the control. */
  helper?: ReactNode;
  /** Error message; takes precedence over `helper` when set. */
  error?: ReactNode;
  /** Whether the field is required. Adds the visual marker only. */
  required?: boolean;
  /** The control element. Receives `id`, `aria-describedby`, `aria-invalid`. */
  children: ReactElement<{
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
  }>;
};

/**
 * Composition primitive: pairs a label, control, and helper/error text
 * with the right ARIA wiring. The single child element is cloned with
 * `id`, `aria-describedby`, and `aria-invalid` so consumers do not have
 * to thread IDs by hand.
 */
export function Field({
  label,
  helper,
  error,
  required,
  className,
  children,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const helperId = `${generatedId}-helper`;
  const errorId = `${generatedId}-error`;

  const child = Children.only(children);
  const controlId = child.props.id ?? generatedId;

  const describedBy = error !== undefined ? errorId : helper !== undefined ? helperId : undefined;

  const enhancedChild = isValidElement(child)
    ? cloneElement(child, {
        id: controlId,
        ...(describedBy !== undefined ? { 'aria-describedby': describedBy } : {}),
        ...(error !== undefined ? { 'aria-invalid': true as const } : {}),
      })
    : child;

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <Label htmlFor={controlId}>
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-[var(--color-accent)]">
            *
          </span>
        ) : null}
      </Label>
      {enhancedChild}
      {error !== undefined ? (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-accent)]">
          {error}
        </p>
      ) : helper !== undefined ? (
        <p id={helperId} className="text-xs text-[var(--color-muted)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
Field.displayName = 'Field';
