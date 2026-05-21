import { describe, expect, it } from 'vitest';

import { assetUrl, imageSizes } from '../../src/lib/asset';

const sample = {
  source: 'https://assets.hurc.com/products/jacket/main.jpg',
  preview: 'https://assets.hurc.com/products/jacket/main.jpg?preview=1',
  width: 1600,
  height: 2400,
};

describe('assetUrl', () => {
  it('returns the preview URL when no transform is requested', () => {
    expect(assetUrl(sample)).toBe('https://assets.hurc.com/products/jacket/main.jpg?preview=1');
  });

  it('falls back to source when preview is null', () => {
    expect(assetUrl({ ...sample, preview: null })).toBe(
      'https://assets.hurc.com/products/jacket/main.jpg',
    );
  });

  it('appends Bunny transform query params', () => {
    const url = assetUrl(
      { source: 'https://assets.hurc.com/x.jpg', preview: null, width: 0, height: 0 },
      { width: 800, quality: 80 },
    );
    expect(url).toBe('https://assets.hurc.com/x.jpg?width=800&quality=80');
  });

  it('joins existing query strings with &', () => {
    const url = assetUrl(
      { source: 'https://assets.hurc.com/x.jpg?v=2', preview: null, width: 0, height: 0 },
      { width: 800 },
    );
    expect(url).toBe('https://assets.hurc.com/x.jpg?v=2&width=800');
  });

  it('omits format=auto', () => {
    const url = assetUrl(
      { source: 'https://x/img.jpg', preview: null, width: 0, height: 0 },
      { width: 100, format: 'auto' },
    );
    expect(url).not.toContain('format');
  });

  it('returns empty string when both preview and source are empty', () => {
    expect(assetUrl({ source: '', preview: '', width: null, height: null })).toBe('');
  });
});

describe('imageSizes', () => {
  it('produces an ordered media-query string', () => {
    const sizes = imageSizes({ default: '100vw', md: '50vw', lg: '33vw' });
    expect(sizes).toBe('(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw');
  });

  it('falls back to the default-only string when no breakpoints', () => {
    expect(imageSizes({ default: '100vw' })).toBe('100vw');
  });
});
