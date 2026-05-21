import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { RadioGroup, RadioGroupItem } from '../../src/primitives/radio-group';

describe('RadioGroup', () => {
  it('renders items with role=radio inside role=radiogroup', () => {
    render(
      <RadioGroup aria-label="size">
        <RadioGroupItem value="s" aria-label="small" />
        <RadioGroupItem value="m" aria-label="medium" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toBeDefined();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('selects an item on click', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup aria-label="size" onValueChange={onValueChange}>
        <RadioGroupItem value="s" aria-label="small" />
        <RadioGroupItem value="m" aria-label="medium" />
      </RadioGroup>,
    );
    await user.click(screen.getByLabelText('medium'));
    expect(onValueChange).toHaveBeenCalledWith('m');
  });

  it('passes axe', async () => {
    const { container } = render(
      <RadioGroup aria-label="size">
        <RadioGroupItem value="s" aria-label="small" />
        <RadioGroupItem value="m" aria-label="medium" />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
