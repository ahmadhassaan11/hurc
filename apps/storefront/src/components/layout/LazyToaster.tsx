'use client';

/**
 * Shim for `next/dynamic` lazy-loading. Direct
 * `dynamic(() => import('@hurc/ui').then(m => ({ default: m.Toaster })))`
 * fails under Webpack ("Package path . is not exported from package
 * @hurc/ui") because the `.then` form requires the package's `.` export
 * to resolve through the dynamic-import path, which it doesn't on every
 * build target. Going through a local file with a `default` export
 * sidesteps the issue and keeps the same lazy-load benefit.
 */
export { Toaster as default } from '@hurc/ui';
