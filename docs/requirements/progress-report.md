# Requirements — Progress Report

Master index and tracker for the Flizz web project: public site pages, admin CRUD features, and the development plan/stage order. Update this file's status columns as work lands — it's the single place to check "what's done, what's next."

## Pages — public site (`apps/web`)

| #   | Page                      | Notes doc                                | Route                                      | Static build stage | Data source                                                                                    | Status                                                                                  |
| --- | ------------------------- | ---------------------------------------- | ------------------------------------------ | ------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | Home                      | [home-page.md](home-page.md)             | `/`                                        | Stage 2            | Portfolio strip, hero facts and services teaser from the API; testimonials and the rest static | Built — pending PM content                                                              |
| 2   | About                     | [about-page.md](about-page.md)           | `/about`                                   | Stage 3            | Team section from the API (E4); timeline and figures static                                    | Built — pending PM content                                                              |
| 3   | Services (list)           | [services-pages.md](services-pages.md)   | `/services`                                | Stage 4            | API (S7)                                                                                       | Live data — pending PM content                                                          |
| 4   | Single Service detail     | [services-pages.md](services-pages.md)   | `/services/[slug]`                         | Stage 4            | API (S7)                                                                                       | Live data — pending PM content                                                          |
| 5   | Contact Us                | [contact-page.md](contact-page.md)       | `/contact`                                 | Stage 5            | Form posts to the API (CM6); Calendly embed (CM8)                                              | Built — goes live with CM9 env vars                                                     |
| 6   | Portfolio/Projects (list) | [portfolio-pages.md](portfolio-pages.md) | `/portfolio`                               | Stage 6            | API (E1)                                                                                       | Live data — pending PM content                                                          |
| 7   | Single Project detail     | [portfolio-pages.md](portfolio-pages.md) | `/portfolio/[slug]`                        | Stage 6            | API (E1)                                                                                       | Live data — pending PM content                                                          |
| 8   | Articles (list)           | [articles-pages.md](articles-pages.md)   | `/articles`                                | Stage 7            | Static constants until Phase AR                                                                | Built — pending PM content                                                              |
| 9   | Single Article detail     | [articles-pages.md](articles-pages.md)   | `/articles/[slug]`                         | Stage 7            | Static constants until Phase AR                                                                | Built — pending PM content                                                              |
| 10  | Case Studies (list)       | [portfolio-pages.md](portfolio-pages.md) | —                                          | —                  | —                                                                                              | In progress — Team, Projects, Services, Contact, Testimonials done; Articles (AR) to go |
| 11  | Single Case Study detail  | [portfolio-pages.md](portfolio-pages.md) | —                                          | —                  | —                                                                                              | In progress — `packages/api-services` covers auth, team, projects, services and contact |
| 12  | Privacy Policy & Terms    | [legal-pages.md](legal-pages.md)         | `/privacy-policy`, `/terms-and-conditions` | —                  | Static                                                                                         | In progress — Team, Projects, Services, Contact inbox done                              |

Each page's requirements doc is written just before its static-design stage starts — no point speccing pages we're 5 stages away from.

