/**
 * Primary nav items shared by Header (desktop) and MobileNav. Phase 6.3
 * may wire `collectionTreeNav` from Vendure to drive the Activities
 * dropdown contents; for Phase 6.1 the activity slugs are hard-coded
 * to match the home page's ActivityGrid.
 */

export type NavItem = {
  key: 'run' | 'train' | 'yoga' | 'studio' | 'collections' | 'editorial' | 'sale';
  href: string;
};

export const primaryNav: NavItem[] = [
  { key: 'run', href: '/run' },
  { key: 'train', href: '/train' },
  { key: 'yoga', href: '/yoga' },
  { key: 'studio', href: '/studio' },
  { key: 'collections', href: '/run' },
  { key: 'editorial', href: '/journal' },
  { key: 'sale', href: '/sale' },
];
