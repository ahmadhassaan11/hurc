import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// Register the `toHaveNoViolations` matcher from vitest-axe.
expect.extend(axeMatchers);

// React Testing Library does not auto-cleanup when Vitest's `globals` is
// false; without this each test would leak DOM into the next.
afterEach(() => {
  cleanup();
});
