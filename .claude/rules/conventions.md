# Project Conventions

> Referenced from root `CLAUDE.md`. Applies to `apps/web`, `apps/dashboard`, `apps/api`, and shared `packages/*`.

## Apps

- **web** — Next.js app for the public website (landing pages) and/or user-facing product.
- **dashboard** — Next.js app for admin/internal tooling.
- **api** — Node.js backend (Express + TypeScript, dev server on port 3500). Suggested stack to fill in as the project grows:
    - Express.js for routing.
    - A relational database (e.g. PostgreSQL) via an ORM (e.g. Prisma), if the project needs persistence.
    - Redis for caching and session management, if needed.
    - WebSockets for real-time communication, if needed.
    - JWT (or your auth provider of choice) for authentication.
    - A pluggable payment-provider interface, if the project takes payments.
    - Local disk storage for files to start, with a pluggable storage-provider interface so S3/CDN can be swapped in later without reworking calling code (see `packages/media-library` note below).
    - Swagger for API documentation.
    - Sentry (or similar) for error monitoring.

Treat the bullet list above as a starting menu, not a mandate — replace anything that doesn't fit the project.

## Packages

Packages are created per feature/functionality; each has its own `src/` folder with an `index.ts` entry point. Add new shared packages here as they're scaffolded, following the same pattern as `packages/ui`:

- **`packages/api-services`** _(example — scaffold when needed)_ — everything API-related shared across apps:
    - `src/services` — the common `apiService` fetcher function and all API functions (e.g. `getPostService`).
    - `src/models` — API payload, response, and query-param types.
    - `src/enums` — API-related enums and parameter options.
- **`packages/utils`** _(example)_ — common utility functions shared across apps (debounce, throttle, date helpers, etc.).
- **`packages/media-library`** _(example)_ — shared file/image upload and picker, built as a pluggable storage-provider interface (local disk to start, S3 or another provider later) so calling code doesn't need to change when the backend changes.
- **`packages/text-editor`** _(example)_ — shared rich-text editor component (e.g. Tiptap), JSON output, used for all rich text fields across apps.
- **`packages/payments`** _(example)_ — payment handling, built as a pluggable provider interface so a new gateway can be added later without reworking calling code.

> When any package above (or a new one) is scaffolded, also add it to the Architecture section of root `CLAUDE.md`.

## Code style

- Never use `any`.
- Prefer custom hooks/components over large monolithic components.
- Keep all `useEffect` calls grouped together in a component for readability — avoid scattering them.
- Use `memo`, `useMemo`, `useCallback` when it meaningfully helps.
- Avoid hardcoded strings — use enums/constants instead.
- Remove dead/commented-out code; use `// TODO:` for anything intentionally deferred.
- Use Next.js `<Link>` instead of `<a>` for internal routing.
- Use `<Image>` instead of `<img>`.
- Never add a wrapper `<div>` just for grouping or to attach a `key` — use `<></>` for grouping, and `<Fragment key={...}>` when a `key` is needed.
- Server Components by default; add `"use client"` only when the component needs interactivity, browser APIs, or client-side hooks. Public pages should be server-rendered (SSR/SSG) where possible.
- Use dynamic imports to lazy-load components when it helps initial load.
- Named exports everywhere, except where Next.js requires a default export (pages, layouts, route handlers, config files).
- Avoid `!important` in Tailwind/CSS.

## Design

