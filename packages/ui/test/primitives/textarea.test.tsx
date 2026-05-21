import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Textarea } from '../../src/primitives/textarea';

describe('Textarea', () => {
  it('renders a textarea', () => {
    render(<Textarea aria-label="bio" />);
    expect((screen.getByLabelText('bio') as HTMLTextAreaElement).tagName).toBe('TEXTAREA');
  });

  it('passes axe', async () => {
    const { container } = render(<Textarea aria-label="ok" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
