'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@hurc/ui';
import { ChevronDown } from '@hurc/ui/icons';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';

import { DEFAULT_SORT, SORT_VALUES, type SortValue } from './sort';

type Props = {
  current: SortValue;
  /**
   * Search params other than `sort` that should be preserved when the
   * route changes. Passed in from the page so the client island doesn't
   * have to read `useSearchParams()` and re-merge.
   */
  preservedQuery: Record<string, string | undefined>;
};

function buildHref(
  pathname: string,
  preserved: Record<string, string | undefined>,
  next: SortValue,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(preserved)) {
    if (value !== undefined && key !== 'sort' && key !== 'page') {
      params.set(key, value);
    }
  }
  if (next !== DEFAULT_SORT) params.set('sort', next);
  // Reset to page 1 when sort changes — the previous offset is stale.
  const query = params.toString();
  return query === '' ? pathname : `${pathname}?${query}`;
}

export function ProductSort({ current, preservedQuery }: Props) {
  const t = useTranslations('commerce.sort');
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const onSelect = (next: SortValue) => {
    if (next === current) return;
    startTransition(() => {
      router.replace(buildHref(pathname, preservedQuery, next));
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('label')}
        disabled={pending}
        className="inline-flex h-10 items-center gap-2 border border-[var(--color-line)] px-4 text-xs uppercase tracking-[0.2em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        <span>{t(`option.${current}`)}</span>
        <ChevronDown className="h-3 w-3" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SORT_VALUES.map((value) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => {
              onSelect(value);
            }}
            data-active={value === current ? 'true' : undefined}
            className="data-[active=true]:text-[var(--color-fg)]"
          >
            {t(`option.${value}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
