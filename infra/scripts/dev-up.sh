#!/usr/bin/env bash
# Bring up the local HURC dev stack and stream backend + storefront logs.
#
# What it does, in order:
#   1. Copies apps/{backend,storefront}/.env{,*.local} from .env.example if
#      they don't already exist (your edits are preserved on re-runs).
#   2. Starts the docker data-layer (postgres / redis / meilisearch) and
#      waits for healthchecks.
#   3. Runs Vendure migrations (idempotent — TypeORM tracks ran migrations).
#   4. Runs the seed (idempotent — every entity is keyed and skipped on
#      re-run; logs `unchanged` for prior rows).
#   5. exec's `pnpm dev`, which runs both apps in parallel via Turborepo.
#
# Re-runs are fast: the docker stack stays up, migrations + seed are no-ops
# on a populated DB.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if [[ ! -f apps/backend/.env ]]; then
  echo "→ apps/backend/.env not found — copying from .env.example"
  cp apps/backend/.env.example apps/backend/.env
elif grep -qE '^PORT=3000$' apps/backend/.env; then
  # Self-heal: an older .env was copied before the port-collision fix.
  # Backend belongs on 3001 (storefront owns 3000). Sed in place; users
  # rarely customise these three lines locally.
  echo "→ apps/backend/.env has old PORT=3000 — migrating to 3001"
  sed -i.bak \
    -e 's|^PORT=3000$|PORT=3001|' \
    -e 's|^STOREFRONT_URL=http://localhost:3001$|STOREFRONT_URL=http://localhost:3000|' \
    -e 's|^BACKEND_PUBLIC_URL=http://localhost:3000$|BACKEND_PUBLIC_URL=http://localhost:3001|' \
    apps/backend/.env
  rm -f apps/backend/.env.bak
fi

if [[ ! -f apps/storefront/.env.local ]]; then
  echo "→ apps/storefront/.env.local not found — copying from .env.example"
  cp apps/storefront/.env.example apps/storefront/.env.local
fi

# Free the dev ports if anything is squatting on them (an orphaned dev run,
# a previous concurrently process that didn't tear down cleanly).
for port in 3000 3001 3002; do
  pid=$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -n "$pid" ]]; then
    echo "→ port $port held by pid $pid — killing"
    kill "$pid" 2>/dev/null || true
    sleep 1
  fi
done

echo "→ docker compose up (postgres / redis / meilisearch) — waiting for healthy"
docker compose -f infra/docker/compose.yml up -d --wait

echo "→ vendure migrations"
pnpm --filter @hurc/backend migration:run

echo "→ seed (idempotent)"
pnpm --filter @hurc/backend seed

echo "→ starting dev servers (backend on :3001, storefront on :3000, admin on :3002)"
exec pnpm dev
