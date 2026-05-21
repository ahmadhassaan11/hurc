import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../src/primitives/dropdown-menu';

function Harness() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>One</DropdownMenuItem>
        <DropdownMenuItem>Two</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('renders the trigger', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Menu' })).toBeDefined();
  });

  it('opens on click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByText('One')).toBeDefined();
  });

  it('passes axe (closed state)', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
