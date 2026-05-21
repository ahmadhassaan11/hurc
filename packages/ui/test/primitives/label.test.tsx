import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Label } from '../../src/primitives/label';

describe('Label', () => {
  it('renders the label text', () => {
    render(<Label htmlFor="x">Email</Label>);
    expect(screen.getByText('Email')).toBeDefined();
  });

  it('connects to a control via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email-input">Email</Label>
        <input id="email-input" />
      </>,
    );
    expect(screen.getByLabelText('Email')).toBeDefined();
  });

  it('passes axe', async () => {
    const { container } = render(
      <>
        <Label htmlFor="x">Name</Label>
        <input id="x" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
