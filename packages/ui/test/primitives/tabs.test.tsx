import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/primitives/tabs';

function Harness() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Product tabs">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview body</TabsContent>
      <TabsContent value="details">Details body</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders the tablist with both triggers', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'Product tabs' })).toBeDefined();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('shows the default panel', () => {
    render(<Harness />);
    expect(screen.getByText('Overview body')).toBeDefined();
  });

  it('switches panels on tab click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('tab', { name: 'Details' }));
    expect(screen.getByText('Details body')).toBeDefined();
  });

  it('passes axe', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
