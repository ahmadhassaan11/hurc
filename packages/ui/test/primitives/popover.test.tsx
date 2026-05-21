import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Popover, PopoverContent, PopoverTrigger } from '../../src/primitives/popover';

function Harness() {
  return (
    <Popover>
      <PopoverTrigger>Open popover</PopoverTrigger>
      <PopoverContent>Body</PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('renders the trigger', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Open popover' })).toBeDefined();
  });

  it('opens on click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    expect(screen.getByText('Body')).toBeDefined();
  });

  it('passes axe (closed state)', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
