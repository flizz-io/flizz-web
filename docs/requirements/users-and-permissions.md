# Users, Roles & Permissions

Stage 9 in [progress-report.md](progress-report.md) (tasks U1–U10). Who can sign in to the dashboard, what each person may do, and the team profiles the public About page shows. Builds on [dashboard-auth.md](dashboard-auth.md) — Google sign-in and the session are unchanged; this replaces its `admins` table with `users`.

## Scope decisions — 2026-10-02

- **One `users` table** for everyone who can sign in. **No registration**: a person exists only once an admin adds their email. Signing in with any other Google account is refused.
- **Three roles:**
    - `SUPER_ADMIN` — exactly one. Their email comes from `SUPER_ADMIN_EMAIL` in the API's env and is applied by the seed. Nobody else can change, suspend or remove them.
    - `ADMIN` — full access to every feature, and manages the team (including other Admins).
    - `TEAM_MEMBER` — edits their own profile; anything more only through per-feature permissions an admin grants.
- **Every user has a profile** — first/last name, designation, photo, social links — and can be shown on the public **About page team section** (decided 2026-10-02; replaces the static roster in `apps/web/constants/about.ts`).
- **Nothing is hard-deleted**, anywhere in the system. And **every record says who created and last changed it** (see [Audit trail](#audit-trail-every-crud-table)).

## Who can do what

"Admins" below means `SUPER_ADMIN` and `ADMIN`.

| Action                                           | Super Admin | Admin                   | Team Member |
| ------------------------------------------------ | ----------- | ----------------------- | ----------- |
| Sign in                                          | ✓           | ✓                       | ✓           |
| Edit **own** profile (name, photo, social links) | ✓           | ✓                       | ✓           |
| See the Team list                                | ✓           | ✓                       | —           |
| Add a user (Admin or Team Member) by email       | ✓           | ✓                       | —           |
| Change someone's role (Admin ↔ Team Member)      | ✓           | ✓ (not the Super Admin) | —           |
| Set someone's designation                        | ✓           | ✓                       | —           |
| Website settings (show on About, founder, order) | ✓           | ✓                       | —           |
| Suspend / reactivate                             | ✓           | ✓ (not the Super Admin) | —           |
| Remove (only if they've never signed in)         | ✓           | ✓ (not the Super Admin) | —           |
| Grant feature permissions to a Team Member       | ✓           | ✓                       | —           |
| Use a content feature (Projects, Articles, …)    | ✓ all       | ✓ all                   | per grant   |

Guards that apply to everyone, Super Admin included:

- **Nobody acts on themselves** — you can't suspend, remove, change the role of, or change permissions for your own account. Stops an admin locking themselves (or the last other admin) out by accident.
- **The Super Admin is untouchable** through the dashboard — no role change, suspension or removal. Changing who the Super Admin is happens only by changing `SUPER_ADMIN_EMAIL` and re-running the seed, which promotes that user and demotes the previous one to Admin.
- **Designation is admin-set.** A Team Member can't change their own designation, even on their profile page.

## Account lifecycle

| State         | How it gets there                                       | Can sign in | Shown in Team list      |
| ------------- | ------------------------------------------------------- | ----------- | ----------------------- |
| **Invited**   | An admin adds the email                                 | ✓           | ✓ ("Not signed in yet") |
| **Active**    | First Google sign-in (sets `first_login_at`)            | ✓           | ✓                       |
| **Suspended** | An admin suspends them                                  | —           | ✓ (badge)               |
| **Removed**   | An admin removes them — **only possible while Invited** | —           | — (soft-deleted)        |

- **Remove vs suspend.** Someone who has signed in may have created or changed records, so they can't be removed — only suspended. Someone invited but never signed in left no trace, so removing them is safe (still a soft delete).
- **Suspended means locked out everywhere, immediately.** Sign-in is refused, and every request from an existing session is refused on its next call (the API re-reads the user each request). Their records keep their authorship.
- **Re-adding a removed email** restores that same row (cleared `deleted_at`, the new role and designation) rather than creating a duplicate.
- **Reactivating** a suspended user returns them to Active with their permissions intact.

## Feature permissions (Team Members)

Admins always have every permission; grants matter only for `TEAM_MEMBER`.

- Per **feature** × **action**. Features are the content CRUDs as they ship: `PROJECTS`, `ARTICLES`, `SERVICES`, `TESTIMONIALS`, `CONTACT_MESSAGES`. Team management itself is admin-only and never grantable.
- Actions: `CREATE`, `VIEW`, `EDIT`, `DELETE` (delete is always a soft delete).
- **Create, Edit and Delete imply View** — granting any of them grants View; removing View removes the rest. A checkbox grid never ends up in a state where someone can edit what they can't see.
- Edited by admins from a **drawer** on the Team list (feature rows × action columns), saved as a whole.
- The dashboard hides what a user can't use (sidebar entries, buttons) — but **the API enforces every grant itself**; hiding is only for convenience.

## Profile & website

| Field                       | Who sets it | Notes                                                                       |
| --------------------------- | ----------- | --------------------------------------------------------------------------- |
| First name, last name       | The user    | Prefilled from Google on first sign-in if still empty                       |
| Photo                       | The user    | Uploaded via the shared media library; Google's avatar is the fallback      |
| LinkedIn, X, portfolio URLs | The user    | All optional; validated as URLs. Matches the About page's `TeamMemberLinks` |
| Designation                 | Admins      | Free text, e.g. "Co-founder, CTO"                                           |
| Show on website             | Admins      | Off by default                                                              |
| Founder                     | Admins      | The About page's founder badge                                              |
| Display order               | Admins      | Order on the About page                                                     |

The public API exposes **only** users who are Active, not removed, and shown on the website — and only their public profile (name, designation, photo, links, founder). Never email, role or permissions.

### Photos

- **Limit: 500 KB per upload** (decided 2026-10-02). Larger files are refused with a clear message.
- Uploads go through `packages/media-library`: the bytes are decoded to prove they're an image (JPEG, PNG, WebP, AVIF or GIF — the file name and claimed type don't count), resized and re-encoded as WebP — typically 15–40 KB at the default size — which also strips EXIF data such as location.
- **Output size is set per upload, 512×512 `cover` by default.** The dashboard uploader takes `width`, `height` and `fit` (`cover` crops to fill, `inside` keeps the whole image) as props and sends them with the file; each falls back to the default on its own. The API accepts 64–2048 px and rejects anything else, so a request can't make the server produce an enormous image.
- **Stored on Cloudinary (free tier)** and served from its CDN. The processed file is what's uploaded, so Cloudinary stores and serves only the small final image and no transformation credits are spent. `MEDIA_PROVIDER=local` keeps files on the API server instead (served at `/api/media`) for offline development.
- The upload happens before the database transaction that records it — a slow upload can't hold a transaction open.
- Each upload is a `media_files` row (purpose `AVATAR`, provider, storage key, author, size, dimensions). Replacing or clearing a photo **retires** the old row (`deleted_at`); the file itself is never destroyed — nothing is hard-deleted.

## Audit trail (every CRUD table)

A project-wide rule from 2026-10-02, recorded in `.claude/rules/conventions.md`:

- **No hard deletes.** Every content table has `deleted_at` + `deleted_by_id`; "delete" sets them. Lists and the public API exclude deleted rows.
- **Authorship.** Every content table has `created_by_id` and `updated_by_id` → `users.id`, set by the API from the signed-in user — never from the request body.
- The dashboard shows "Created by … · Updated by …" on each record.
- `users` itself follows the same rule (`created_by_id` is null only for the seeded Super Admin).

## Data

### `users`

| Column                                                               | Type                         | Notes                                         |
| -------------------------------------------------------------------- | ---------------------------- | --------------------------------------------- |
| `id`                                                                 | int PK                       | Internal only                                 |
| `uuid`                                                               | uuid v7, unique              | Public id                                     |
| `email`                                                              | text, unique                 | Lower-cased; the sign-in key                  |
| `role`                                                               | enum `UserRole`              | `SUPER_ADMIN` / `ADMIN` / `TEAM_MEMBER`       |
| `status`                                                             | enum `UserStatus`            | `ACTIVE` / `SUSPENDED`                        |
| `first_name`, `last_name`                                            | text, null                   |                                               |
| `designation`                                                        | text, null                   |                                               |
| `photo_id`                                                           | int → `media_files.id`, null | Uploaded photo (stored via the media library) |
| `google_avatar_url`                                                  | text, null                   | Refreshed each sign-in; the fallback          |
| `linkedin_url`, `x_url`, `portfolio_url`                             | text, null                   |                                               |
| `show_on_website`, `is_founder`                                      | bool                         | Default `false`                               |
| `display_order`                                                      | int                          | Default `0`                                   |
| `google_sub`                                                         | text, unique, null           | Linked on first sign-in                       |
| `first_login_at`, `last_login_at`                                    | timestamptz, null            | `first_login_at` null ⇒ Invited (removable)   |
| `suspended_at`                                                       | timestamptz, null            | With `suspended_by_id`                        |
| `created_at`, `updated_at`, `deleted_at`                             | timestamptz                  |                                               |
| `created_by_id`, `updated_by_id`, `deleted_by_id`, `suspended_by_id` | int → `users.id`, null       | Audit                                         |

### `user_permissions`

One row per Team Member × feature: `user_id`, `feature` (enum `Feature`), `can_create`, `can_view`, `can_edit`, `can_delete`, plus `updated_by_id` and timestamps. Unique on (`user_id`, `feature`). No row ⇒ no access.

## API

| Endpoint                                       | Who       | Purpose                                              |
| ---------------------------------------------- | --------- | ---------------------------------------------------- |
| `GET /api/auth/me`                             | Signed in | Now also returns `role` and `permissions`            |
| `GET /api/me/profile`, `PATCH /api/me/profile` | Signed in | Own profile                                          |
| `POST /api/me/photo`, `DELETE /api/me/photo`   | Signed in | Upload (multipart `file`, ≤ 8 MB) or clear own photo |
| `GET /api/users`                               | Admins    | Team list (search, role/status filters)              |
| `GET /api/users/:uuid`                         | Admins    | One team member                                      |
| `POST /api/users`                              | Admins    | Add by email + role (+ designation)                  |
| `PATCH /api/users/:uuid`                       | Admins    | Role, designation, website settings                  |
| `POST /api/users/:uuid/suspend`, `/reactivate` | Admins    |                                                      |
| `DELETE /api/users/:uuid`                      | Admins    | Soft remove — `409` if they've ever signed in        |
| `PUT /api/users/:uuid/permissions`             | Admins    | Replace a Team Member's whole permission grid        |
| `GET /api/public/team`                         | Public    | About page team section                              |

## Dashboard

- **Team** (admins only) — table: photo, name, email, role, designation, status (Invited / Active / Suspended), last sign-in. Actions per row: edit (role, designation, website settings), permissions drawer (Team Members only), suspend/reactivate, remove (only while Invited).
- **Add member** dialog — email, role, designation.
- **Permissions drawer** — feature × action checkbox grid with the "implies View" rule applied live.
- **My profile** (`/profile`, avatar menu and sidebar) — every user: name, photo upload, social links; email, role and designation shown read-only. Photos use the dashboard's `ImageUploader` (`width` / `height` / `fit` props, default 512×512 cover), which refuses files over 500 KB before uploading.
- **Sidebar** shows only what the signed-in user may use: Team only for admins; each content feature only with at least View permission (`feature` on a nav item). My profile is always there.
