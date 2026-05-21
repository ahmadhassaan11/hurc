import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Compose Tailwind class strings with conflict resolution.
 *
 * `clsx` flattens conditionals; `tailwind-merge` keeps the last
 * conflicting utility (e.g. `cn('p-4', 'p-6')` → `'p-6'`). Used by every
 * primitive to merge variant defaults with consumer-supplied `className`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
