# Requirements — Progress Report

Master index and tracker for the Flizz web project: public site pages, admin CRUD features, and the development plan/stage order. Update this file's status columns as work lands — it's the single place to check "what's done, what's next."

## Pages — public site (`apps/web`)

| #   | Page                            | Notes doc                              | Route              | Static build stage | Status                     |
| --- | ------------------------------- | -------------------------------------- | ------------------ | ------------------ | -------------------------- |
| 1   | Home                            | [home-page.md](home-page.md)           | `/`                | Stage 2            | Built — pending PM content |
| 2   | About                           | [about-page.md](about-page.md)         | `/about`           | Stage 3            | Built — pending PM content |
| 3   | Services (list)                 | [services-pages.md](services-pages.md) | `/services`        | Stage 4            | Spec'd — ready to build    |
| 4   | Single Service detail           | [services-pages.md](services-pages.md) | `/services/[slug]` | Stage 4            | Spec'd — ready to build    |
| 5   | Contact Us                      | _not written — built ad hoc_           | `/contact`         | Stage 5            | Built — pending PM content |
| 6   | Portfolio/Projects (list)       | _to be written before Stage 6_         | —                  | Stage 6            | Not started                |
| 7   | Single Portfolio/Project detail | _to be written before Stage 6_         | —                  | Stage 6            | Not started                |
| 8   | Articles (list)                 | [articles-pages.md](articles-pages.md) | `/articles`        | Stage 7            | Built — pending PM content |
| 9   | Single Article detail           | [articles-pages.md](articles-pages.md) | `/articles/[slug]` | Stage 7            | Built — pending PM content |
| 10  | Case Studies (list)             | _to be written before Stage 7_         | —                  | Stage 7            | Not started                |
| 11  | Single Case Study detail        | _to be written before Stage 7_         | —                  | Stage 7            | Not started                |
| —   | Home design variant (scratch)   | —                                      | `/home-v2`         | —                  | Delete before launch       |

Each page's requirements doc is written just before its static-design stage starts — no point speccing pages we're 5 stages away from.

