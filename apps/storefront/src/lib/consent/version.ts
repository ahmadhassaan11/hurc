/**
 * The consent contract version. Bumping this re-prompts every visitor to
 * re-consent on their next page load — Klaro re-shows the modal and the
 * `hurc-consent` cookie from the prior version is treated as default-deny
 * until the visitor decides again.
 *
 * Bump this when (and only when):
 *   - a new third-party processor is added to the service catalog,
 *   - an existing processor's purpose / data-handling materially changes,
 *   - the privacy policy is updated in a way that changes what visitors
 *     consent to.
 *
 * Format: ISO date string (YYYY-MM-DD). Date semantics make the meaning
 * obvious to humans reviewing diffs ("the date the policy last changed");
 * the value is treated as an opaque equality token at runtime.
 */
export const CONSENT_VERSION = '2026-05-03';

/** First-party cookie that mirrors Klaro's decisions for server-side reads. */
export const CONSENT_COOKIE_NAME = 'hurc-consent';

/** 12 months — DSGVO-aligned upper bound for consent retention. */
export const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
