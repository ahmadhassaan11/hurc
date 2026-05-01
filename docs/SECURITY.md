# Security

> Phase 1 stub. Hardened in Phase 2 (backend) and Phase 4 (storefront).

## Threat model summary

- Public-facing storefront (Vercel) and shop-api (Hetzner) are the primary
  attack surfaces.
- Admin UI on `admin.hurc.com` is restricted by Cloudflare WAF rule to
  trusted IPs (configurable; emergency bypass documented in the runbook).
- Secrets never live in the repo. Local dev uses `.env` files (gitignored);
  CI and prod read from Doppler.

## Defaults

- TLS 1.2+ everywhere. Caddy auto-provisions Let's Encrypt; Vercel manages
  storefront certs.
- HSTS preload, CSP (script-src self + analytics hosts), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`.
- Cookies: `Secure`, `HttpOnly` (where applicable), `SameSite=Lax`, signed.
- Server Actions validate every input through Zod. No untyped JSON over the
  trust boundary.
- Rate limits on every mutation Server Action (Phase 4 implementation).

## Dependency hygiene

- Renovate (or Dependabot) keeps dependencies fresh; major bumps require a
  manual PR review.
- `pnpm audit` run in CI; high-severity findings block merge.

## Responsible disclosure

Email: `security@hurc.com` (mailbox provisioned in Phase 10). Please do not
file public issues for security reports.
