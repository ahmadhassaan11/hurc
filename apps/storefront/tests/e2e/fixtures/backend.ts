/**
 * Backend reachability fixture. Specs that depend on a live Vendure
 * shop-api skip cleanly when the backend is not responding.
 *
 * Per ADR-0010 decision 7, default-PR CI does not run a live backend, so
 * `checkout-consent` and `gdpr-self-service` open with a `test.skip(...)`
 * guarded on `isBackendReachable()`. The probe runs once in the
 * Playwright global-setup and the result is plumbed via env var.
 */
export function isBackendReachable(): boolean {
  return process.env.E2E_BACKEND_REACHABLE === '1';
}
