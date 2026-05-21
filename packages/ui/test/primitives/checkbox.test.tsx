import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Checkbox } from '../../src/primitives/checkbox';

describe('Checkbox', () => {
  it('renders with role=checkbox', () => {
    render(<Checkbox aria-label="agree" />);
    expect(screen.getByRole('checkbox')).toBeDefined();
  });

  it('toggles on Space when focused', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox aria-label="agree" onCheckedChange={onCheckedChange} />);
    const cb = screen.getByRole('checkbox');
    cb.focus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('passes axe', async () => {
    const { container } = render(<Checkbox aria-label="agree" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
