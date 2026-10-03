# API (`apps/api`)

Express + TypeScript + Prisma (PostgreSQL). Dev server on port 3500. Folder layout and conventions: `.claude/rules/conventions.md`. Hosting: [docs/guides/deployment.md](../../docs/guides/deployment.md).

## Database scripts

Run from the repo root as `pnpm --filter api <script>`, or as `pnpm <script>` inside `apps/api`.

| Script        | What it does                                                                 | Where                  |
| ------------- | ---------------------------------------------------------------------------- | ---------------------- |
| `db:migrate`  | `prisma migrate dev`: creates a migration from schema changes and applies it | **Local only**         |
| `db:deploy`   | `prisma migrate deploy`: applies committed migrations that haven't run yet   | Production (and local) |
| `db:seed`     | `prisma db seed`: Super Admin, services, projects, project→service links     | Both, safe to re-run   |
| `db:generate` | Regenerates the Prisma client (also runs on `pnpm install`)                  | Both                   |
| `db:studio`   | Opens Prisma Studio on `DATABASE_URL`                                        | Mostly local           |

## Local workflow: changing the schema

1. Edit `prisma/schema.prisma`.
2. `pnpm --filter api db:migrate --name <what_changed>`. This writes `prisma/migrations/<timestamp>_<name>/migration.sql` and applies it to your local database.
3. Read the generated SQL before committing. Make sure it doesn't drop a column or table you meant to keep.
4. Commit the schema **and** the migration folder together. Never edit a migration that has already run on production; add a new one.

`db:migrate` may ask to **reset** (wipe) the database when it detects drift. That's fine locally. It must never be run against production.

## Production database

The API build never migrates the database. Migrations and seeding are manual steps, run from a developer machine, **before** deploying the API code that needs them.

### 1. Keep production credentials out of `.env`

Your `.env` stays pointed at the local database. Put production values in `apps/api/.env.production` (ignored by git through `.env*`). It must hold **every** variable `src/configs/env.ts` validates, not only `DATABASE_URL`. The seed loads the full config:

```bash
DATABASE_URL='postgresql://…neon.tech/flizz?sslmode=require&channel_binding=require'   # quoted, see below
SUPER_ADMIN_EMAIL=…                 # the production Super Admin
MEDIA_PROVIDER=cloudinary           # must match production, see the warning below
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
CLOUDINARY_FOLDER=flizz
GOOGLE_CLIENT_ID=…
SESSION_SECRET=…
```

> **Quote any value containing `&`, `?`, `$`, spaces or `#`** — Neon's URL has `&channel_binding=require`. The file is `source`d by bash, which reads an unquoted `&` as "run in the background": `DATABASE_URL` is then never set and every command silently falls back to your local `.env`.

Run commands with that file loaded into a subshell. Variables already set in the environment win over `.env`, so nothing local leaks in:

```bash
cd apps/api
(set -a; source .env.production; set +a; npx prisma migrate status)
```

> **Warning:** `MEDIA_PROVIDER` must be `cloudinary` when seeding production. The seed moves seeded project covers onto whichever provider is configured. With your local `MEDIA_PROVIDER=local`, it would re-upload production covers to your disk and retire the Cloudinary ones.

### 2. Release checklist (every PR that adds a migration)

```bash
cd apps/api
P='set -a; source .env.production; set +a;'

# a. What's pending? Lists the migrations not yet applied.
#    STOP unless it prints `Datasource "db": … at "<your-host>.neon.tech"`.
#    `at "localhost"` means .env.production didn't load (see the quoting note).
(eval "$P"; npx prisma migrate status)

# b. Back up first: on Neon, create a branch of the production database
#    (Console → Branches → Create branch). It's instant and is your rollback.

# c. Apply the migrations.
(eval "$P"; pnpm db:deploy)

# d. Seed, if the release notes say so (it only adds what's missing).
(eval "$P"; pnpm db:seed)

# e. Confirm: should print "Database schema is up to date!"
(eval "$P"; npx prisma migrate status)
```

Then deploy the API, then the dashboard and web app (see [deployment.md](../../docs/guides/deployment.md#order-of-a-first-deploy)).

### Rules

- **Never** run `db:migrate`, `prisma migrate reset`, `prisma db push` or `prisma migrate dev` against production. They can drop data.
- **Migrate before you deploy.** New code expects the new columns; old code keeps working against an added column.
- **Destructive changes go in two releases (expand, then contract).** First release: add the new column or table and backfill it, while the old one stays. Second release, once the code no longer reads the old column: drop it. Example: `projects.service_id` was added on 2026-10-03, and `service_slug` / `service_category` are dropped in a later migration.
- **The seed is idempotent.** It creates missing rows by slug or email and never overwrites dashboard edits, so re-running it is safe.
- **A failed migration** shows as failed in `migrate status`, and `db:deploy` refuses to continue. Fix the cause, then mark it with `npx prisma migrate resolve --rolled-back <name>` (or `--applied` if you finished it by hand), and deploy again. If in doubt, restore the Neon branch from step b.

### Connection notes (Neon)

- Prisma's migrate commands should use Neon's **direct** connection string (host without `-pooler`). The pooled one (PgBouncer) can hang on the lock `migrate deploy` takes. The running API on Vercel uses the **pooled** string.
- If a remote seed fails with `P2028 Unable to start a transaction` or `ETIMEDOUT`, the cause is latency or the network, not the data. Re-run it (it's idempotent). Some networks block outbound port 5432; switch networks if `psql "<url>"` can't connect either.

## Pending production releases

Remove each entry once it has run on production.

| Migration                                           | Seed needed?                | Notes                                                                                                                                                                                                                                                          |
| --------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `20261003094516_add_content_tables`                 | **Yes**                     | Adds articles, services, testimonials, contact messages and `projects.service_id`. The seed adds the 12 services and links projects to them.                                                                                                                   |
| `20261003124644_add_service_seo_and_slug_redirects` | No (same seed run as above) | Adds the services' SEO fields, FAQs and share image, `slug_redirects`, and the `SERVICE_OG_IMAGE` media purpose. Deploy the API from the Phase S commits after it. Any project the seed reports as unlinked must be given a service in the dashboard before S9 |
