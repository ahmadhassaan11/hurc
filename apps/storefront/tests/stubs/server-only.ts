// Stub for `server-only` in Vitest — the published package throws on import
// from any non-RSC bundle, which Vitest counts as. This shim keeps server-
// only modules importable in unit tests.
export {};
