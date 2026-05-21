import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '../../src/primitives/sheet';

function Harness() {
  return (
    <Sheet>
      <SheetTrigger>Open cart</SheetTrigger>
      <SheetContent side="right">
        <SheetTitle>Cart</SheetTitle>
        <SheetDescription>Items in your bag</SheetDescription>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('renders the trigger', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Open cart' })).toBeDefined();
  });

  it('opens on click and renders dialog content', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Open cart' }));
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Cart')).toBeDefined();
  });

  it('passes axe (closed state)', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
