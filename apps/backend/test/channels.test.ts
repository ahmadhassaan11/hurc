import { describe, expect, it } from 'vitest';

import { channels, channelToZone, zones } from '../src/channels.js';

describe('channels', () => {
  it('declares the three channels from the spec', () => {
    expect(channels).toHaveLength(3);
    expect(channels.map((c) => c.code).sort()).toEqual(['default', 'eu', 'uk']);
  });

  it('EU channel exposes 6 spec languages', () => {
    const eu = channels.find((c) => c.code === 'eu');
    expect(eu?.availableLanguageCodes).toEqual(['en', 'de', 'fr', 'nl', 'es', 'it']);
  });

  it('UK channel is GBP-only and English-only', () => {
    const uk = channels.find((c) => c.code === 'uk');
    expect(uk?.defaultCurrencyCode).toBe('GBP');
    expect(uk?.availableLanguageCodes).toEqual(['en']);
  });

  it('every consumer-facing channel has VAT-inclusive prices', () => {
    for (const c of channels.filter((x) => x.code !== 'default')) {
      expect(c.pricesIncludeTax).toBe(true);
    }
  });
});

describe('zones', () => {
  it('declares EU and UK zones', () => {
    expect(zones).toHaveLength(2);
    expect(zones.map((z) => z.code).sort()).toEqual(['EU', 'UK']);
  });

  it('EU zone covers all 27 member states', () => {
    expect(zones.find((z) => z.code === 'EU')?.countryCodes).toHaveLength(27);
  });

  it('UK zone is GB only', () => {
    expect(zones.find((z) => z.code === 'UK')?.countryCodes).toEqual(['GB']);
  });
});

describe('channelToZone', () => {
  it('maps eu → EU and uk → UK', () => {
    expect(channelToZone.eu).toBe('EU');
    expect(channelToZone.uk).toBe('UK');
  });

  it('default channel is unzoned', () => {
    expect(channelToZone.default).toBeNull();
  });
});
