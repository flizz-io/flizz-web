# Testimonials CRUD

Phase T in [progress-report.md](progress-report.md) (tasks T1–T6). Replaces the three placeholder quotes in `apps/web/constants/home.ts` (`testimonials`) with records managed from the dashboard. Testimonials only ever render in the home page's "What Clients Say" section ([home-page.md](home-page.md#testimonials)) — there is no testimonials page, list or URL. Who may do what follows [users-and-permissions.md](users-and-permissions.md).

## Scope decisions — 2026-10-06

- **Same contract as the static quotes.** A testimonial carries what the home section renders today (`Testimonial` in `apps/web/types/home.ts`: quote, highlights, author, role), so the section switches data source without a redesign. The one addition is an optional link to the project it came from.
- **Draft / Published, no publish date.** A testimonial is public when it is **Published and not deleted**.
- **One ordered list.** The carousel follows `display_order`, set with move up / down in the dashboard (the same control as the Services list and the project gallery — the dashboard has no drag-and-drop, and buttons work from the keyboard). New testimonials go last.
- **No slug, no SEO fields.** A testimonial is never addressable on its own.
- **Highlights are exact phrases of the quote**, never markup inside it — the quote stays plain text.
- **Deleting is never blocked.** Nothing links to a testimonial.
- **Nothing is hard-deleted; every change records who made it** (project-wide rule).

## Fields

