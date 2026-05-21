import { describe, expect, it } from 'vitest';

import { payloadToTags } from './payload-mapper.js';

describe('payloadToTags', () => {
  it('returns an empty list when _type is missing', () => {
    expect(payloadToTags({})).toEqual([]);
  });

  it('maps a journalPost with object-shape slug to journal:<slug> + journal', () => {
    expect(
      payloadToTags({
        _type: 'journalPost',
        slug: { current: 'training-week-1' },
      }),
    ).toEqual(['journal:training-week-1', 'journal']);
  });

  it('maps a journalPost with string-shape slug too', () => {
    expect(payloadToTags({ _type: 'journalPost', slug: 'training-week-1' })).toEqual([
      'journal:training-week-1',
      'journal',
    ]);
  });

  it('falls back to the type name when there is no slug', () => {
    expect(payloadToTags({ _type: 'siteSettings' })).toEqual(['siteSettings']);
  });

  it('maps a product with slug to product:<slug> + product', () => {
    expect(payloadToTags({ _type: 'product', slug: { current: 'hurc-run-tee' } })).toEqual([
      'product:hurc-run-tee',
      'product',
    ]);
  });

  it('maps a page document with slug to page:<slug> + page', () => {
    expect(payloadToTags({ _type: 'page', slug: { current: 'story' } })).toEqual([
      'page:story',
      'page',
    ]);
  });

  it('maps a page document without a slug to bare page', () => {
    expect(payloadToTags({ _type: 'page' })).toEqual(['page']);
  });

  it('maps an activity document to activity:<slug> + activity', () => {
    expect(payloadToTags({ _type: 'activity', slug: { current: 'run' } })).toEqual([
      'activity:run',
      'activity',
    ]);
  });

  it('maps the homepage singleton to bare homepage', () => {
    expect(payloadToTags({ _type: 'homepage' })).toEqual(['homepage']);
  });
});
