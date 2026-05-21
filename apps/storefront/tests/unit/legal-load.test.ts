import { afterEach, describe, expect, it, vi } from 'vitest';

import { loadLegalOverlay } from '../../src/lib/legal/load';

const loadPageMock = vi.hoisted(() => vi.fn());

vi.mock('@/lib/sanity/queries', () => ({
  loadPage: loadPageMock,
}));

describe('loadLegalOverlay', () => {
  afterEach(() => {
    loadPageMock.mockReset();
  });

  it('queries Sanity with the prefixed slug', async () => {
    loadPageMock.mockResolvedValueOnce({ _id: 'p_1', title: 'Imprint', slug: 'legal-imprint' });
    await loadLegalOverlay('imprint', 'de');
    expect(loadPageMock).toHaveBeenCalledTimes(1);
    expect(loadPageMock).toHaveBeenCalledWith('legal-imprint', 'de');
  });

  it('returns null when the document does not exist', async () => {
    loadPageMock.mockResolvedValueOnce(null);
    const result = await loadLegalOverlay('terms', 'fr');
    expect(result).toBeNull();
  });

  it('returns the Sanity payload as-is when present', async () => {
    const doc = { _id: 'p_2', title: 'Privacy', slug: 'legal-privacy' };
    loadPageMock.mockResolvedValueOnce(doc);
    const result = await loadLegalOverlay('privacy', 'en');
    expect(result).toBe(doc);
  });
});
