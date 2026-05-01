# HURC — Architecture

> Phase 1 stub. This file is fleshed out incrementally as phases land.
> The full target system is described in `docs/decisions/0001-stack.md`.

## High-level shape

```
                       ┌──────────────┐
                       │   Cloudflare │  DNS / WAF / cache rules
                       └──────┬───────┘
                              │
              ┌───────────────┼─────────────────┐
              ▼                                 ▼
      ┌───────────────┐                 ┌───────────────┐
      │   Vercel      │                 │  Hetzner CX22 │
      │ (storefront)  │ ───shop-api───► │ (backend)     │
      │  Next.js 15   │                 │  Caddy →      │
      └──────┬────────┘                 │  Vendure      │
             │                          │  + Worker     │
             │                          │  Postgres 16  │
             │                          │  Redis 7      │
             │                          │  Meilisearch  │
             │                          └───────┬───────┘
             ▼                                  ▼
      ┌──────────────┐                  ┌──────────────┐
      │   Sanity     │                  │  Bunny.net   │
      │  (CMS)       │                  │  Storage +   │
      └──────────────┘                  │  Pull Zone   │
                                        └──────────────┘
```

## Channels & locales

- Channels: `default`, `eu`, `uk`. EU = EUR, UK = GBP.
- Locales: `en` (default), `de`, `fr`, `nl`, `es`, `it`.
- Country detection in storefront middleware via Cloudflare `cf-ipcountry`,
  then mapped to channel + locale; user override stored in cookie.

## Asset pipeline

Vendure `AssetServerPlugin` writes to a Bunny.net **Storage Zone** via the
S3-compatible API. Public reads go through a **Pull Zone** that fronts the
storage with edge caching and image optimization. `assetUrlPrefix` points at
the Pull Zone host so Vendure-emitted URLs are already CDN URLs.

## Request flows

To be filled in during Phase 2/4. Two flows we will document in detail:

- **View PDP:** RSC fetch of product → fragment → JSON-LD render → Sanity
  editorial blocks streamed in.
- **Checkout:** Server Actions advance the active order through state
  transitions; payment intent created via Mollie; webhook → state transition.

## Deployment topology

- **Storefront:** Vercel, deploys on every `main` push.
- **Backend:** Hetzner CX22, Docker Compose orchestrating server, worker,
  Postgres, Redis, Meilisearch, Caddy. Deploys via SSH + GHCR image pull.
- **Backups:** nightly `pg_dump` to Cloudflare R2 with 30-day retention.
