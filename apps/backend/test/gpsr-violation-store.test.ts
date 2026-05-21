import { describe, expect, it } from 'vitest';

import { GpsrViolationStore } from '../src/plugins/hurc-gpsr/violation-store.service.js';

describe('GpsrViolationStore', () => {
  it('starts empty', () => {
    const store = new GpsrViolationStore();
    expect(store.size()).toBe(0);
    expect(store.list()).toEqual([]);
  });

  it('upserts by productId (last write wins)', () => {
    const store = new GpsrViolationStore();
    store.upsert({
      productId: '1',
      productName: 'Sprint Tights',
      missingFields: ['responsiblePerson'],
      detectedAt: '2026-05-01T00:00:00.000Z',
    });
    store.upsert({
      productId: '1',
      productName: 'Sprint Tights v2',
      missingFields: ['responsiblePerson', 'manufacturerInfo'],
      detectedAt: '2026-05-02T00:00:00.000Z',
    });
    expect(store.size()).toBe(1);
    expect(store.list()[0]?.missingFields).toEqual(['responsiblePerson', 'manufacturerInfo']);
  });

  it('clear() removes by productId', () => {
    const store = new GpsrViolationStore();
    store.upsert({
      productId: '1',
      productName: 'A',
      missingFields: ['x'],
      detectedAt: '2026-05-01T00:00:00.000Z',
    });
    store.clear('1');
    expect(store.size()).toBe(0);
  });

  it('list() orders most-recent first', () => {
    const store = new GpsrViolationStore();
    store.upsert({
      productId: '1',
      productName: 'A',
      missingFields: ['x'],
      detectedAt: '2026-05-01T00:00:00.000Z',
    });
    store.upsert({
      productId: '2',
      productName: 'B',
      missingFields: ['x'],
      detectedAt: '2026-05-03T00:00:00.000Z',
    });
    store.upsert({
      productId: '3',
      productName: 'C',
      missingFields: ['x'],
      detectedAt: '2026-05-02T00:00:00.000Z',
    });
    const ids = store.list().map((v) => v.productId);
    expect(ids).toEqual(['2', '3', '1']);
  });
});
