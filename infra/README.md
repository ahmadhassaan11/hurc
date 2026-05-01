# Infrastructure

Phase 1 stub. Phase 10 fills this directory with:

- `docker/docker-compose.yml` — local dev stack (Postgres 16, Redis 7,
  Meilisearch v1, MailHog).
- `docker/docker-compose.prod.yml` — Hetzner production stack.
- `caddy/Caddyfile` — reverse proxy with auto Let's Encrypt for `api.hurc.com`,
  `admin.hurc.com`, `assets.hurc.com`.
- `scripts/bootstrap-hetzner.sh` — one-shot CX22 provisioning.
- `scripts/backup-postgres.sh`, `scripts/restore-postgres.sh` — pg_dump to
  Cloudflare R2 with 30-day retention.
- `scripts/deploy.sh` — invoked by GitHub Actions to roll out new images.

A canonical env reference lives at `infra/env.reference.md` (created in
Phase 2).
