# Projects CRUD

Stages 10–13 for Portfolio in [progress-report.md](progress-report.md) (tasks C1–E5). Replaced the static roster that lived in `apps/web/constants/portfolio.ts` (retired in E3 — now only seed data) with records managed from the dashboard. The public pages and their design are specified in [portfolio-pages.md](portfolio-pages.md); this doc covers the data, the rules and the dashboard. Who may do what follows [users-and-permissions.md](users-and-permissions.md).

## Scope decisions — 2026-10-02

- **Same contract as the static roster.** A project carries every field the portfolio pages render today (`Project` / `ProjectDetail` in `apps/web/types/portfolio.ts`), so the public pages switch data source without a redesign.
- **Case-study sections stay structured lists.** Brief, Constraints, Approach and What we built are each an ordered list of plain-text paragraphs/items — added, reordered and removed in the form. No rich-text editor for now.
- **Draft / Published, with an optional publish date.** A project is public only when Published **and** its publish date (if set) has passed — computed at read time, no background job (per the project conventions).
- **One cover image plus a gallery.** The cover is the plate every existing view uses (reel, index, home strip, detail hero). The gallery is a new, ordered set of images with optional captions, shown in a **new gallery section** on the detail page — the rest of the page is unchanged. That section is designed in task E5.
- **"Featured" and "Show on home" are separate flags, each with its own order.** Featured drives the `/portfolio` reel; Show on home drives the home page strip (replacing the hand-kept slug list the static roster had).
- **Nothing is hard-deleted; every change records who made it** (project-wide rule).

## Fields