**"Built — pending PM content"** means the page is designed, implemented, and passing typecheck/lint, but still renders placeholder copy or assets that the PM has to replace. See [Open items for PM](#open-items-for-pm) below.

## Admin dashboard CRUD features (`apps/dashboard`)

| Feature            | Notes                                                                                                                                                                                                                                                                                    | Status      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Services           | Powers the Services list, Single Service detail, and the Home page Services teaser section. Content will be authored via this CRUD (or written fresh) — the original Google Sheet copy was removed from docs since the PM holds the source and no longer wants it folded into seed data. | Not started |
| Portfolio/Projects | Powers the Portfolio list, Single Project detail, and the Home page Portfolio teaser section.                                                                                                                                                                                            | Not started |
| Articles           | Powers the Articles list and Single Article detail pages. Renamed from Blog on 2026-09-01 to match the shipped nav.                                                                                                                                                                      | Not started |
| Case Studies       | Powers the Case Studies list and Single Case Study detail pages.                                                                                                                                                                                                                         | Not started |
| Contact Us         | Stores/manages Contact Us form submissions.                                                                                                                                                                                                                                              | Not started |
| Testimonial        | Home page section only — no dedicated public page or list.                                                                                                                                                                                                                               | Not started |
| Book a Call        | No dedicated public page identified yet — confirm where this is triggered from (e.g. Hero CTA / Final CTA on Home) when we get there.                                                                                                                                                    | Not started |

## Development plan (execution order)

Work proceeds in this order. Update status inline as we move through them.

| #   | Stage                                                                                               | Status                          |
| --- | --------------------------------------------------------------------------------------------------- | ------------------------------- |
| 1   | ~~Read & document PM's Google Sheet content~~                                                       | Done                            |
| 2   | ~~Static Home page — design + build with static/placeholder data, launch-ready~~                    | Built — pending PM content      |
| 3   | Static About page — design + build                                                                  | **Current** — spec'd, unblocked |
| 4   | Static Services + Single Service pages — design + build                                             | Not started                     |
| 5   | ~~Static Contact Us page — design + build~~                                                         | Built early — pending PM        |
| 6   | Static Portfolio/Project pages — design + build                                                     | Not started                     |
| 7   | Static Blog + Case Studies pages — design + build                                                   | Not started                     |
| 8   | Database design — schema for all CRUD features                                                      | Not started                     |
| 9   | Admin dashboard base structure, design, and authentication                                          | Not started                     |
| 10  | Build APIs — feature by feature                                                                     | Not started                     |
| 11  | Frontend common API service functions, Zod schemas, models, enums & types (request/response/params) | Not started                     |
| 12  | Admin dashboard CRUD feature design & API integration                                               | Not started                     |
| 13  | Landing page API integration — replace static data with live data across all public pages           | Not started                     |
| 14  | Testing & bug fixing — full feature + design pass                                                   | Not started                     |

### Deviations from the plan

- **Stage 5 (Contact Us) was built before Stages 3 and 4.** It was designed directly against the Home page's cinematic style while that visual language was fresh, rather than waiting its turn. Stages 3 and 4 remain outstanding.
- **Contact Us shipped without a requirements doc.** The original rule — write each page's doc just before its stage — was skipped here. Decide before Stage 3 whether to keep writing docs first, or accept design-led builds and backfill the doc afterwards.
- The original "each stage starts only once the prior one is agreed/done" rule no longer matches how work is actually being sequenced, so it has been dropped from the intro above.

## Open items for PM

Each item below is marked with a `// TODO:` at the referenced location, so the code and this list stay in sync.

### Home page — blocking launch

| Item                   | Needed from PM                                                                | Location                                           |
| ---------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Social proof logos     | Real company logos — currently text placeholders                              | `constants/home.ts` → `socialProofLogos`           |
| Portfolio projects     | Real projects plus one screenshot per card                                    | `constants/home.ts:204`                            |
| Solution headline      | Confirm final headline — the sheet duplicated the Problem section's headline  | `components/features/home/solution.tsx:79`         |
| "Who we build for"     | Confirm headline and the final audience segment list                          | `constants/home.ts:317`, `who-we-build-for.tsx:57` |
| Hero discipline labels | Pick wording — "Engineering Works" reads wrong; three label sets were drafted | `constants/home.ts:20–24`                          |

### Contact page — blocking launch

| Item              | Needed from PM                                                       | Location                       |
| ----------------- | -------------------------------------------------------------------- | ------------------------------ |
| NDA line          | Confirm the wording before launch                                    | `constants/contact.ts:18`      |
| Booking scheduler | Confirm which scheduler, then swap the placeholder slot              | `constants/contact.ts:115`     |
| Form submission   | No endpoint yet — form validates but does not POST (due Stage 10/13) | `hooks/use-contact-form.ts:93` |

The old "Contact Us form field list" item is now **resolved** — the field list was settled during the Stage 5 build.

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

Both routes shipped 2026-09-01: `/services` and twelve `/services/[slug]` pages, statically generated. The roster now lives in `constants/services.ts` as the single source of truth, with the home teaser derived from it. Placeholder copy ships while the PM authors the real thing.

| Item                | Needed from PM                                                        | Note                                                                             |
| ------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Service copy        | Real intro, problem, deliverables and outcomes for all twelve         | Placeholder ships meanwhile                                                      |
| Roster confirmation | Are the four new services actually offered, or sheet candidates only? | Legacy Modernisation, API Development, Intelligent Automation, App Modernisation |
| Engagement shapes   | Typical duration and cadence per service                              | Section omitted where unknown                                                    |
| Pricing             | Whether any pricing appears on detail pages at all                    | Currently assumed no                                                             |

### Upcoming stages

- **Book a Call** — confirm entry point(s) on the public site (Home hero/final CTA reuse vs. a standalone flow) before Stage 4+.

## Engineering cleanup before production

- Remove the `@workspace/theme-lab` package and its two references — `apps/web/next.config.ts:4` and `apps/web/app/(marketing)/layout.tsx:16`.
- Delete the `/home-v2` scratch route and any hero/section variants it alone depends on.

## How to use these docs

- Implementing a specific page → that page's notes doc only (written just-in-time, right before its stage).
- Checking overall status / what's next → this file.
- A page or feature has no doc yet → it hasn't reached its stage; don't speculate ahead of the plan above.
