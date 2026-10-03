# Deployment

Three apps, one database. **Vercel is temporary** (decided 2026-10-02): the plan is to move to our own server at the end of next month, host not chosen yet. Nothing in the code depends on Vercel — the only Vercel-specific files are `apps/api/vercel.json`, `apps/api/api/index.js` and the empty `apps/api/public/`, all safe to delete after the move.

## How the pieces connect

```
web (flizz.io) ─────────────┐
                            ├── HTTP ──▶ api ──▶ PostgreSQL
dashboard (admin.flizz.io) ─┘             │
                                          └──▶ Cloudinary (images)
```

- **Only the API talks to the database.** The web app and the dashboard never connect to Postgres — they call the API.
- **The dashboard calls the API through its own `/api` rewrite** (`apps/dashboard/next.config.ts`), so the session cookie stays first-party on the dashboard's domain. No CORS, no cross-site cookies.
- **The web app needs the API at build time.** Portfolio, home and About pages are built from it; `next build` fails if `API_URL` is unreachable. Deploy the API first.
- **The API asks the web app to refresh** after a project or team change (`POST <WEB_URL>/api/revalidate` with a shared secret). Five-minute refresh on top of that is opt-in: `ENABLE_PERIODIC_REVALIDATION=true` in the web app.

## Order of a first deploy

1. **Database** — create a hosted PostgreSQL (Neon or Supabase both have free tiers). On serverless, use the provider's **pooled** connection string.
2. **Schema and seed** — from your machine, with `DATABASE_URL` pointing at it:
    ```bash
    pnpm --filter api db:deploy   # applies migrations — never `db:migrate` in production
    pnpm --filter api db:seed     # Super Admin, services, projects
    ```
    Full routine, safety rules and the pending-release list: [apps/api/README.md](../../apps/api/README.md#production-database). Run `db:deploy` again whenever a PR adds a migration, before deploying the API that needs it. Migrations are deliberately not part of the API build: a preview deployment would otherwise migrate the production database.
3. **API** — deploy, check `GET <api>/api/health`.
4. **Dashboard** — deploy with `API_URL` set to the API's URL.
5. **Web** — set `API_URL` (and the revalidation secret), redeploy.
6. **Google OAuth** — in Google Cloud Console, add the dashboard's URL to the OAuth client's **Authorised JavaScript origins**, or sign-in fails.
7. **Wire refresh** — set the same random secret as `WEB_REVALIDATE_SECRET` (API) and `REVALIDATE_SECRET` (web), and `WEB_URL` on the API.

## Environment variables

Every variable is documented in each app's `.env.example`; this is what production needs.

| App       | Variable                                                               | Value                                                              |
| --------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| api       | `DATABASE_URL`                                                         | Hosted Postgres (pooled on serverless)                             |
| api       | `GOOGLE_CLIENT_ID`                                                     | Same client as the dashboard's                                     |
| api       | `SESSION_SECRET`                                                       | 32+ random characters                                              |
| api       | `SUPER_ADMIN_EMAIL`                                                    | The owner's Google account                                         |
| api       | `CORS_ORIGINS`                                                         | The web app's origin, e.g. `https://flizz.io`                      |
| api       | `MEDIA_PROVIDER`                                                       | `cloudinary` — required on serverless (no persistent disk)         |
| api       | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | From the Cloudinary console ([media-storage.md](media-storage.md)) |
| api       | `WEB_URL`, `WEB_REVALIDATE_SECRET`                                     | The web app's URL and the shared secret                            |
| dashboard | `API_URL`                                                              | The API's URL                                                      |
| dashboard | `NEXT_PUBLIC_GOOGLE_CLIENT_ID`                                         | Same client ID                                                     |
| web       | `API_URL`                                                              | The API's URL — needed at build time                               |
| web       | `REVALIDATE_SECRET`                                                    | The shared secret                                                  |
| web       | `NEXT_PUBLIC_SITE_URL`                                                 | The site's public origin                                           |
| web       | `ENABLE_PERIODIC_REVALIDATION`                                         | Optional, `true` for a five-minute refresh                         |
| web       | `MEDIA_BASE_URL`                                                       | Only with local-disk media — not used with Cloudinary              |

## On Vercel (temporary)

One Vercel project per app, all from this repository:

| Project   | Root Directory   | Framework preset | Notes                                     |
| --------- | ---------------- | ---------------- | ----------------------------------------- |
| web       | `apps/web`       | Next.js          | Already deployed                          |
| dashboard | `apps/dashboard` | Next.js          | No code changes needed                    |
| api       | `apps/api`       | Other            | Settings come from `apps/api/vercel.json` |

**How the API runs there.** `apps/api/vercel.json` builds with `turbo run build` (the API and the media library it depends on, compiled to `dist/`), then routes every request to one serverless function, `apps/api/api/index.js`, which only re-exports the compiled Express app. `outputDirectory` points at the empty `apps/api/public/` so no repository file is ever served as a static asset.

**Limits that matter:**

- Request bodies are capped at about 4.5 MB on Vercel functions — the 2 MB image limit fits.
- No persistent disk: `MEDIA_PROVIDER` must be `cloudinary`.
- Cold starts add latency to the first request after a quiet spell.
- The Hobby (free) plan's terms are for non-commercial use — check they fit before relying on it.

**Per project, turn on** _Settings → Git → "Skip deployments when there are no changes to the root directory or its dependencies"_, so a dashboard-only change doesn't rebuild all three apps.

## On our own server (next month)

The apps are ordinary Node processes — any Linux VPS, Docker host or PaaS will do.

| App       | Build                           | Run                                                                               |
| --------- | ------------------------------- | --------------------------------------------------------------------------------- |
| api       | `pnpm --filter api build`       | `pnpm --filter api start` (`node dist/index.js`, listens on `PORT`, default 3500) |
| dashboard | `pnpm --filter dashboard build` | `pnpm --filter dashboard start` (`next start` — port 3000 unless `PORT` is set)   |
| web       | `pnpm --filter web build`       | `pnpm --filter web start` (same — set `PORT` per app)                             |

- Put a reverse proxy (Nginx, Caddy, Traefik) in front for HTTPS and one hostname per app; keep a process manager (systemd, PM2) or containers restarting them.
- Build the web app **after** the API is up — it reads the API at build time.
- Postgres can stay where it is (a hosted provider) or move onto the server; only the API's `DATABASE_URL` changes.
- Local-disk media becomes possible (`MEDIA_PROVIDER=local` with a persistent `MEDIA_STORAGE_DIR` and `MEDIA_PUBLIC_BASE_URL`), but staying on Cloudinary avoids a migration — see [media-storage.md](media-storage.md#switch-provider) if you switch.
- Then delete `apps/api/vercel.json`, `apps/api/api/` and `apps/api/public/`, and remove the Vercel projects.
