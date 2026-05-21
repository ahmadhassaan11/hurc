import { describe, expect, it } from 'vitest';

import { tags } from '../../src/lib/vendure/revalidation';

describe('cache tag helpers', () => {
  it('produces stable, namespaced strings', () => {
    expect(tags.product('meridian-jacket')).toBe('product:meridian-jacket');
    expect(tags.collection('all-tops')).toBe('collection:all-tops');
    expect(tags.productList('eu-channel-token')).toBe('productList:eu-channel-token');
    expect(tags.collectionList('eu-channel-token')).toBe('collectionList:eu-channel-token');
    expect(tags.cart('session-abc')).toBe('cart:session-abc');
    expect(tags.customer('123')).toBe('customer:123');
    expect(tags.channel('eu-channel-token')).toBe('channel:eu-channel-token');
    expect(tags.journal('training-week-1')).toBe('journal:training-week-1');
    expect(tags.journalList()).toBe('journal');
    expect(tags.page('story')).toBe('page:story');
    expect(tags.homepage()).toBe('homepage');
    expect(tags.activity('run')).toBe('activity:run');
  });

  it('keeps tags string-typed for revalidateTag', () => {
    const tag: string = tags.product('x');
    expect(typeof tag).toBe('string');
  });
});
