# Media storage — set up and switch providers

How uploaded files (profile photos, project covers and gallery images) are stored, how to set up Cloudinary, and how to switch provider safely. The design itself is in [users-and-permissions.md § Photos](../requirements/users-and-permissions.md#photos) and [projects-crud.md](../requirements/projects-crud.md).

## How it works

- Every upload goes through `packages/media-library`. The API checks the bytes really are an image, resizes it to the preset (or the size the uploader asked for) and re-encodes it as WebP, then hands the result to the **storage provider**.
- The provider is chosen by **`MEDIA_PROVIDER`** in `apps/api/.env`:

    | Value                  | Where files live                                   | Served from                             | Use for                    |
    | ---------------------- | -------------------------------------------------- | --------------------------------------- | -------------------------- |
    | `cloudinary` (default) | Your Cloudinary account, under `CLOUDINARY_FOLDER` | Cloudinary's CDN (`res.cloudinary.com`) | Production, and normal dev |
    | `local`                | `apps/api/storage/media/` (git-ignored)            | The API at `/api/media/...`             | Offline development only   |

- The database (`media_files`) stores each file's **storage key and provider**, never a URL. URLs are built from the **current** provider — which is why switching provider needs the migration step below.
- Nothing is ever deleted from storage. Replaced or removed images are retired in the database (`deleted_at`); the file stays.

## Set up Cloudinary

### 1. Create the account

1. Sign up at **cloudinary.com** on the **free plan** (Google sign-in works).
2. Signup creates a **product environment** with a **cloud name** (e.g. `dxyz123ab`). It can't be renamed, but it never shows on the website.

Free plan: **25 credits a month** — roughly one credit per 1 GB of storage, 1 GB of bandwidth, or 1,000 transformations. We upload already-small WebP files (typically 15–40 KB for photos) and request no transformations, so this goes a long way.

### 2. Get the credentials

1. Cloudinary Console → **Settings** (gear icon) → **API Keys**.
2. Note the **Cloud name** (also at the top of the console), the **API Key** and the **API Secret** (click to reveal).
3. Recommended: **Generate New API Key** for this app and name it after where it's used (`flizz-api-local`, `flizz-api-production`). A key can then be revoked without touching anything else.

### 3. Configure the API

In **`apps/api/.env`** only:

```bash
MEDIA_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=flizz-dev
```

| Variable                | Notes                                                                                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLOUDINARY_FOLDER`     | Every upload goes under it. Use `flizz-dev` locally and `flizz` in production so test uploads never mix with live ones                                                                               |
| `CLOUDINARY_API_SECRET` | **Secret.** Only ever in `apps/api/.env` (git-ignored) or the API host's environment. Never in the dashboard or web app env files, and never in a `NEXT_PUBLIC_…` variable — those reach the browser |

The API validates these at start-up: with `MEDIA_PROVIDER=cloudinary` and a value missing, it refuses to start and names what's missing.

Then follow [Switch provider](#switch-provider) from step 2.

## Switch provider

Applies in either direction (local → Cloudinary, Cloudinary → local, or to a future provider).

1. **Set the new provider's variables** in `apps/api/.env` and change `MEDIA_PROVIDER`.
2. **Restart the API** (`pnpm dev`, or `pnpm --filter api dev`). Env is read at start-up only.
3. **Move the seeded project covers:**

    ```bash
    pnpm --filter api db:seed
    ```

    Expect `… N cover(s) moved to <provider>`. The seed re-uploads each seeded cover that still sits on another provider and retires the old record. Running it again moves nothing.

4. **Re-upload anything added through the dashboard** while the old provider was active — profile photos, and project images an admin uploaded. The seed only knows about its own covers. To find them:

    ```sql
    select purpose, provider, original_name, created_at
    from media_files
    where deleted_at is null and provider <> '<new provider>';
    ```

5. **Check it worked:**
    - Cloudinary: Console → **Assets** (Media Library) — the files appear under `CLOUDINARY_FOLDER`.
    - Upload a profile photo at `/profile` in the dashboard; its address starts with `https://res.cloudinary.com/<cloud-name>/image/upload/<folder>/…` (or `<api>/api/media/…` for `local`).
    - Open the website's portfolio pages and confirm the covers load.

## Production

- Set `MEDIA_PROVIDER=cloudinary` and the four `CLOUDINARY_*` variables in the **API host's** environment, with a production API key and `CLOUDINARY_FOLDER=flizz`.
- Run `pnpm --filter api db:deploy` then `pnpm --filter api db:seed` on first deploy.
- `MEDIA_PROVIDER=local` is single-server only: files live on that server's disk, so a second instance or a host with a temporary filesystem loses them. Don't use it in production.

## If a key leaks

1. Cloudinary Console → Settings → **API Keys** → revoke the leaked key.
2. Generate a new one and update `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` wherever it was used.
3. Restart the API. Existing files keep working — URLs don't contain the key.

## Adding another provider (S3, R2, …)

1. Implement `StorageProvider` (`put`, `publicUrl`, `name`) in `packages/media-library/src/`, export it from `src/index.ts`.
2. Add a value to `MediaProvider` in `apps/api/src/enums/media-provider.ts`, its variables to `apps/api/src/configs/env.ts` (required only when selected) and `.env.example`.
3. Choose it in `apps/api/src/configs/media.ts`.
4. Update this guide, `CLAUDE.md` and `.claude/rules/conventions.md`.
