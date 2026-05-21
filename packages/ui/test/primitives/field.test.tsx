import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Field } from '../../src/primitives/field';
import { Input } from '../../src/primitives/input';

describe('Field', () => {
  it('renders the label and connects it to the control via id', () => {
    render(
      <Field label="Email" helper="we never share this">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input.id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('shows error and sets aria-invalid + role=alert', () => {
    render(
      <Field label="Email" error="required">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe('required');
  });

  it('shows the required marker when required', () => {
    render(
      <Field label="Email" required>
        <Input />
      </Field>,
    );
    expect(screen.getByText('*')).toBeDefined();
  });

  it('preserves a consumer-supplied control id', () => {
    render(
      <Field label="Email">
        <Input id="my-id" />
      </Field>,
    );
    expect(screen.getByLabelText('Email').id).toBe('my-id');
  });

  it('passes axe', async () => {
    const { container } = render(
      <Field label="Email" helper="we never share this">
        <Input />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
