import { describe, expect, it } from 'vitest';

import {
  isVendureErrorCode,
  VENDURE_ERROR_CODES,
  vendureErrorMessageKey,
} from '../../src/lib/vendure/error-messages';

describe('isVendureErrorCode', () => {
  it('returns true for every documented enum value', () => {
    for (const code of VENDURE_ERROR_CODES) {
      expect(isVendureErrorCode(code)).toBe(true);
    }
  });

  it('rejects unknown strings', () => {
    expect(isVendureErrorCode('NOT_A_CODE')).toBe(false);
    expect(isVendureErrorCode('')).toBe(false);
  });

  it('rejects non-strings', () => {
    expect(isVendureErrorCode(undefined)).toBe(false);
    expect(isVendureErrorCode(null)).toBe(false);
    expect(isVendureErrorCode(42)).toBe(false);
  });
});

describe('vendureErrorMessageKey', () => {
  it('rooted at errors.vendure.<CODE>', () => {
    expect(vendureErrorMessageKey('PAYMENT_FAILED_ERROR')).toBe(
      'errors.vendure.PAYMENT_FAILED_ERROR',
    );
  });

  it('falls back to UNKNOWN_ERROR on unrecognised input', () => {
    expect(vendureErrorMessageKey('GIBBERISH')).toBe('errors.vendure.UNKNOWN_ERROR');
  });
});
