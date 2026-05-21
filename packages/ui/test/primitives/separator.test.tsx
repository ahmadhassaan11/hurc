import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Separator } from '../../src/primitives/separator';

describe('Separator', () => {
  it('renders horizontal by default', () => {
    const { container } = render(<Separator data-testid="sep" />);
    const sep = container.querySelector('[data-testid="sep"]') as HTMLElement;
    expect(sep.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('respects orientation=vertical', () => {
    const { container } = render(<Separator orientation="vertical" data-testid="sep" />);
    const sep = container.querySelector('[data-testid="sep"]') as HTMLElement;
    expect(sep.getAttribute('data-orientation')).toBe('vertical');
  });

  it('passes axe', async () => {
    const { container } = render(<Separator />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
