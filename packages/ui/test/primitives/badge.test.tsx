import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Badge } from '../../src/primitives/badge';

describe('Badge', () => {
  it('renders content', () => {
    render(<Badge>NEW</Badge>);
    expect(screen.getByText('NEW')).toBeDefined();
  });

  it('applies destructive intent classes', () => {
    render(<Badge intent="destructive">Out of stock</Badge>);
    expect(screen.getByText('Out of stock').className).toMatch(/text-\[var\(--color-accent\)\]/);
  });

  it('passes axe', async () => {
    const { container } = render(<Badge>OK</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
