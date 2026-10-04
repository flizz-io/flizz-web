# Services CRUD

Phase S in [progress-report.md](progress-report.md) (tasks S1–S9). Replaces the static roster in `apps/web/constants/services.ts` with records managed from the dashboard. The public pages and their design are specified in [services-pages.md](services-pages.md); this doc covers the data, the rules and the dashboard. Who may do what follows [users-and-permissions.md](users-and-permissions.md). SEO and AI fields follow [seo.md](../guides/seo.md#part-2--content-in-the-database).

## Scope decisions — 2026-10-03

- **Same contract as the static roster.** A service carries every field the pages render today (`Service` / `ServiceDetail` in `apps/web/types/services.ts`), so `/services`, `/services/[slug]` and the home teaser switch data source without a redesign.
- **Draft / Published, no publish date.** Services change rarely and launch with the site, so there is no scheduling. A service is public when it is **Published and not deleted**.
- **Ordered within a category.** The list page groups by the four categories (in enum order); inside a group, services follow `display_order`, set with move up / down in the dashboard. Moving a service to another category puts it last there.
- **Lists stay plain-text lists.** Deliverables, outcomes and FAQs are ordered lists edited in the form — no rich-text editor.
- **SEO and AI fields are part of the record** (task SEO5 for services): SEO title, SEO description, a share image, and FAQs that render visibly on the detail page and as `FAQPage` JSON-LD.
- **Changing a slug keeps the old URL working.** The old slug 301s to the new one (see [Slug redirects](#slug-redirects)). The table is shared, so articles and projects can use it later.
- **A service with projects can't be deleted.** Unlink or delete those projects first.
- **Nothing is hard-deleted; every change records who made it** (project-wide rule).

## Fields

| Field           | Rule                                                                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title           | Required, ≤ 80 chars. Keep its capitals as written (MVP, AI, SaaS — see [services-pages.md](services-pages.md#build-notes))                                                  |
| Slug            | Generated from the title on create; unique; editable (lower-case letters, digits, hyphens). The detail URL is `/services/<slug>`                                             |
| Category        | One of the four `ServiceCategory` values                                                                                                                                     |
| Summary         | Required, ≤ 200 chars — one line, carries the list page row and the home teaser                                                                                              |
| Visual          | Required — one of `SERVICE_VISUAL_KINDS` in `@workspace/service-visuals`. Picked from a grid of the scenes in the form. Two services may share one                           |
| Intro           | Required, ≤ 600 chars — two or three sentences under the detail hero                                                                                                         |
| Problem         | Required, ≤ 1,500 chars — what the service is for, in the client's terms                                                                                                     |
| Deliverables    | 1–8 items, ≤ 200 chars each, ordered (3–6 reads best)                                                                                                                        |
| Outcomes        | 1–6 items, ≤ 200 chars each, ordered (3 reads best)                                                                                                                          |
| Engagement      | Optional, ≤ 120 chars ("6–10 weeks, weekly demos"). Empty → the section is left out, never invented                                                                          |
| FAQs            | 0–10 pairs of `question` (≤ 200) / `answer` (≤ 1,000), ordered. Shown on the detail page with every answer in the HTML (no collapsed-only content), and as `FAQPage` JSON-LD |
| SEO title       | Optional, ≤ 70 chars; the counter warns past 60. Empty → the title                                                                                                           |
| SEO description | Optional, ≤ 200 chars; the counter warns outside 140–160. Empty → the summary                                                                                                |
| Share image     | Optional, 1200 × 630 (`cover` fit), via the media library, ≤ 2 MB. Empty → the generated OG card (SEO3)                                                                      |
| Display order   | Position within its category                                                                                                                                                 |
| Status          | `DRAFT` / `PUBLISHED`                                                                                                                                                        |

Related services on the detail page stay **derived** from the category — nothing to maintain.

## Visibility

**Public** (the website and the public API) — a service appears only if it is **not deleted** and **Published**. Drafts and deleted services are invisible, including their detail URL (404) — unless the slug is an old one of a visible service, which redirects.

The dashboard shows a status badge per service: **Draft** or **Live**.

**Projects linked to a hidden service.** A project may link to a Draft service (so a new service and its evidence can be prepared together). On the website, a project whose service isn't visible keeps its category but **drops the service link** — no link ever points at a 404.

## Permissions

Feature `SERVICES` (admins always have all four):

| Action   | Allows                                                                    |
| -------- | ------------------------------------------------------------------------- |
| `VIEW`   | The Services list and each service's form, read-only                      |
| `CREATE` | New services (they start as Draft, last in their category)                |
| `EDIT`   | Every field, the share image, publishing, and the order within a category |
| `DELETE` | Soft-delete — blocked while a project links to the service (see below)    |

The project form's Service dropdown reads the services list with the `PROJECTS` grant (a lightweight options endpoint), so editing a project doesn't need `SERVICES` access.

## Deletion

Soft delete (`deleted_at`, `deleted_by_id`). **Blocked with a 409 while any non-deleted project links to the service** — Draft or Published — because `projects.service_id` becomes required in S9 and a project must always have a service. The error names how many projects link to it; the form lists them. A deleted service's slug (and its old slugs) stay reserved, so an old link never lands on a different service.

## Slug redirects

From [seo.md](../guides/seo.md#tasks-in-priority-order) item 7. One table for every slug-addressed entity:

- `slug_redirects` — `entity_type` (`SERVICE`, `PROJECT`, `ARTICLE`), `old_slug`, `entity_id`, `created_at`, `created_by_id`, `deleted_at`, `deleted_by_id`. Unique on (`entity_type`, `old_slug`).
- **On a slug change** A → B, the API records A → the service. Redirects point at the entity, not at a slug, so A → B → C never chains: A and B both resolve to C.
- **Changing back** to a previous slug retires that slug's redirect (soft delete), so the page serves directly again.
- **Old slugs stay reserved** — another service can't take a slug that redirects somewhere.
- **The website** — when `/services/<slug>` finds no visible service, it asks `GET /api/public/services/redirects/<slug>`; a hit calls `permanentRedirect('/services/<current-slug>')` (308, which search engines treat as a 301). Only redirects to a visible service resolve.
- Projects and articles adopt the same table in their own tasks (projects retrofit, AR1).

## Data

- `services` — the fields above as columns (already created in migration `20261003094516_add_content_tables`); S2 adds `seo_title`, `seo_description`, `og_image_id` → `media_files`, and `faqs`.
    - **`faqs` is a JSONB column** (`[{ question, answer }]`, ordered), like `projects.results`: saved as a whole, and child rows would need hard deletes.
    - `deliverables` and `outcomes` are `text[]`.
    - `visual_kind` is text; the API checks it against its copy of the list (`apps/api/src/constants/service.ts`, kept in sync with `packages/service-visuals/src/types.ts`). The API runs compiled JavaScript and can't import that source-only React package.
- `slug_redirects` — as above; S2 creates it.
- `media_purpose` gains `SERVICE_OG_IMAGE`.
- **Seed** (`pnpm --filter api db:seed`): the twelve services in `apps/api/prisma/seed-data/services.json`, created Published in today's order, authored by the Super Admin. It only creates slugs that don't exist yet — re-running never overwrites dashboard edits. Services are seeded before projects; each seeded project names its service by slug (`serviceSlug` in `projects.json`).

## API

| Endpoint                                       | Who               | Purpose                                                                                                         |
| ---------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `GET /api/services`                            | `SERVICES` `VIEW` | Dashboard list — `?search=` (title, slug, summary), `?category=`, `?status=`. Ordered by category, then order   |
| `GET /api/services/options`                    | `PROJECTS` `VIEW` | Every non-deleted service as `{ uuid, title, slug, category, status }` — the project form's dropdown            |
| `GET /api/services/:uuid`                      | `VIEW`            | One service, all fields, with authorship and the projects linked to it                                          |
| `POST /api/services`                           | `CREATE`          | New Draft, last in its category; slug optional (from the title, `-2`, `-3`… if taken); 409 on a taken slug      |
| `PATCH /api/services/:uuid`                    | `EDIT`            | Any fields and status. A slug change records a redirect; a category change moves it last in the new category    |
| `DELETE /api/services/:uuid`                   | `DELETE`          | Soft delete; 409 while projects link to it                                                                      |
| `PUT /api/services/order`                      | `EDIT`            | `{ category, serviceUuids }` — must list every non-deleted service in that category once; a stale list gets 409 |
| `POST` / `DELETE /api/services/:uuid/og-image` | `EDIT`            | Upload (multipart `file` ≤ 2 MB) or clear the share image                                                       |
| `GET /api/public/services`                     | Public            | Every visible service, card fields (list page, home teaser, static params)                                      |
| `GET /api/public/services/:slug`               | Public            | One visible service with the detail fields, FAQs and SEO fields — 404 otherwise                                 |
| `GET /api/public/services/redirects/:slug`     | Public            | `{ slug }` — the current slug of the visible service an old slug belonged to; 404 otherwise                     |

Public responses carry exactly the web's `Service` / `ServiceDetail` shape plus `faqs`, `seoTitle`, `seoDescription` and `ogImage` (URL) — no ids, status or authorship. Optional keys (`engagement`, the SEO fields, `ogImage`) are left out rather than `null`; the category is the enum key.

Every change revalidates the `services` cache tag, and also `projects` when the slug, status, title or category changes or a service is deleted (project pages link to services).

## Website integration (S7)

- The pages stay statically generated and read through `@workspace/api-services` (`apps/web/utils/services-api.ts`), tagged `services`, with the same revalidation wiring as projects ([projects-crud.md](projects-crud.md#website-integration-phase-e)).
- The home teaser's four category cards stay in `constants/home.ts` (`serviceCategoryCardBases`); each lists its published services via `serviceCategoryCardsOf`.
- The detail page shows a FAQ section (every answer in the HTML) only when the service has FAQs, and uses the SEO title, description and share image in its metadata. A missing slug asks the redirects endpoint before 404ing.
- `constants/services.ts` keeps only page copy and the back-nav switch; the roster lives in `seed-data/services.json`.
- The project detail hero links its service only when that service is published (`getProjectService` over the published list).

## Dashboard

- **Services list** — grouped by category (four sections, enum order). Each row: visual name, title, slug, status badge (Draft / Live), linked-project count, last updated by. Move up / down within a group (with `EDIT`) saves the category's order at once. Search and status filter; while a search or filter is on, reordering is off.
- **Service form** — sections: Basics (title, slug, category, summary), Visual (a grid of the scenes by name, with a live preview of the chosen one — one WebGL context), Page copy (intro, problem), Deliverables and Outcomes (reorderable lists), Engagement, FAQs (reorderable pairs), Search & social (SEO title/description with counters, a search-result preview, share image), Publishing (status), and the linked Projects. Read-only without `EDIT`. The preview's URL comes from `NEXT_PUBLIC_SITE_URL` in apps/dashboard.
- **Saving** — fields save together with the form's Save. The share image saves as it changes and only once the service exists.
- **Delete** — confirmed; only with `DELETE`. When projects link to it, the dialog says so and lists them instead of offering delete.
- Each service shows "Created by … · Last changed by …".

## Projects ↔ Services (S6)

- The project API takes `serviceUuid` and returns `service: { uuid, title, slug, category }`; the project's category and `/services/<slug>` come from it. `serviceCategory` / `serviceSlug` stop being inputs.
- Public project responses keep `service` (category) and `serviceSlug`; `serviceSlug` is left out when the service isn't visible.
- The project form gets a Category filter and a Service dropdown in place of the free-text "Service page slug".
- **Done 2026-10-04 (S9):** `projects.service_slug` / `service_category` are dropped and `service_id` is required (migration `20261004120000_require_project_service`), after the production seed linked every project (S8). A project's category is always its service's.

## Decisions log

- **No scheduling for services (2026-10-03):** `services` has no `publish_at`; Draft / Published is enough for a twelve-item catalogue.
- **Visual kinds in the API (2026-10-03):** a mirrored constant rather than an import — `@workspace/service-visuals` is source-only and ships Three.js.
- **Delete rule (2026-10-03):** blocked by any non-deleted project, not only Published ones, because S9 makes the link required.
