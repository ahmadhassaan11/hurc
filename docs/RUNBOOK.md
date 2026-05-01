# Runbook

> Phase 1 stub. Operational procedures land alongside the infrastructure they
> describe (Phases 2, 6, 10).

## Deployment

- **Storefront:** Vercel auto-deploys on push to `main`. Preview URLs on every PR.
- **Backend:** GitHub Action `deploy-backend.yml` builds an image, pushes to
  GHCR, SSHs into Hetzner, pulls, runs `docker compose up -d`, applies
  migrations, hits `/health`, rolls back on failure.

Detailed step-by-step: TBD in Phase 10.

## Rollback

TBD in Phase 10. Target: `make rollback` reverts to previous tagged image
within ≤2 minutes.

## Database

- Backups: nightly `pg_dump | gzip | rclone copyto` to Cloudflare R2 bucket
  `hurc-backups/`, 30-day retention.
- Restore: `infra/scripts/restore-postgres.sh <date>` — rehearsed once per
  release in staging.

## Common ops

- **Reindex Meilisearch:** Vendure admin → "Reindex all" button (custom
  plugin), or `pnpm --filter @hurc/backend reindex`.
- **Replay BullMQ failed jobs:** TBD in Phase 2 plugin spec.
- **Rotate secrets:** Doppler dashboard → re-deploy backend & storefront.

## Incidents

- Sentry alerts: `#alerts-prod` (Slack channel TBD).
- UptimeRobot pages on-call.
- Mollie webhook outage playbook: TBD in Phase 6.