| Field                                       | Rule                                                                                                                                                                                                                                     |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                                        | Required, ≤ 80 chars                                                                                                                                                                                                                     |
| Slug                                        | Generated from the name on create; unique; editable (lower-case letters, digits, hyphens). The detail URL is `/portfolio/<slug>`                                                                                                         |
| Client                                      | Required, ≤ 140 chars — an anonymised descriptor ("A 40-person operations team…"), not necessarily a trading name                                                                                                                        |
| Sector                                      | One of the five `ProjectSector` values — the index groups by it                                                                                                                                                                          |
| Service                                     | Required — the service this project is evidence for, chosen in the form from a Category filter + Service dropdown (S6). Its category and `/services/<slug>` come from it; see [services-crud.md](services-crud.md#projects--services-s6) |
| Year                                        | Required, four digits, 2000 → next year                                                                                                                                                                                                  |
| Summary                                     | Required, ≤ 200 chars — one line, carries the index row and home card                                                                                                                                                                    |
| Results                                     | 1–6 pairs of `label` / `from` / `to` (each ≤ 80 chars), ordered. **The first** is the headline shown on the index row and home card                                                                                                      |
| Duration, Team                              | Required, ≤ 80 chars each ("14 weeks", "Two engineers, one designer")                                                                                                                                                                    |
| Brief, Constraints, Approach, What we built | Each 1–10 items, ≤ 1,000 chars per item, ordered                                                                                                                                                                                         |
| Stack                                       | 0–20 chips, ≤ 40 chars each                                                                                                                                                                                                              |
| Quote                                       | Optional: text (≤ 500) + attribution (≤ 120). Both or neither                                                                                                                                                                            |
| Cover image                                 | Optional (the page shows registration marks without one). Via the media library                                                                                                                                                          |
| Gallery                                     | 0–12 images, ordered, each with an optional caption (≤ 160). Via the media library                                                                                                                                                       |
| Featured, featured order                    | The `/portfolio` reel plays featured projects in this order                                                                                                                                                                              |
| Show on home, home order                    | The home page strip, in this order                                                                                                                                                                                                       |
| Status                                      | `DRAFT` / `PUBLISHED`                                                                                                                                                                                                                    |
| Publish date                                | Optional. In the future → stays hidden until then. Empty on publish → public immediately                                                                                                                                                 |

### Images

Through `packages/media-library` like every upload (WebP output, Cloudinary storage). **Limit: 2 MB per project image** (decided 2026-10-02) — full-page screenshots often exceed the 500 KB profile-photo limit; the server re-encodes to a compact WebP either way, so storage stays small.

| Image   | Default output (`ImageUploader` props) | Why                                                    |
| ------- | -------------------------------------- | ------------------------------------------------------ |
| Cover   | 1600 × 1000, `inside`                  | Screenshots keep their whole frame; plates crop to fit |
| Gallery | 1600 × 1200, `inside`                  | Same — nothing is cropped away                         |

Replacing or removing an image retires its `media_files` row; the file stays.

## Visibility

**Public** (the website and the public API) — a project appears only if it is **not deleted**, **Published**, and its **publish date is empty or past**. Everything else — drafts, scheduled, deleted — is invisible, including its detail URL (404).

The dashboard shows a status badge per project: **Draft**, **Scheduled** (Published, date in the future), **Live**.

## Permissions

Feature `PROJECTS` (admins always have all four):

| Action   | Allows                                                                 |
| -------- | ---------------------------------------------------------------------- |
| `VIEW`   | The Projects list and each project's form, read-only                   |
| `CREATE` | New projects (they start as Draft)                                     |
| `EDIT`   | Every field, images, publishing, featured/home flags and order         |
| `DELETE` | Soft-delete. Deleted projects leave the dashboard list and the website |

## Deletion

Soft delete (`deleted_at`, `deleted_by_id`). Nothing references a project yet, so deleting never blocks. A deleted project's slug stays reserved — a new project can't take it, so an old link never lands on different work.

## Data

- `projects` — the fields above, as columns: internal `id` + public `uuid`, `status`, `publish_at`, `first_published_at` (set once), `featured` / `featured_order`, `show_on_home` / `home_order`, `cover_image_id` → `media_files`, and the audit columns.
    - **`results` is a JSONB column** (`[{ label, from, to }]`, ordered), not a child table: results are saved as a whole, and replacing child rows would mean deleting them — which the no-hard-delete rule forbids.
    - The four case-study lists and `stack` are Postgres `text[]`; the quote is two nullable columns.
    - `slug` is unique across live and deleted projects.
- `project_images` — the gallery: `project_id`, `media_id`, `position`, `caption`, audit columns and `deleted_at` (images are retired one by one).
- Enums — `project_sector`, `service_category`, `project_status`. Their **values are the keys** (`OPERATIONS`, `CUSTOM_SOFTWARE`, …) per the project conventions. The web app's `ProjectSector` / `ServiceCategory` currently use display labels as values; Phase E switches them to the keys with a separate label map.
- **Seed** (`pnpm --filter api db:seed`): the ten projects of the retired static roster, in `apps/api/prisma/seed-data/projects.json` (screenshots in `seed-data/projects/`, paths relative to `seed-data/`), created Published with today's featured order and home-strip order, authored by the Super Admin. Cover screenshots go through the media library. It only creates slugs that don't exist yet — re-running never overwrites dashboard edits.
- **Switching storage providers:** each `media_files` row records its provider, but URLs are built with the _current_ one. After changing `MEDIA_PROVIDER`, follow [media-storage.md](../guides/media-storage.md#switch-provider): run `pnpm --filter api db:seed` — it re-uploads each seeded cover that's still on the old provider and retires the old row. Images uploaded through the dashboard on the old provider need re-uploading by hand.

## API

| Endpoint                                                  | Who      | Purpose                                                                                                     |
| --------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `GET /api/projects`                                       | `VIEW`   | Dashboard list — `?search=` (name, client, slug, summary), `?sector=`, `?visibility=DRAFT\|SCHEDULED\|LIVE` |
| `GET /api/projects/:uuid`                                 | `VIEW`   | One project, all fields, with authorship                                                                    |
| `POST /api/projects`                                      | `CREATE` | New Draft — every content field; slug optional (from the name, `-2`, `-3`… if taken); 409 on a taken slug   |
| `PATCH /api/projects/:uuid`                               | `EDIT`   | Any fields, status and publish date                                                                         |
| `DELETE /api/projects/:uuid`                              | `DELETE` | Soft delete                                                                                                 |
| `POST` / `DELETE /api/projects/:uuid/cover`               | `EDIT`   | Upload or clear the cover                                                                                   |
| `POST /api/projects/:uuid/gallery`                        | `EDIT`   | Add a gallery image (multipart `file` ≤ 2 MB, optional `caption`, `width`/`height`/`fit`); 409 past 12      |
| `PATCH` / `DELETE /api/projects/:uuid/gallery/:imageUuid` | `EDIT`   | Caption or retire one gallery image                                                                         |
| `PUT /api/projects/:uuid/gallery/order`                   | `EDIT`   | Reorder — must list every live image once; a stale list gets 409                                            |
| `GET /api/public/projects`                                | Public   | Every visible project (index, reel)                                                                         |
| `GET /api/public/projects/:slug`                          | Public   | One visible project (detail page) — 404 otherwise                                                           |
| `GET /api/public/projects/home`                           | Public   | The home strip, in home order                                                                               |

Public responses carry exactly the `Project` / `ProjectDetail` shape plus `gallery`, with image URLs resolved — no ids, status or authorship. Optional keys (`featured`, `image`, `quote`) are left out rather than `null`; `year` is a string; sector and service are the enum keys. The list is ordered featured first (in featured order), then newest year first.

The slug `home` is reserved — it would collide with `GET /api/public/projects/home`.

## Website integration (Phase E)

- The portfolio pages stay statically generated. Saving, publishing or deleting a project asks the web app to **revalidate** the affected pages (an on-demand revalidation endpoint protected by a shared secret), so changes appear within seconds without a rebuild.
- A scheduled project becomes public at read time. Pages refetch every five minutes **only when `ENABLE_PERIODIC_REVALIDATION=true`** in apps/web (default off, decided 2026-10-02); with it off, a scheduled launch shows on the next on-demand revalidation (any project save) or deploy.
- **How it's wired (E1):** the web app reads through `@workspace/api-services` in `apps/web/utils/projects-api.ts`, with fetches tagged `projects`; their interval is `contentRevalidate` in `constants/cache.ts` (300 s when periodic refresh is on, else none). After an edit, delete or image change the API calls `POST <WEB_URL>/api/revalidate` with `Authorization: Bearer <WEB_REVALIDATE_SECRET>`; the site checks it against its `REVALIDATE_SECRET` and expires the tag. Either side unset → no nudge. `next build` needs the API reachable at `API_URL`. A project published after the build renders on its first visit.
- **Reel order:** the reel still plays sector by sector; inside a sector, featured projects follow the dashboard's featured order.
- Gallery section (E5): designed with the `frontend-design` skill, matching the existing detail page; only shown when a project has gallery images — see [portfolio-pages.md](portfolio-pages.md#gallery-section--2026-10-02-task-e5).

## Dashboard

- **Projects list** — cover thumbnail, name, sector, year, status badge (Draft / Scheduled / Live), featured and home markers, last updated by. Search, sector and status filters. Visible with `VIEW`.
- **Project form** — sections: Basics (name, slug, client, sector, service, year, summary), Results (pairs, reorderable), Case study (the four lists, reorderable), Stack (chips), Quote, Images (cover + gallery with captions and reorder), Publishing (status, publish date, featured + order, show on home + order). Read-only without `EDIT`.
- **Saving** — the fields are saved together with the form's Save. Images are saved as they change (upload, caption on blur, reorder, remove) and only once the project exists, so a new project is created as a Draft first and its images added after.
- **Delete** — confirmed; only with `DELETE`.
- Each project shows "Created by … · Last changed by …".

## Decisions log

- **Image size (2026-10-02):** project images (cover and gallery) may be up to **2 MB**; profile photos stay at 500 KB. The limit is set per upload endpoint.
- **Enum values on the site (2026-10-02):** the web app keeps its label-valued `ProjectSector` / `ServiceCategory` (used across the services and home pages too) and maps the API's keys onto them in `utils/projects-api.ts` — the keys are shared, so it's one lookup. This replaces the planned switch of the web enums to keys.
- **Slug changes (2026-10-02):** no redirects from previous slugs. Changing a published project's slug breaks old links — the slug field says so.