- Public-facing landing page design (`apps/web`) uses the `frontend-design` skill — invoke it for any new page or section design, not just the first one.
- Primary visual inspiration reference: [daynight.co.uk](https://www.daynight.co.uk/).

## Import order

Enforced by the `import/order` ESLint rule. Groups, separated by a blank line, each sorted alphabetically:

1. External packages (including Node built-ins).
2. `@`-aliased imports (`@workspace/*`, `@/*`).
3. Relative imports (`../`, `./`).

## Types, models & enums

| Content                                     | Location                                             |
| ------------------------------------------- | ---------------------------------------------------- |
| API payloads, responses, query params       | `packages/api-services/src/models` (if scaffolded)   |
| API functions & common fetcher              | `packages/api-services/src/services` (if scaffolded) |
| API-related enums & param options           | `packages/api-services/src/enums` (if scaffolded)    |
| Component props / utility / other app types | `<app>/types` (root of `web` / `dashboard`)          |
| App-level enums                             | `<app>/enums` (root of `web` / `dashboard`)          |

## Folder structure (per app: `web`, `dashboard`)

- `types/` — types & interfaces (app root)
- `enums/` — app-level enums (app root)
- `constants/` — static content as constants (app root)
- `configs/` — static arrays/objects: sidebar menus, top menus, footer menus, site title, social links, contact info
- `hooks/` — custom hooks
- `components/`
    - `features/<feature>` — feature-specific components (e.g. `features/home`)
    - `snippets/<name>` — reusable components (e.g. `snippets/header`)
- `contexts/` — app/feature-level contexts and providers
- `schemas/` — Zod validation/transformation schemas
- `utils/` — app-level utility functions

## Folder structure (`apps/api`)

All source lives in `src/` — entry point `src/index.ts`, Express app setup in `src/app.ts`:

- `configs/` — env loading and app configuration
- `constants/` — static content as constants
- `controllers/` — request handlers (thin — delegate to services)
- `enums/` — backend enums
- `middlewares/` — Express middleware (auth, error handling, validation)
- `routes/` — route definitions, mounted under `/api`
- `schemas/` — Zod validation schemas
- `services/` — business logic
- `sockets/` — WebSocket handlers
- `types/` — types & interfaces
- `utils/` — utility functions

Add a `prisma/` folder at the app root once a database layer is introduced.

## Shared UI package (`packages/ui`)

- Components → `packages/ui/src/components`
- Hooks → `packages/ui/src/hooks`
- Utils → `packages/ui/src/lib`

## Naming conventions

| Type                    | Convention                 | Example                                     |
| ----------------------- | -------------------------- | ------------------------------------------- |
| Folders                 | lowercase, hyphenated      | `blog-details`, `user-profile`              |
| Files                   | lowercase, hyphenated      | `blog-details.tsx`, `user-profile.tsx`      |
| Components              | PascalCase                 | `BlogDetails`, `UserProfile`                |
| Hooks                   | camelCase, `use` prefix    | `useBlogDetails`, `useUserProfile`          |
| Contexts & Providers    | PascalCase                 | `BlogDetailsContext`, `UserProfileProvider` |
| Schemas                 | camelCase, `Schema` suffix | `blogDetailsSchema`, `userProfileSchema`    |
| Utils & functions       | camelCase                  | `formatBlogDate`, `getUserInitials`         |
| Types & interfaces      | PascalCase                 | `BlogDetails`, `UserProfileProps`           |
| Enum name               | PascalCase, singular       | `PostStatus`, `UserRole`                    |
| Enum keys               | UPPER_SNAKE_CASE           | `DRAFT`, `PUBLISHED`                        |
| Constants / static data | camelCase                  | `socialLinks`, `footerMenuItems`            |

TypeScript enums that mirror a database enum must use the same keys/values as the database (e.g. `PostStatus.DRAFT = 'DRAFT'`).

## Environment variables

- UPPER_SNAKE_CASE names.
- Client-exposed variables must use the `NEXT_PUBLIC_` prefix; secrets must never have it.
- Every variable is documented in the app's `.env.example`.

## Database naming conventions

Use snake_case only — no hyphens (Postgres and most other RDBMSes require quoting identifiers with hyphens, and it breaks most ORM codegen).

- Table names: lowercase snake_case, plural — e.g. `blogs`, `user_profiles`.
- Column names: lowercase snake_case — e.g. `blog_details`, `user_profile`.
- Relationship (foreign key) columns: `<singular_table>_id` — e.g. `blog_id`, `user_profile_id`.
- Enum values: UPPER_SNAKE_CASE — e.g. `DRAFT`, `PUBLISHED`.

## Cross-feature architectural conventions

These apply project-wide — worth deciding early, before the first few features get built:

- **Never expose internal integer primary keys.** Give every table an internal auto-increment integer PK (for fast joins/index performance) plus a separate indexed `uuid` column (consider UUIDv7 for better index locality than random UUIDv4), generated on insert. Only the `uuid` is ever exposed in API responses or URLs.
- **Every publicly addressable entity gets a slug.** Backend-generated, unique, editable later.
- **Prefer computing visibility at read time over background jobs for scheduled visibility** — e.g. `status == PUBLISHED AND (scheduled_at IS NULL OR scheduled_at <= now())` — for scheduled publish, registration-open countdowns, and similar timing logic. Only introduce an actual job/worker when a real side effect is required (e.g. sending a notification email at that moment).
- **Snapshot associations that must preserve history.** When an association can change over time but past state must remain accurate, model it as a dedicated snapshot/junction record tied to that point in time — not a live foreign key that silently rewrites history when the underlying data changes.
- **All file/image uploads go through one shared package** (e.g. `packages/media-library`) — no feature implements its own one-off upload handling.
- **All rich text fields use one shared editor package** (e.g. `packages/text-editor`). Content is persisted as JSON, never raw HTML.
- **Entity deletion policy is feature-specific — don't assume one universal rule.** Some entities should block deletion while in use; others should allow deletion and simply detach from referencing records instead. Decide per entity, and document the decision where the entity's requirements live.

## Git conventions

- Work on feature branches; never commit directly to `master` or `dev` (enforced by git hooks).
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:` — a short single-line summary.

## Testing

Not set up yet — define conventions here once a test framework is added.
