import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Switch } from '../../src/primitives/switch';

describe('Switch', () => {
  it('renders with role=switch', () => {
    render(<Switch aria-label="newsletter" />);
    expect(screen.getByRole('switch')).toBeDefined();
  });

  it('toggles on click', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch aria-label="newsletter" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('passes axe', async () => {
    const { container } = render(<Switch aria-label="newsletter" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
