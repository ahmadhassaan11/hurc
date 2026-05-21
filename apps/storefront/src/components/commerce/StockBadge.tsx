import { Badge } from '@hurc/ui';
import { useTranslations } from 'next-intl';

import { type StockLevel } from './stock-level';

type Props = {
  level: StockLevel;
};

/**
 * Maps a Vendure-derived stock level (we collapse `stockLevel` strings
 * into one of three buckets at the call site) to a translated badge.
 */
export function StockBadge({ level }: Props) {
  const t = useTranslations('commerce.stock');

  if (level === 'IN_STOCK') {
    return <Badge intent="success">{t('inStock')}</Badge>;
  }
  if (level === 'LOW_STOCK') {
    return <Badge intent="warning">{t('lowStock')}</Badge>;
  }
  return <Badge intent="destructive">{t('outOfStock')}</Badge>;
}

export { deriveStockLevel } from './stock-level';