| Field         | Rule                                                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quote         | Required, ≤ 320 chars. Plain text, no line breaks. The section sets it large, so under ~200 reads best                                                                                                   |
| Highlights    | 0–3 phrases, ≤ 60 chars each, set in the accent colour. Each must appear in the quote (matched ignoring case, as the site does); no duplicates. See [Highlights](#highlights)                            |
| Author name   | Required, ≤ 80 chars. The section shows its initials in the avatar                                                                                                                                       |
| Author role   | Required, ≤ 120 chars, free text: "COO, Northwind"                                                                                                                                                       |
| Project       | Optional — any non-deleted project, Draft or Published. On the site, a "See the project" link shows only while that project is publicly visible; otherwise the quote shows without it, never a dead link |
| Display order | Position in the carousel                                                                                                                                                                                 |
| Status        | `DRAFT` / `PUBLISHED`                                                                                                                                                                                    |

### Highlights

- Picked in the form by **selecting words in the quote preview** and pressing "Highlight". The selection is trimmed; one that doesn't fall inside the quote, or would pass 3 or 60 chars, is refused with a message. Each picked phrase shows as a removable chip.
- **Editing the quote** can strand a phrase. The form marks any phrase no longer in the quote and Save stays off until it is removed; the API refuses it too (400, naming the phrase), so a stale phrase can never be saved.
- The site lights the longest phrase first, so a phrase that contains another still lights whole.

## Visibility

**Public** (the website and the public API) — a testimonial appears only if it is **not deleted** and **Published**, in display order. With none, the home section is left out (and the sections after it renumber).

The dashboard shows a status badge per testimonial: **Draft** or **Live**.

## Permissions

Feature `TESTIMONIALS` (admins always have all four):

| Action   | Allows                                                       |
| -------- | ------------------------------------------------------------ |
| `VIEW`   | The Testimonials list and each testimonial's form, read-only |
| `CREATE` | New testimonials (they start as Draft, last in the list)     |
| `EDIT`   | Every field, publishing, and the order                       |
| `DELETE` | Soft-delete                                                  |

The form's Project dropdown reads a lightweight project options endpoint with the `TESTIMONIALS` grant, so linking a project doesn't need `PROJECTS` access.

## Deletion

Soft delete (`deleted_at`, `deleted_by_id`), confirmed in the dashboard, never blocked. The remaining testimonials keep their order (positions may have gaps; only the order matters). Deleting a project doesn't touch the testimonials linked to it — their link simply stops showing.

## Data

- `testimonials` — already created in migration `20261003094516_add_content_tables`: `quote`, `highlights` (`text[]`), `author_name`, `author_role`, `project_id` → `projects` (nullable), `display_order`, `status` (`publish_status`), and the audit columns. **No migration needed.**
- **Seed** (`pnpm --filter api db:seed`): the three placeholder quotes in `apps/api/prisma/seed-data/testimonials.json`, created Published in today's order, authored by the Super Admin, no project. It skips a quote that already exists — deleted or not — so re-running never overwrites dashboard edits or brings back a deleted placeholder.

## API

| Endpoint                                | Who                   | Purpose                                                                                                  |
| --------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| `GET /api/testimonials`                 | `TESTIMONIALS` `VIEW` | Dashboard list — `?search=` (quote, author name, role), `?status=`. In display order                     |
| `GET /api/testimonials/project-options` | `VIEW`                | Every non-deleted project as `{ uuid, name, slug, visibility }` — the form's dropdown                    |
| `GET /api/testimonials/:uuid`           | `VIEW`                | One testimonial, all fields, with its project and authorship                                             |
| `POST /api/testimonials`                | `CREATE`              | New Draft, last in the list; `projectUuid` optional                                                      |
| `PATCH /api/testimonials/:uuid`         | `EDIT`                | Any fields and status; `projectUuid: null` unlinks. Highlights are checked against the quote being saved |
| `DELETE /api/testimonials/:uuid`        | `DELETE`              | Soft delete                                                                                              |
| `PUT /api/testimonials/order`           | `EDIT`                | `{ testimonialUuids }` — must list every non-deleted testimonial once; a stale list gets 409             |
| `GET /api/public/testimonials`          | Public                | Every visible testimonial, in order                                                                      |

Public responses carry exactly the web's `Testimonial` shape — `quote`, `highlights`, `author`, `role` — plus `project: { slug, name }` only while that project is publicly visible. No ids, status or authorship; optional keys are left out rather than `null`.

Every change revalidates the `testimonials` cache tag. The home page fetches testimonials tagged `testimonials` **and** `projects`, so a project being renamed, unpublished or deleted also refreshes its link — without the project API knowing about testimonials.

## Website integration (T5)

- The home page stays statically generated and reads through `@workspace/api-services` (`apps/web/utils/testimonials-api.ts`), with the same revalidation wiring as services ([services-crud.md](services-crud.md#website-integration-s7)).
- The `Testimonials` section takes the list as a prop (the page is a server component; the carousel stays a client one) and renders nothing when it's empty. Under the role, a linked project shows as "See the project →" to `/portfolio/<slug>`.
- `constants/home.ts` loses `testimonials`; the quotes live in `seed-data/testimonials.json`.

## Dashboard

- **Sidebar** — "Testimonials", shown with `TESTIMONIALS` `VIEW`.
- **Testimonials list** — one table in display order. Each row: the quote (two lines, highlights lit), author and role, linked project, status badge (Draft / Live), last updated by. Move up / down (with `EDIT`) saves the whole order at once. Search and status filter; while either is on, reordering is off.
- **Testimonial form** — sections: Quote (text with a counter), Highlights (the picker above, over a preview of the quote as the site sets it), Author (name, role), Project (dropdown with "None", each project's visibility shown), Publishing (status). Read-only without `EDIT`.
- **Saving** — every field saves together with the form's Save.
- **Delete** — confirmed; only with `DELETE`.
- Each testimonial shows "Created by … · Last changed by …".

## Decisions log

- **Move up / down instead of drag (2026-10-06):** the plan said drag reorder; the dashboard reorders everything else with buttons and has no drag-and-drop library. A handful of quotes doesn't justify one, and the buttons are keyboard-accessible.
- **Project link refresh via cache tags (2026-10-06):** the home fetch carries the `projects` tag too, rather than the project service revalidating `testimonials`.
