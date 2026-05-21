/**
 * Vendure shop-api `ErrorCode` enum → `next-intl` translation key map.
 * Every value of the enum (verified against
 * `packages/graphql/src/schema-snapshots/shop-api.graphql`) is covered;
 * the `errors.vendure.*` namespace in every locale must keep these
 * keys in sync.
 *
 * `messages-shape.test.ts` enforces all six locales have identical
 * key sets, so a key drift here is caught in CI.
 */

export const VENDURE_ERROR_CODES = [
  'UNKNOWN_ERROR',
  'NATIVE_AUTH_STRATEGY_ERROR',
  'INVALID_CREDENTIALS_ERROR',
  'ORDER_STATE_TRANSITION_ERROR',
  'EMAIL_ADDRESS_CONFLICT_ERROR',
  'GUEST_CHECKOUT_ERROR',
  'ORDER_LIMIT_ERROR',
  'NEGATIVE_QUANTITY_ERROR',
  'INSUFFICIENT_STOCK_ERROR',
  'COUPON_CODE_INVALID_ERROR',
  'COUPON_CODE_EXPIRED_ERROR',
  'COUPON_CODE_LIMIT_ERROR',
  'ORDER_MODIFICATION_ERROR',
  'INELIGIBLE_SHIPPING_METHOD_ERROR',
  'NO_ACTIVE_ORDER_ERROR',
  'ORDER_INTERCEPTOR_ERROR',
  'ORDER_PAYMENT_STATE_ERROR',
  'INELIGIBLE_PAYMENT_METHOD_ERROR',
  'PAYMENT_FAILED_ERROR',
  'PAYMENT_DECLINED_ERROR',
  'ALREADY_LOGGED_IN_ERROR',
  'MISSING_PASSWORD_ERROR',
  'PASSWORD_VALIDATION_ERROR',
  'PASSWORD_ALREADY_SET_ERROR',
  'VERIFICATION_TOKEN_INVALID_ERROR',
  'VERIFICATION_TOKEN_EXPIRED_ERROR',
  'IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR',
  'IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR',
  'PASSWORD_RESET_TOKEN_INVALID_ERROR',
  'PASSWORD_RESET_TOKEN_EXPIRED_ERROR',
  'NOT_VERIFIED_ERROR',
  'MOLLIE_PAYMENT_INTENT_ERROR',
] as const;

export type VendureErrorCode = (typeof VENDURE_ERROR_CODES)[number];

/**
 * Type guard against the union. Useful when narrowing an `errorCode`
 * field on a Vendure `ErrorResult` payload.
 */
export function isVendureErrorCode(value: unknown): value is VendureErrorCode {
  return typeof value === 'string' && VENDURE_ERROR_CODES.includes(value as VendureErrorCode);
}

/**
 * The next-intl key for a given error code. Always rooted at
 * `errors.vendure.<CODE>`. The caller passes the result to `t(...)`.
 */
export function vendureErrorMessageKey(code: string): string {
  if (isVendureErrorCode(code)) {
    return `errors.vendure.${code}`;
  }
  return 'errors.vendure.UNKNOWN_ERROR';
}
