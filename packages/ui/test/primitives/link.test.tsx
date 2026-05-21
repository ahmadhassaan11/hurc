import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Link } from '../../src/primitives/link';

describe('Link', () => {
  it('renders an anchor', () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole('link', { name: 'About' })).toBeDefined();
  });

  it('applies the accent intent', () => {
    render(
      <Link href="/" intent="accent">
        Accent
      </Link>,
    );
    expect(screen.getByRole('link').className).toMatch(/text-\[var\(--color-accent\)\]/);
  });

  it('applies underline always when requested', () => {
    render(
      <Link href="/" underline="always">
        Always
      </Link>,
    );
    expect(screen.getByRole('link').className).toMatch(/underline/);
  });

  it('passes axe', async () => {
    const { container } = render(<Link href="/x">Reachable</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
