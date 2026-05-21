#!/usr/bin/env bash
# Stop the local HURC docker data-layer.
#
# Default: stop containers but keep the postgres/redis/meili volumes so the
# next `pnpm dev:up` is fast (no re-migrate / re-seed needed).
#
# Pass `--reset` to wipe volumes too (full fresh DB). After a reset, the
# next `pnpm dev:up` re-runs migrations + seed automatically.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if [[ "${1:-}" == "--reset" ]]; then
  echo "→ docker compose down -v (volumes wiped)"
  docker compose -f infra/docker/compose.yml down -v
else
  echo "→ docker compose down (volumes preserved; use --reset to wipe)"
  docker compose -f infra/docker/compose.yml down
fi
