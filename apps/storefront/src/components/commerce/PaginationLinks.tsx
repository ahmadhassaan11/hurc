import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@hurc/ui';
import { useTranslations } from 'next-intl';

type Props = {
  currentPage: number;
  totalPages: number;
  /**
   * Build the href for a given page number. Receiving the builder lets
   * the caller preserve all other search params without this island
   * needing to read them.
   */
  hrefForPage: (page: number) => string;
};

/**
 * Compute up to seven page-number "slots" plus ellipses for the
 * pagination control. Strategy: always show first page, last page,
 * current page ± 1; everything else collapses into "…".
 */
function buildPages(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const slots: (number | 'ellipsis')[] = [1];
  const window = [currentPage - 1, currentPage, currentPage + 1].filter(
    (p) => p > 1 && p < totalPages,
  );

  if (window[0] !== undefined && window[0] > 2) slots.push('ellipsis');
  for (const p of window) slots.push(p);
  const last = window[window.length - 1];
  if (last !== undefined && last < totalPages - 1) {
    slots.push('ellipsis');
  }

  slots.push(totalPages);
  return slots;
}

export function PaginationLinks({ currentPage, totalPages, hrefForPage }: Props) {
  const t = useTranslations('commerce.pagination');

  if (totalPages <= 1) return null;

  const slots = buildPages(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hasPrev ? hrefForPage(currentPage - 1) : undefined}
            aria-disabled={!hasPrev}
          >
            {t('previous')}
          </PaginationPrevious>
        </PaginationItem>

        {slots.map((slot, idx) => (
          <PaginationItem key={slot === 'ellipsis' ? `ellipsis-${idx}` : slot}>
            {slot === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={hrefForPage(slot)} active={slot === currentPage}>
                {slot}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={hasNext ? hrefForPage(currentPage + 1) : undefined}
            aria-disabled={!hasNext}
          >
            {t('next')}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
