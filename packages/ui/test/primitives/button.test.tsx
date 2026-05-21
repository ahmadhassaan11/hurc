import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Button } from '../../src/primitives/button';

describe('Button', () => {
  it('renders a button element by default', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined();
  });

  it('defaults type to "button" to avoid accidental form submits', () => {
    render(<Button>Test</Button>);
    const btn = screen.getByRole('button') as HTMLButtonElement;
    expect(btn.type).toBe('button');
  });

  it('respects an explicit type prop', () => {
    render(<Button type="submit">Submit</Button>);
    expect((screen.getByRole('button') as HTMLButtonElement).type).toBe('submit');
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole('button').className).toMatch(/bg-\[var\(--color-fg\)\]/);
  });

  it('applies size variant classes', () => {
    render(<Button size="lg">Big</Button>);
    expect(screen.getByRole('button').className).toMatch(/h-14/);
  });

  it('renders the child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/path">Anchor</a>
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/path');
  });

  it('triggers onClick on Enter and Space', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Press</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not trigger onClick when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        No
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes axe', async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
