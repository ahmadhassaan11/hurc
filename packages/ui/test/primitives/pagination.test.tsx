import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../src/primitives/pagination';

function Harness() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1">Previous</PaginationPrevious>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" active>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=10">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3">Next</PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

describe('Pagination', () => {
  it('exposes a navigation landmark', () => {
    render(<Harness />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeDefined();
  });

  it('marks the active page with aria-current=page', () => {
    render(<Harness />);
    expect(screen.getByText('2').getAttribute('aria-current')).toBe('page');
    expect(screen.getByText('1').getAttribute('aria-current')).toBeNull();
  });

  it('passes axe', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