**"Built — pending PM content"** means the page is designed, implemented, and passing typecheck/lint, but still renders placeholder copy or assets that the PM has to replace. **"Live data — pending PM content"** means the page reads from the API and the PM replaces the placeholders in the dashboard rather than in code. See [Open items for PM](#open-items-for-pm) below.

## Admin dashboard CRUD features (`apps/dashboard`)

| Feature            | Notes                                                                                                                                                                                                                                     | Status                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Team & permissions | Users, roles, per-feature permissions and My Profile — [users-and-permissions.md](users-and-permissions.md).                                                                                                                              | Done 2026-10-02 (Phase U)                                                     |
| Portfolio/Projects | Powers the Portfolio list, Single Project detail, and the Home page Portfolio strip — [projects-crud.md](projects-crud.md).                                                                                                               | Done 2026-10-02 (Phases C–E)                                                  |
| Services           | Powers the Services list, Single Service detail, and the Home page Services teaser. Each project links to one service — [services-crud.md](services-crud.md).                                                                             | Done 2026-10-04 (Phase S), in production                                      |
| Contact Us         | Stores/manages Contact Us form submissions. Schema migrated (`contact_messages`).                                                                                                                                                         | Done 2026-10-04 (Phase CM) — inbox at `/messages`; production release pending |
| Book a Call        | Calendly embed on `/contact` (and any CTA that links to it). **No table** — Calendly holds the bookings and sends the notifications. Add a `call_bookings` table fed by Calendly webhooks only if the dashboard ever needs to list calls. | Built 2026-10-04 (CM8) — on once `NEXT_PUBLIC_CALENDLY_URL` is set            |
| Testimonial        | Home page section only — no dedicated public page or list. Schema migrated (`testimonials`) — [testimonials-crud.md](testimonials-crud.md).                                                                                               | Built 2026-10-06 — production seed pending (T6)                               |
| Articles           | Powers the Articles list and Single Article detail pages. Renamed from Blog on 2026-09-01 to match the shipped nav. Schema migrated (`articles`).                                                                                         | Not started — Phase AR                                                        |
| Analytics          | Read-only GA4 and Meta Pixel reports inside the dashboard, fetched server-side by the API. No content table; needs an `ANALYTICS` feature permission (View only).                                                                         | Not started — Phase AN                                                        |
| Case Studies       | **Dropped 2026-09-03** — a case study is a project shown in full, not a separate record. The Projects CRUD covers both.                                                                                                                   | —                                                                             |

## Development plan (execution order)

Work proceeds in this order. Update status inline as we move through them. Since 2026-10-02 Stages 10–13 run as one vertical slice per feature (see the deviations below), so their status is tracked per slice.

| #   | Stage                                                                                               | Status                                                                                                                                                                                       |
| --- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ~~Read & document PM's Google Sheet content~~                                                       | Done                                                                                                                                                                                         |
| 2   | ~~Static Home page — design + build with static/placeholder data, launch-ready~~                    | Built — pending PM content                                                                                                                                                                   |
| 3   | ~~Static About page — design + build~~                                                              | Built — pending PM content                                                                                                                                                                   |
| 4   | ~~Static Services + Single Service pages — design + build~~                                         | Built — pending PM content                                                                                                                                                                   |
| 5   | ~~Static Contact Us page — design + build~~                                                         | Built early — pending PM                                                                                                                                                                     |
| 6   | ~~Static Portfolio/Project pages — design + build~~                                                 | Built — pending PM content                                                                                                                                                                   |
| 7   | ~~Static Articles pages — design + build~~ (Case Studies dropped)                                   | Built — pending PM content                                                                                                                                                                   |
| 8   | ~~Database design — schema for all CRUD features~~                                                  | Done 2026-10-03 — articles, services, testimonials, contact messages, `projects.service_id`; in production since the Phase S release (2026-10-04). Article comments/reactions/views deferred |
| 9   | ~~Admin dashboard base structure, design, and authentication~~                                      | Done 2026-10-02 — Google sign-in, dashboard shell, users, roles & permissions                                                                                                                |
| 10  | Build APIs — feature by feature                                                                     | In progress — Team, Projects, Services, Contact, Testimonials done; Articles (AR) to go                                                                                                      |
| 11  | Frontend common API service functions, Zod schemas, models, enums & types (request/response/params) | In progress — `packages/api-services` covers auth, team, projects, services, contact and testimonials                                                                                        |
| 12  | Admin dashboard CRUD feature design & API integration                                               | In progress — Team, Projects, Services done                                                                                                                                                  |
| 13  | Landing page API integration — replace static data with live data across all public pages           | In progress — Portfolio, Services, Home strip/teaser, About team, the contact form and Testimonials live (Testimonials pending the T6 release); Articles to go                               |
| 14  | Testing & bug fixing — full feature + design pass                                                   | Started — Playwright smoke suite in `apps/e2e` (L14); device/accessibility pass (L15) pending                                                                                                |

### Deviations from the plan

- **Stage 5 (Contact Us) was built before Stages 3 and 4.** It was designed directly against the Home page's cinematic style while that visual language was fresh, rather than waiting its turn. Both have since been built.
- **Contact Us shipped without a requirements doc.** The original rule — write each page's doc just before its stage — was skipped here. Every stage since has had its doc written or settled first, so treat that as the standing practice; Contact Us was backfilled in CM1 ([contact-page.md](contact-page.md)).
- **Stage 7 was built before Stage 6.** Articles shipped 2026-09-01, Portfolio 2026-09-03.
- **Case Studies were dropped, not deferred.** The PM settled on 2026-09-03 that a case study is a project shown in full — so `/portfolio/[slug]` is the case study, and Stage 7's second half disappears rather than moving.
- The original "each stage starts only once the prior one is agreed/done" rule no longer matches how work is actually being sequenced, so it has been dropped from the intro above.
- **Stages 8–13 run as a vertical slice per feature, Portfolio first** (decided 2026-10-02). Rather than designing every table, then every API, then every screen, each feature goes database → API → dashboard → landing before the next starts. Auth and the dashboard shell come first because every feature needs them.

## Current work — dashboard, Google sign-in & Portfolio slice

Branch: `feat/dashboard-auth-portfolio`. Tasks run one at a time, in order; update the status as each lands. Phases A–B done 2026-10-02 ([dashboard-auth.md](dashboard-auth.md)). Phase U added the same day when roles and permissions were specified ([users-and-permissions.md](users-and-permissions.md)). **Review checkpoints after U5 (API) and U10 (screens).**

### Phase A — Database foundations (Stage 8)

| #   | Task                                                                                                                                                                      | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| A1  | Requirements doc for the dashboard & auth — scope, sign-in flow, allowlist, session, env vars                                                                             | Done   |
| A2  | `apps/api`: Zod-validated env config, consistent JSON error responses, request-validation middleware                                                                      | Done   |
| A3  | `apps/api`: Prisma + PostgreSQL wired up (`prisma/` at the app root, `DATABASE_URL`, `.env.example`), UUIDv7 helper for public ids                                        | Done   |
| A4  | `admins` table — internal int PK + public `uuid`, `email` (unique), `name`, `avatar_url`, `google_sub`, `last_login_at`, timestamps; first migration + seed from env list | Done   |

### Phase B — Google sign-in & dashboard shell (Stage 9)

| #   | Task                                                                                                                                                    | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| B1  | API auth: `POST /api/auth/google` (verify Google ID token, check allowlist, set `httpOnly` session cookie), `GET /api/auth/me`, `POST /api/auth/logout` | Done   |
| B2  | API: `requireAuth` middleware; CORS limited to the public site (the dashboard reaches the API through its own `/api` rewrite)                           | Done   |
| B3  | Dashboard: `/login` page with the Google sign-in button; clear error states (not on the allowlist, Google failure)                                      | Done   |
| B4  | Dashboard: route protection — signed-out visitors go to `/login`, signed-in ones skip it                                                                | Done   |
| B5  | Dashboard shell: sidebar (Overview, Projects, …), header with the admin's avatar and sign-out, Overview placeholder                                     | Done   |
| B6  | End-to-end check of sign-in / sign-out / blocked email; docs updated — **review checkpoint**                                                            | Done   |

### Phase U — Users, roles & permissions (Stage 9)

| #   | Task                                                                                                                                                                 | Status |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| U1  | Requirements doc — roles, lifecycle, permissions, profile, audit rule; conventions updated (no hard deletes, authorship on every table)                              | Done   |
| U2  | Replace `admins` with `users` (role, status, profile, website fields, audit columns) + `user_permissions`; migration; seed the Super Admin from `SUPER_ADMIN_EMAIL`  | Done   |
| U3  | Auth on `users`: sign-in refuses removed/suspended; session re-checks status each request; `/auth/me` returns role + permissions                                     | Done   |
| U4  | API authorization: `requireAdmin`, `requirePermission(feature, action)`, and the guards (no self-actions, Super Admin untouchable)                                   | Done   |
| U5  | Team API: list, add, update (role/designation/website), suspend/reactivate, remove-if-invited, replace permissions; own profile GET/PATCH — **review checkpoint**    | Done   |
| U6  | `packages/media-library`: storage-provider interface + Cloudinary (default) and local-disk providers; 500 KB uploads; profile photo endpoints (project images later) | Done   |
| U7  | Dashboard Team page — table, status badges, Add member dialog                                                                                                        | Done   |
| U8  | Dashboard user actions — edit (role, designation, website settings), suspend/reactivate, remove                                                                      | Done   |
| U9  | Dashboard permissions drawer — feature × action grid with "implies View"                                                                                             | Done   |
| U10 | Dashboard My Profile (name, photo upload, social links); sidebar shows only what the user may use — **review checkpoint**                                            | Done   |

### Phase C — Portfolio backend (Stage 10)

| #   | Task                                                                                                                                                                        | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| C1  | Requirements doc for the Projects CRUD — [projects-crud.md](projects-crud.md): fields, validation, draft/published + publish date, featured & home flags, gallery, deletion | Done   |
| C2  | `projects` (results as JSONB, lists as `text[]`) + `project_images` schema matching the `Project` / `ProjectDetail` contract; migration; seed from `constants/portfolio.ts` | Done   |
| C3  | Project images through the media library — cover upload/clear, gallery add/caption/reorder/retire                                                                           | Done   |
| C4  | Projects API: public list/detail (published only) and admin CRUD, Zod-validated                                                                                             | Done   |

### Phase D — Shared API layer & dashboard screens (Stages 11–12)

| #   | Task                                                                                                                       | Status |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ------ |
| D1  | `packages/api-services`: common fetcher, auth + projects models, enums and service functions                               | Done   |
| D2  | Dashboard Projects list — table, search, sector filter, featured toggle                                                    | Done   |
| D3  | Dashboard Project form — basics, results, case-study lists, stack, quote, cover + gallery, publishing; delete with confirm | Done   |

### Phase E — Landing integration (Stage 13)

| #   | Task                                                                                                                             | Status |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| E1  | `/portfolio` and `/portfolio/[slug]` read from the API, statically generated and revalidated on edit                             | Done   |
| E2  | Home portfolio strip reads from the API                                                                                          | Done   |
| E3  | Retire the static roster (kept only as seed data); docs updated                                                                  | Done   |
| E4  | About page team section reads public team members from the API (`show_on_website`)                                               | Done   |
| E5  | Gallery section on `/portfolio/[slug]` — designed with the `frontend-design` skill; shown only when a project has gallery images | Done   |

## Next work — remaining CRUD slices

Planned 2026-10-03. The schema for all four features is done and migrated locally (Stage 8, migration `20261003094516_add_content_tables`). Each feature is built as a vertical slice, like Portfolio: requirements → API → shared API layer → dashboard → landing → production release. Run the work in this order, one task at a time, and update the status as each lands.

0. **Phase L launch blockers (L1–L8)** come first, decided 2026-10-03. Phase L's "first weeks" items follow; L9 (API hardening) must land before CM2.
1. **Services**: projects depend on it (`projects.service_id`).
2. **Contact Us + Book a Call**: the form and the scheduler are blocking launch.
3. **Testimonials**: small, home page only.
4. **Articles**: the largest, because it needs a body editor.

Every slice ends with a production release that follows the checklist in [apps/api/README.md](../../apps/api/README.md#production-database).

### Phase L — Launch readiness

From the pre-launch review on 2026-10-03. **Paused 2026-10-04**: the remaining tasks wait on PM, owner and developer decisions; Phase L resumes once those are in hand. **Owner**: _Dev_ is code work (Claude or a developer); _Owner_ is an account, legal or business task; _PM_ is content. A dev task that needs the owner's input says so.

#### Blockers: before anyone outside the team sees the site

| #   | Task                                                                                                                                                                                                                                                                                                        | Owner       | Status                                                                                                                                                                                |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | `/privacy-policy` and `/terms-and-conditions` pages (the footer links 404 today). The privacy policy must name every processor (Crisp, Calendly, Google Analytics, Meta, Cloudflare Turnstile, Cloudinary, hosting) and state how long contact messages are kept. Owner supplies or approves the legal text | Dev + Owner | Drafted 2026-10-03; 6 owner decisions pending in [legal-pages.md](legal-pages.md#open-decisions--owner-to-answer)                                                                     |
| L2  | Cookie consent banner: accept/reject with equal weight, choice stored, "Cookie settings" footer link; GA, Pixel (and Crisp, if it's classed as non-essential) load only after consent. Mounted outside the ScrollSmoother wrapper. See [analytics.md](../guides/analytics.md)                               | Dev         | Done 2026-10-04: banner, cookie, footer link and `<WithConsent>`. GA4 and Pixel built 2026-10-06; live once their IDs are set in Vercel                                               |
| L3  | Real social links in `configs/footer.ts` (now `https://linkedin.com` / `https://twitter.com`) and the About team profile URLs. Owner supplies the URLs                                                                                                                                                      | Dev + Owner | Not started                                                                                                                                                                           |
| L4  | Branded `not-found.tsx` (real 404 status) and `error.tsx` / `global-error.tsx` in web and dashboard                                                                                                                                                                                                         | Dev         | Done 2026-10-04                                                                                                                                                                       |
| L5  | Replace every invented figure: project results, service engagement durations, About timeline dates and published stats — or remove them                                                                                                                                                                     | PM          | Not started                                                                                                                                                                           |
| L6  | Hosting plan allows commercial use: Vercel Pro, or the move to our own server first                                                                                                                                                                                                                         | Owner       | Not started                                                                                                                                                                           |
| L7  | Google OAuth consent screen publishing status → "In production" (in "Testing", only listed test users can sign in)                                                                                                                                                                                          | Owner       | Not started                                                                                                                                                                           |
| L8  | Contact notifications are required: CM4 is no longer optional (an email or Slack alert on each new message). Pick the sending provider and set up SPF, DKIM and DMARC for the domain                                                                                                                        | Owner + Dev | Provider decided 2026-10-05: Slack + Gmail SMTP (free, no DNS setup). Owner: the Slack webhook and the Gmail sender account — see [contact-page.md](contact-page.md#notification-cm4) |

#### First weeks: right after the blockers, alongside the slices

| #   | Task                                                                                                                                                                                                  | Owner       | Status                                                                                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L9  | API hardening: security headers (`helmet`), rate limiting (stricter on public writes and auth), `trust proxy` set so the visitor's IP is seen. **Must land before CM2**                               | Dev         | Done 2026-10-04                                                                                                                                                                          |
| L10 | Monitoring: error tracking (for example Sentry) in all three apps, plus uptime checks on `/api/health` and the home page with alerts                                                                  | Dev + Owner | Code done 2026-10-04: Sentry in web, dashboard and API, off until a DSN is set. Owner: Sentry projects, DSNs and uptime checks — see [deployment.md](../guides/deployment.md#monitoring) |
| L11 | Database safety: check Neon's backup/restore window; give Vercel preview deployments their own Neon branch so previews never write to production                                                      | Owner + Dev | Not started                                                                                                                                                                              |
| L12 | Domain and email: `hello@flizz.io` receives mail; `www` and the bare domain redirect to one canonical host; `NEXT_PUBLIC_SITE_URL` matches it                                                         | Owner       | Not started                                                                                                                                                                              |
| L13 | Dashboard access recovery: a second Admin, so losing the Super Admin's Google account doesn't lock everyone out                                                                                       | Owner       | Not started                                                                                                                                                                              |
| L14 | Smoke tests: a written pre-launch checklist (sign-in, publish a project, contact form end to end, test booking) and Playwright tests for the critical paths; close C4's pending live end-to-end check | Dev         | Code done 2026-10-04 — `apps/e2e` Playwright suite and checklist in [smoke-tests.md](../guides/smoke-tests.md); contact form → inbox covered since CM9; booking stays manual             |
| L15 | Device and accessibility pass: real iOS Safari and a low-end Android phone (GSAP, WebGL), keyboard navigation, reduced motion. Prompts in [quality-audits.md](../guides/quality-audits.md)            | Dev         | Not started                                                                                                                                                                              |
| L16 | Engineering cleanup (see the section near the end of this file): remove the `/home-v2` route; keep `@workspace/theme-lab` but hide it behind `NEXT_PUBLIC_ENABLE_THEME_LAB`                           | Dev         | Done 2026-10-04; Theme Lab restored 2026-10-05 as an env-gated tool (was removed by mistake)                                                                                             |
| L17 | Review free-tier limits (Cloudinary, Neon, Crisp, Calendly) against expected traffic                                                                                                                  | Owner       | Not started                                                                                                                                                                              |

### Phase S — Services

| #   | Task                                                                                                                                                                                                                                                                                                                   | Status                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| S1  | Requirements doc [services-crud.md](services-crud.md): fields, validation, `visualKind` picker, draft/published, order within a category, and the delete rule (blocked while a live project links to the service); SEO/AI fields (SEO title and description, `faqs`) and slug redirects per [seo.md](../guides/seo.md) | Done                                                                                                     |
| S2  | Services API: public list/detail (published only) and admin CRUD + reorder, Zod-validated, `requirePermission(SERVICES)`, `visualKind` checked against `SERVICE_VISUAL_KINDS`, revalidates the web pages                                                                                                               | Done                                                                                                     |
| S3  | `packages/api-services`: services models, enums and service functions                                                                                                                                                                                                                                                  | Done                                                                                                     |
| S4  | Dashboard Services list: table grouped by category, status badge, reorder within a category                                                                                                                                                                                                                            | Done                                                                                                     |
| S5  | Dashboard Service form: basics, visual picker, intro/problem, deliverables and outcomes lists, engagement, publishing; delete with confirm                                                                                                                                                                             | Done                                                                                                     |
| S6  | Projects ↔ Services: API takes and returns the service by `uuid`, with category and slug derived from it; project form gets a Category filter + Service dropdown and loses "Service page slug"                                                                                                                         | Done                                                                                                     |
| S7  | Landing: `/services`, `/services/[slug]` and the home teaser read from the API, static and revalidated on edit; retire `constants/services.ts` (kept as `seed-data/services.json`)                                                                                                                                     | Done                                                                                                     |
| S8  | Production release: migration + seed (adds the services, links projects); fix any project the seed couldn't link — **review checkpoint**                                                                                                                                                                               | Done 2026-10-04: database migrated and seeded (12 services, 10 projects linked); all three apps deployed |
| S9  | Contract migration: drop `projects.service_slug` / `service_category`, make `service_id` required; seed and the Project types updated                                                                                                                                                                                  | Done 2026-10-04: migrated and deployed to production                                                     |

### Phase CM — Contact Us & Book a Call

| #   | Task                                                                                                                                                                                                                                      | Status                                                                                                                                                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CM1 | Requirements doc `contact-page.md` (backfills the missing doc): form fields, inbox statuses, spam protection (honeypot + rate limit + Cloudflare Turnstile CAPTCHA on submit), team email notification (yes/no, provider), Calendly setup | Done — [contact-page.md](contact-page.md)                                                                                                                                                                                                                              |
| CM2 | Public `POST /api/contact`: same Zod rules as the web form, Turnstile token verified server-side (`TURNSTILE_SECRET_KEY`), honeypot, rate limit by `ip_hash`, lower-cased email, `source_path`                                            | Done 2026-10-04 — `POST /api/public/contact`                                                                                                                                                                                                                           |
| CM3 | Admin inbox API: list (status filter, search, unread count), detail (marks read on first open), status change, internal note, delete; `requirePermission(CONTACT_MESSAGES)`                                                               | Done 2026-10-04 — `/api/contact-messages`                                                                                                                                                                                                                              |
| CM4 | Team email notification on a new message (required, see L8)                                                                                                                                                                               | Code done — Slack webhook and Gmail SMTP email (switched from Resend 2026-10-05), each off until configured; owner sets up the channel and sender account                                                                                                              |
| CM5 | `packages/api-services`: contact models, enums and service functions                                                                                                                                                                      | Done 2026-10-04                                                                                                                                                                                                                                                        |
| CM6 | Web: `use-contact-form` POSTs to the API, with real success and error states; Turnstile runs on submit (invisible unless the visitor looks suspicious, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`)                                                  | Done 2026-10-04                                                                                                                                                                                                                                                        |
| CM7 | Dashboard inbox: list with status tabs and an unread badge in the sidebar, detail view, status/note actions, archive/spam/delete                                                                                                          | Done 2026-10-04 — `/messages`                                                                                                                                                                                                                                          |
| CM8 | Book a Call: Calendly inline embed in the booking slot on `/contact` (`NEXT_PUBLIC_CALENDLY_URL`), name/email prefill, UTM tags, light/dark fit. No database and no CAPTCHA of ours (the booking happens inside Calendly's iframe)        | Code done 2026-10-04 — on once `NEXT_PUBLIC_CALENDLY_URL` is set (owner: Calendly account and event)                                                                                                                                                                   |
| CM9 | Production release (no migration needed); end-to-end check of form → inbox and a test booking — **review checkpoint**                                                                                                                     | Code ready 2026-10-04 — e2e green locally; no migration. Release: merge, set the env vars ([deployment.md](../guides/deployment.md#environment-variables)), run the contact and booking steps of the [checklist](../guides/smoke-tests.md#pre-launch-checklist-manual) |

### Phase T — Testimonials

| #   | Task                                                                                                                                                       | Status                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | Requirements doc [testimonials-crud.md](testimonials-crud.md): fields, highlights must be exact phrases in the quote, display order, optional project link | Done                                                                                                                                                                          |
| T2  | Testimonials API: public list (published, ordered) and admin CRUD + reorder, `requirePermission(TESTIMONIALS)`, revalidates the home page                  | Done                                                                                                                                                                          |
| T3  | `packages/api-services`: testimonial models and service functions                                                                                          | Done                                                                                                                                                                          |
| T4  | Dashboard Testimonials: list with drag reorder; form with a highlight picker (select phrases in the quote) and a project dropdown                          | Done — move up / down instead of drag ([decision](testimonials-crud.md#decisions-log))                                                                                        |
| T5  | Seed the three placeholder quotes; home testimonials section reads from the API; retire the constant                                                       | Done                                                                                                                                                                          |
| T6  | Production release: seed — **review checkpoint**                                                                                                           | Ready 2026-10-06 — no migration; owner runs the seed and deploys API → web ([pending releases](../../apps/api/README.md#pending-production-releases)) — **review checkpoint** |

### Phase AR — Articles

| #   | Task                                                                                                                                                                                                         | Status                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| AR1 | Requirements doc `articles-crud.md`: fields, the body editor approach (shared `packages/text-editor` vs a dashboard block editor, both saving `ArticleBlock[]` JSON), byline (PM decision), tags, publishing | Done — [articles-crud.md](articles-crud.md) |
| AR2 | Article media: cover and body-image presets in `packages/media-library`, upload endpoints, image blocks resolved from media `uuid` to URL in responses                                                       | Done                                        |
| AR3 | Articles API: public list (category/tag/search/sort) + detail + related, admin CRUD, Zod validation of the block union, `requirePermission(ARTICLES)`, revalidates the web pages                             | Not started                                 |
| AR4 | `packages/api-services`: article models, enums and service functions                                                                                                                                         | Not started                                 |
| AR5 | Body editor: paragraph, heading, list, quote, code and image blocks, with JSON in and out                                                                                                                    | Not started                                 |
| AR6 | Dashboard Articles list (search, category/status filters) and form (meta, tags, author from Team, cover, body editor, publishing); delete with confirm                                                       | Not started                                 |
| AR7 | Seed the six placeholder articles; `/articles`, `/articles/[slug]` and OG images read from the API; retire the constants. Engagement (comments, reactions, views) stays static, deferred 2026-10-03          | Not started                                 |
| AR8 | Production release: seed + media — **review checkpoint**                                                                                                                                                     | Not started                                 |

### Phase AN — Analytics in the dashboard

Planned 2026-10-06. Shows the GA4 and Meta Pixel data collected by the landing site ([analytics.md](../guides/analytics.md)) on a dashboard page, so the team doesn't have to open Google Analytics or Meta Events Manager. **No paid plan is needed**: the Google Analytics Data API is free on standard GA4 properties, and the Meta Marketing API (pixel `/stats`, Ads Insights) is free too. Independent of the CRUD slices. It can start any time, but it is only worth checking once production has been collecting data for a while (the IDs are set and the site is live).

Decisions to keep:

- **The API calls Google and Meta, never the browser.** The service-account key and Meta token are server-only env vars in `apps/api`; the dashboard only sees our own endpoints.
- **Cache every report** (15–60 min, realtime ~1 min) so dashboard loads don't burn the GA4 per-property quota.
- **Numbers are consented visitors only.** Tracking is consent-gated, so both sources undercount real traffic. The page says so.
- GA4 standard reports lag 24–48 h; only the realtime card is live. Meta pixel stats are event counts only, so GA4 is the main source and Meta a secondary panel.

| #   | Task                                                                                                                                                                                                                                                                                                     | Status      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| AN1 | Requirements doc `analytics-dashboard.md`: which metrics and charts, date ranges (7/28/90 days, custom), comparison with the previous period, caching rules, who can see it. **Owner** setup steps: Google Cloud project, Data API enabled, service account added as GA4 Viewer; Meta System User token  | Not started |
| AN2 | `ANALYTICS` feature permission (View only): Prisma enum migration, API and `api-services` enums, permissions drawer shows View only for it, sidebar entry gated on it                                                                                                                                    | Not started |
| AN3 | API GA4 client (`@google-analytics/data`, service account from env): overview (users, sessions, page views, engagement, key events `generate_lead` / `schedule_call`), traffic over time, top pages, sources/channels, countries, devices, realtime active users; cached, `requirePermission(ANALYTICS)` | Not started |
| AN4 | API Meta client (Graph API, System User token from env): pixel event counts over time (PageView, Lead, Schedule, Contact), and ad spend/reach/clicks from Ads Insights once ads run; cached, same permission. Unset env → endpoint reports "not configured" instead of failing                           | Not started |
| AN5 | `packages/api-services`: analytics models, enums (date range, report type) and service functions                                                                                                                                                                                                         | Not started |
| AN6 | Dashboard `/analytics` page: date-range picker, stat tiles with change vs the previous period, traffic chart, top pages, sources, countries/devices, conversions, realtime card, Meta events panel, "consented visitors only" note, empty and not-configured states                                      | Not started |
| AN7 | Production release: env vars on the API project ([deployment.md](../guides/deployment.md#environment-variables)), migration for the enum, numbers cross-checked against the GA4 and Meta UIs — **review checkpoint**                                                                                     | Not started |

### Phase SEO — metadata, Open Graph, search & AI visibility

Spec and reasoning: [docs/guides/seo.md](../guides/seo.md). SEO1–SEO4 don't depend on the CRUD slices and can run any time; SEO5 lands inside each slice; SEO7–SEO9 need the services and articles APIs for complete data, so they run after S7 and AR7 (or start with what exists and extend).

| #     | Task                                                                                                                                                                                                                                                                              | Status      |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| SEO1  | `utils/metadata.ts` `buildPageMetadata()`: one call per page producing title, description, canonical, robots and the **full** OG + Twitter set (url, type, site name, locale, image + alt). Fixes the shallow-merge bug where pages inherit the home page's OG title and URL      | Done        |
| SEO2  | Every landing page on the helper: home gets its own title and description; about, services, contact and service details get correct OG; one brand name decided ("Flizz" vs "Flizzio") and used everywhere                                                                         | Done        |
| SEO3  | OG images: site default (root `opengraph-image.tsx`), generated cards for service details and the list pages, with `og:image:alt`                                                                                                                                                 | Done        |
| SEO4  | Article details: `article:published_time`, `modified_time`, `author` (About URL), `section`, one `article:tag` per tag, cover as OG image when set; same dates in the `Article` JSON-LD                                                                                           | Not started |
| SEO5  | Per-record SEO fields (`seo_title`, `seo_description`, `og_image_id`, `noindex`) with a dashboard "Search & social" form section (Google snippet and share-card preview, character counters): services in S1–S5, articles in AR1–AR6, projects as a small migration + form change | Not started |
| SEO6  | _Optional:_ `page_seo` table + dashboard screen so the PM edits static pages' meta without a deploy                                                                                                                                                                               | Not started |
| SEO7  | `robots.ts` (AI crawler rules, preview `noindex`) and `sitemap.ts` from the API with `lastModified`                                                                                                                                                                               | Not started |
| SEO8  | JSON-LD: `Organization` + `WebSite`, `Service`, `FAQPage`, `AboutPage`, `ContactPage`, breadcrumbs; validated with the Rich Results Test                                                                                                                                          | Not started |
| SEO9  | AI visibility: `/llms.txt` route, IndexNow ping from the API on publish, firewall check for AI bots                                                                                                                                                                               | Not started |
| SEO10 | Launch: Google Search Console + Bing verification and sitemap submission; share-card check on LinkedIn/Facebook debuggers; SEO audit per [quality-audits.md](../guides/quality-audits.md) — **review checkpoint**                                                                 | Not started |

## Open items for PM

Each item below is marked with a `// TODO:` at the referenced location, so the code and this list stay in sync.

### Home page — blocking launch

| Item                   | Needed from PM                                                                | Location                                           |
| ---------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Social proof logos     | Real company logos — currently text placeholders                              | `constants/home.ts` → `socialProofLogos`           |
| Portfolio projects     | Real projects plus one screenshot each — entered in the dashboard             | Dashboard → Projects                               |
| Solution headline      | Confirm final headline — the sheet duplicated the Problem section's headline  | `components/features/home/solution.tsx:79`         |
| "Who we build for"     | Confirm headline and the final audience segment list                          | `constants/home.ts:317`, `who-we-build-for.tsx:57` |
| Hero discipline labels | Pick wording — "Engineering Works" reads wrong; three label sets were drafted | `constants/home.ts:20–24`                          |

### Contact page — blocking launch

| Item     | Needed from PM                    | Location                  |
| -------- | --------------------------------- | ------------------------- |
| NDA line | Confirm the wording before launch | `constants/contact.ts:18` |

The old "Contact Us form field list" item is now **resolved** — the field list was settled during the Stage 5 build. Form submission is resolved too: the form posts to the API since CM6.

### Portfolio pages — built

Both routes shipped 2026-09-03: `/portfolio` — a pinned reel playing the four highlighted projects one per screen, with the rest in a paged index below it — and ten `/portfolio/[slug]` case studies, statically generated, clearing the 404 the nav had been pointing at. Since Phase E (2026-10-02) the pages read from the Projects API and the static roster is retired — it survives only as seed data (`apps/api/prisma/seed-data/`). Full decisions and data model in [portfolio-pages.md](portfolio-pages.md).

| Item             | Needed from PM                                                             | Note                                                                        |
| ---------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Result figures   | **Nothing in `results` may be published as-is** — every figure is invented | These are the pages' only claims; they need real numbers or cuts            |
| Project copy     | Real engagements to replace all ten placeholders                           | Brief, constraints, approach, handover and stack per project                |
| Screenshots      | One per project                                                            | Upload the cover in the dashboard; the reserved plate disappears on its own |
| Client naming    | Whether clients can be named, and which are under NDA                      | `client` is an anonymised descriptor today                                  |
| Quotes           | Real attributions, or drop them                                            | Optional per project; omitting one changes no layout                        |
| Which work leads | Confirm the four projects the reel highlights                              | The Featured flag in the dashboard; the rest fall to the index              |
| Reel treatment   | Scroll-driven stage or visitor-driven carousel — both are built            | `portfolioReelVariant` in `constants/portfolio.ts`; carousel is the default |

### About page — built

Shipped 2026-08-31 at `/about`, clearing the 404 the nav had been pointing at. All eight sections are live; every placeholder sits in `constants/about.ts` so the PM's replacements never touch a component. Details in [about-page.md](about-page.md).

Non-blocking follow-ups the PM still owes:

| Item              | Needed from PM                                                                                           | Note                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Team roster       | Real names, roles, and profile URLs — 7 demo people ship meanwhile                                       | **Demo profile URLs resolve to nothing** |
| Team photographs  | Generate one per member from their own photo — prompt and size spec in [about-page.md](about-page.md) §6 | Set `photo` per member; no layout change |
| Milestone dates   | Correct every date after March 2024 — only the founding month is real                                    | Timeline ships with dummy dates          |
| Published figures | Real projects / team size / clients served                                                               | Must stay in sync with Home's `stats`    |

### Services pages — built

Both routes shipped 2026-09-01: `/services` and twelve `/services/[slug]` pages, statically generated. Since Phase S (2026-10-04) they and the home teaser read from the Services API; the old `constants/services.ts` roster survives only as seed data (`apps/api/prisma/seed-data/services.json`). Placeholder copy ships while the PM authors the real thing in the dashboard.

| Item                | Needed from PM                                                        | Note                                                                             |
| ------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Service copy        | Real intro, problem, deliverables and outcomes for all twelve         | Placeholder ships meanwhile                                                      |
| Roster confirmation | Are the four new services actually offered, or sheet candidates only? | Legacy Modernisation, API Development, Intelligent Automation, App Modernisation |
| Engagement shapes   | Typical duration and cadence per service                              | Section omitted where unknown                                                    |
| Pricing             | Whether any pricing appears on detail pages at all                    | Currently assumed no                                                             |

### Upcoming stages

- **Book a Call**: Calendly embed on `/contact` is built (CM8); it switches on once the owner sets `NEXT_PUBLIC_CALENDLY_URL`.

## Engineering cleanup before production

Done 2026-10-04 (L16): the `/home-v2` scratch route and the starfield hero it alone used are removed. The `@workspace/theme-lab` package was removed too, then restored on 2026-10-05: the colour playground stays, shown on the landing pages only when `NEXT_PUBLIC_ENABLE_THEME_LAB=true` (off in Production). See [packages/theme-lab/README.md](../../packages/theme-lab/README.md).

## How to use these docs

- Implementing a specific page → that page's notes doc only (written just-in-time, right before its stage).
- Checking overall status / what's next → this file.
- A page or feature has no doc yet → it hasn't reached its stage; don't speculate ahead of the plan above.
