'use client';

import { useTranslations } from 'next-intl';
import { type ReactNode, useMemo, useState } from 'react';

import { ColorSwatch } from './ColorSwatch';
import { SizeChip } from './SizeChip';

export type ProductOption = {
  id: string;
  code: string;
  name: string;
  groupId: string;
};

export type ProductOptionGroup = {
  id: string;
  code: string;
  name: string;
  options: ProductOption[];
};

export type ProductVariantSummary = {
  id: string;
  options: { id: string; groupId: string }[];
  stockLevel: string;
};

type Props = {
  optionGroups: ProductOptionGroup[];
  variants: ProductVariantSummary[];
  /** Render-prop: receives the currently-resolved variant (if any). */
  children: (selected: ProductVariantSummary | undefined) => ReactNode;
};

const COLOR_MAP: Record<string, string> = {
  black: '#0a0a0a',
  white: '#ffffff',
  red: '#e63946',
  navy: '#1a2447',
  forest: '#1e3a2f',
  charcoal: '#2a2a2a',
  bone: '#e8e0d4',
  sand: '#c9b89c',
  burgundy: '#6e1f2c',
  olive: '#4a5b3b',
};

function colorFor(option: ProductOption): string {
  const key = option.code.toLowerCase();
  return COLOR_MAP[key] ?? COLOR_MAP[option.name.toLowerCase()] ?? 'var(--color-surface-700)';
}

function isColorGroup(group: ProductOptionGroup): boolean {
  return /color|colour/i.test(group.code) || /color|colour/i.test(group.name);
}

export function VariantPicker({ optionGroups, variants, children }: Props) {
  const t = useTranslations('commerce.pdp');

  // Preselect: pick the first in-stock variant's option set.
  const initialSelection = useMemo(() => {
    const inStock = variants.find((v) => v.stockLevel !== 'OUT_OF_STOCK');
    const target = inStock ?? variants[0];
    if (target === undefined) return {} as Record<string, string>;
    return Object.fromEntries(target.options.map((o) => [o.groupId, o.id]));
  }, [variants]);

  const [selection, setSelection] = useState<Record<string, string>>(initialSelection);

  const availability = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const group of optionGroups) {
      for (const option of group.options) {
        const otherGroups = optionGroups.filter((g) => g.id !== group.id);
        const matching = variants.find((v) => {
          if (v.stockLevel === 'OUT_OF_STOCK') return false;
          if (!v.options.some((o) => o.id === option.id)) return false;
          for (const og of otherGroups) {
            const sel = selection[og.id];
            if (sel === undefined) continue;
            if (!v.options.some((o) => o.id === sel)) return false;
          }
          return true;
        });
        map.set(option.id, matching !== undefined);
      }
    }
    return map;
  }, [optionGroups, variants, selection]);

  const selected = useMemo(() => {
    if (Object.keys(selection).length !== optionGroups.length) return undefined;
    return variants.find((v) => v.options.every((o) => selection[o.groupId] === o.id));
  }, [optionGroups, variants, selection]);

  function pick(groupId: string, optionId: string): void {
    setSelection((prev) => ({ ...prev, [groupId]: optionId }));
  }

  return (
    <div className="flex flex-col gap-6">
      {optionGroups.map((group) => {
        const isColor = isColorGroup(group);
        return (
          <div key={group.id} className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
              {group.name}
              {selection[group.id] !== undefined ? (
                <span className="ml-2 text-[var(--color-fg)]">
                  {group.options.find((o) => o.id === selection[group.id])?.name}
                </span>
              ) : null}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const isSelected = selection[group.id] === option.id;
                const available = availability.get(option.id) ?? false;
                if (isColor) {
                  return (
                    <ColorSwatch
                      key={option.id}
                      color={colorFor(option)}
                      name={option.name}
                      selected={isSelected}
                      outOfStock={!available}
                      onClick={() => {
                        if (available) pick(group.id, option.id);
                      }}
                    />
                  );
                }
                return (
                  <SizeChip
                    key={option.id}
                    label={option.name}
                    selected={isSelected}
                    outOfStock={!available}
                    onClick={() => {
                      if (available) pick(group.id, option.id);
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {selected === undefined ? (
        <p
          aria-live="polite"
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]"
        >
          {t('selectAllOptions')}
        </p>
      ) : null}

      {children(selected)}
    </div>
  );
}
