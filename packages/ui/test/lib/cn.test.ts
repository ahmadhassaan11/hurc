import { describe, expect, it } from 'vitest';

import { cn } from '../../src/lib/cn';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    expect(cn('a', undefined, false && 'b', null, 'c')).toBe('a c');
  });

  it('resolves Tailwind utility conflicts (last wins)', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('keeps non-conflicting classes', () => {
    expect(cn('flex', 'items-center', 'gap-2')).toBe('flex items-center gap-2');
  });

  it('handles object syntax via clsx', () => {
    expect(cn({ active: true, hidden: false })).toBe('active');
  });
});
