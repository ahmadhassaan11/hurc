# `infra/docker/` — local dev services

Compose file for the local backend dependencies. Production runs the same
images on Hetzner via a separate compose deck (lands with Phase 10 / CI-CD).

## What this brings up

| Service            | Image                          | Host port | Purpose                                     |
| ------------------ | ------------------------------ | --------- | ------------------------------------------- |
| `hurc-postgres`    | `postgres:16-alpine`           | `5432`    | Vendure primary store                       |
| `hurc-redis`       | `redis:7-alpine`               | `6379`    | BullMQ + session cache                      |
| `hurc-meilisearch` | `getmeili/meilisearch:v1.42.1` | `7700`    | Product search index (populated by reindex) |

Credentials match `apps/backend/.env.example`. A fresh
`cp apps/backend/.env.example apps/backend/.env` boots without overriding
`DATABASE_URL`, `REDIS_URL`, `MEILI_HOST`, or `MEILI_MASTER_KEY`.

## Usage

```bash
# bring services up (run from repo root)
docker compose -f infra/docker/compose.yml up -d

# follow logs (Ctrl-C to detach; services keep running)
docker compose -f infra/docker/compose.yml logs -f

# wait for healthy (the backend dev script can rely on this)
docker compose -f infra/docker/compose.yml ps

# bring services down (volumes persist)
docker compose -f infra/docker/compose.yml down

# nuke including volumes (full reset)
docker compose -f infra/docker/compose.yml down -v
```

## Port conflicts

If you have a Postgres (e.g. Homebrew `postgresql@14`) or Redis already
listening on the same host ports, the compose `up` will fail to bind.
Resolve by stopping the conflicting service:

```bash
brew services stop postgresql@14
brew services stop redis
```

(Restart them with `brew services start <name>` when finished with the
HURC stack — the volumes here are isolated and will not collide.)

Alternatively, edit the host-side of the port mapping in `compose.yml` and
override `DATABASE_URL` / `REDIS_URL` in `apps/backend/.env`. The default
matches the `.env.example` for one-step onboarding; only deviate if you
must.

## Persistence

Data lives in named volumes (`hurc-postgres`, `hurc-redis`, `hurc-meili`).
`down` keeps them; `down -v` removes them. The Meilisearch master key is
baked into the compose file because it is local-only — production keys
come from Doppler.
