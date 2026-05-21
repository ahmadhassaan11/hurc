import { ChevronRight } from '@hurc/ui/icons';
import { Fragment } from 'react';

import { Link } from '@/i18n/navigation';

type Crumb = {
  name: string;
  href?: string;
};

type Props = {
  trail: Crumb[];
};

export function BreadcrumbTrail({ trail }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]"
    >
      <ol className="flex items-center gap-2">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <Fragment key={`${crumb.name}-${index}`}>
              <li>
                {isLast || crumb.href === undefined ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className="text-[var(--color-fg)]"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-[var(--color-fg)]"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
              {!isLast ? (
                <ChevronRight aria-hidden className="h-3 w-3 text-[var(--color-line)]" />
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
