import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Toaster, toast } from '../../src/primitives/toast';

describe('Toaster', () => {
  it('renders without crashing', () => {
    const { baseElement } = render(<Toaster />);
    expect(baseElement).toBeDefined();
  });

  it('exposes the sonner toast() helper', () => {
    expect(typeof toast).toBe('function');
  });

  it('passes axe', async () => {
    const { container } = render(<Toaster />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
