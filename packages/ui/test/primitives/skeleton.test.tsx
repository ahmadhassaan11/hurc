import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Skeleton } from '../../src/primitives/skeleton';

describe('Skeleton', () => {
  it('renders a div with aria-hidden', () => {
    const { container } = render(<Skeleton data-testid="sk" />);
    const node = container.querySelector('[data-testid="sk"]');
    expect(node?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies radius variants', () => {
    const { container } = render(<Skeleton radius="full" data-testid="sk" />);
    expect(container.querySelector('[data-testid="sk"]')?.className).toMatch(/rounded-full/);
  });

  it('passes axe', async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
