import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Input } from '../../src/primitives/input';

describe('Input', () => {
  it('renders a text input by default', () => {
    render(<Input aria-label="email" />);
    const input = screen.getByLabelText('email') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('accepts a non-default type', () => {
    render(<Input aria-label="pwd" type="password" />);
    expect((screen.getByLabelText('pwd') as HTMLInputElement).type).toBe('password');
  });

  it('applies the error state class', () => {
    render(<Input aria-label="x" state="error" />);
    expect(screen.getByLabelText('x').className).toMatch(/border-\[var\(--color-accent\)\]/);
  });

  it('accepts user typing', async () => {
    render(<Input aria-label="hello" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('hello'), 'hi');
    expect((screen.getByLabelText('hello') as HTMLInputElement).value).toBe('hi');
  });

  it('passes axe', async () => {
    const { container } = render(<Input aria-label="ok" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
