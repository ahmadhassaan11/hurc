import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../src/primitives/tooltip';

function Harness() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent>Hint</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('renders the trigger', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Help' })).toBeDefined();
  });

  it('passes axe (closed state)', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
