import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../src/primitives/select';

function Harness() {
  return (
    <Select>
      <SelectTrigger aria-label="size">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="s">Small</SelectItem>
        <SelectItem value="m">Medium</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders the trigger button', () => {
    render(<Harness />);
    expect(screen.getByRole('combobox', { name: 'size' })).toBeDefined();
  });

  it('passes axe (closed state)', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
