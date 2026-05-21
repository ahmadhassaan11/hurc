'use client';

import { cn } from '@hurc/ui';
import Image from 'next/image';
import { useState } from 'react';

import { assetUrl, imageSizes } from '@/lib/asset';

export type GalleryAsset = {
  id: string;
  source: string;
  preview?: string | null;
  width?: number | null;
  height?: number | null;
  name?: string | null;
};

type Props = {
  /**
   * Always rendered with the first asset prominent. Variant changes can
   * pass a single-item array containing the new variant's featured asset
   * to focus the gallery on it.
   */
  assets: GalleryAsset[];
  productName: string;
};

export function ProductGallery({ assets, productName }: Props) {
  const [activeId, setActiveId] = useState<string | undefined>(assets[0]?.id);
  const active = assets.find((a) => a.id === activeId) ?? assets[0];

  if (active === undefined) {
    return (
      <div
        aria-hidden
        className="aspect-[3/4] w-full bg-gradient-to-b from-[var(--color-surface-700)] to-[var(--color-surface-900)]"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse">
      <div className="relative aspect-[3/4] flex-1 overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface-800)]">
        <Image
          key={active.id}
          src={assetUrl(active, { width: 1400, quality: 90 })}
          alt={`${productName} — ${active.name ?? ''}`.trim()}
          fill
          sizes={imageSizes({ default: '100vw', md: '50vw', lg: '40vw' })}
          priority
          className="object-cover"
        />
      </div>

      {assets.length > 1 ? (
        <ul
          aria-label={`${productName} thumbnails`}
          className="flex max-h-[60vh] gap-3 overflow-x-auto md:max-h-none md:flex-col md:overflow-y-auto md:overflow-x-hidden"
        >
          {assets.map((asset) => (
            <li key={asset.id} className="shrink-0">
              <button
                type="button"
                aria-label={asset.name ?? `${productName} thumbnail`}
                aria-current={asset.id === active.id ? 'true' : undefined}
                onClick={() => {
                  setActiveId(asset.id);
                }}
                className={cn(
                  'relative aspect-[3/4] h-20 w-16 overflow-hidden border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] md:h-24 md:w-20',
                  asset.id === active.id
                    ? 'border-[var(--color-fg)]'
                    : 'border-[var(--color-line)] hover:border-[var(--color-muted)]',
                )}
              >
                <Image
                  src={assetUrl(asset, { width: 200, quality: 80 })}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
