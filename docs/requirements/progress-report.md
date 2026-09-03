# Requirements — Progress Report

Master index and tracker for the Flizz web project: public site pages, admin CRUD features, and the development plan/stage order. Update this file's status columns as work lands — it's the single place to check "what's done, what's next."

## Pages — public site (`apps/web`)

| #   | Page                          | Notes doc                                | Route               | Static build stage | Status                     |
| --- | ----------------------------- | ---------------------------------------- | ------------------- | ------------------ | -------------------------- |
| 1   | Home                          | [home-page.md](home-page.md)             | `/`                 | Stage 2            | Built — pending PM content |
| 2   | About                         | [about-page.md](about-page.md)           | `/about`            | Stage 3            | Built — pending PM content |
| 3   | Services (list)               | [services-pages.md](services-pages.md)   | `/services`         | Stage 4            | Built — pending PM content |
| 4   | Single Service detail         | [services-pages.md](services-pages.md)   | `/services/[slug]`  | Stage 4            | Built — pending PM content |
| 5   | Contact Us                    | _not written — built ad hoc_             | `/contact`          | Stage 5            | Built — pending PM content |
| 6   | Portfolio/Projects (list)     | [portfolio-pages.md](portfolio-pages.md) | `/portfolio`        | Stage 6            | Built — pending PM content |
| 7   | Single Project detail         | [portfolio-pages.md](portfolio-pages.md) | `/portfolio/[slug]` | Stage 6            | Built — pending PM content |
| 8   | Articles (list)               | [articles-pages.md](articles-pages.md)   | `/articles`         | Stage 7            | Built — pending PM content |
| 9   | Single Article detail         | [articles-pages.md](articles-pages.md)   | `/articles/[slug]`  | Stage 7            | Built — pending PM content |
| 10  | Case Studies (list)           | [portfolio-pages.md](portfolio-pages.md) | —                   | —                  | Dropped — see below        |
| 11  | Single Case Study detail      | [portfolio-pages.md](portfolio-pages.md) | —                   | —                  | Dropped — see below        |
| —   | Home design variant (scratch) | —                                        | `/home-v2`          | —                  | Delete before launch       |

Each page's requirements doc is written just before its static-design stage starts — no point speccing pages we're 5 stages away from.

**"Built — pending PM content"** means the page is designed, implemented, and passing typecheck/lint, but still renders placeholder copy or assets that the PM has to replace. See [Open items for PM](#open-items-for-pm) below.

## Admin dashboard CRUD features (`apps/dashboard`)

| Feature            | Notes                                                                                                                                                                                                                                                                                    | Status      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Services           | Powers the Services list, Single Service detail, and the Home page Services teaser section. Content will be authored via this CRUD (or written fresh) — the original Google Sheet copy was removed from docs since the PM holds the source and no longer wants it folded into seed data. | Not started |
| Portfolio/Projects | Powers the Portfolio list, Single Project detail, and the Home page Portfolio teaser section.                                                                                                                                                                                            | Not started |
| Articles           | Powers the Articles list and Single Article detail pages. Renamed from Blog on 2026-09-01 to match the shipped nav.                                                                                                                                                                      | Not started |
| Case Studies       | **Dropped 2026-09-03** — a case study is a project shown in full, not a separate record. The Projects CRUD covers both.                                                                                                                                                                  | —           |
| Contact Us         | Stores/manages Contact Us form submissions.                                                                                                                                                                                                                                              | Not started |
| Testimonial        | Home page section only — no dedicated public page or list.                                                                                                                                                                                                                               | Not started |
| Book a Call        | No dedicated public page identified yet — confirm where this is triggered from (e.g. Hero CTA / Final CTA on Home) when we get there.                                                                                                                                                    | Not started |

## Development plan (execution order)

Work proceeds in this order. Update status inline as we move through them.

| #   | Stage                                                                                               | Status                         |
| --- | --------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | ~~Read & document PM's Google Sheet content~~                                                       | Done                           |
| 2   | ~~Static Home page — design + build with static/placeholder data, launch-ready~~                    | Built — pending PM content     |
| 3   | ~~Static About page — design + build~~                                                              | Built — pending PM content     |
| 4   | ~~Static Services + Single Service pages — design + build~~                                         | Built — pending PM content     |
| 5   | ~~Static Contact Us page — design + build~~                                                         | Built early — pending PM       |
| 6   | ~~Static Portfolio/Project pages — design + build~~                                                 | Built — pending PM content     |
| 7   | ~~Static Articles pages — design + build~~ (Case Studies dropped)                                   | Built — pending PM content     |
| 8   | Database design — schema for all CRUD features                                                      | **Current** — nothing blocking |
| 9   | Admin dashboard base structure, design, and authentication                                          | Not started                    |
| 10  | Build APIs — feature by feature                                                                     | Not started                    |
| 11  | Frontend common API service functions, Zod schemas, models, enums & types (request/response/params) | Not started                    |
| 12  | Admin dashboard CRUD feature design & API integration                                               | Not started                    |
| 13  | Landing page API integration — replace static data with live data across all public pages           | Not started                    |
| 14  | Testing & bug fixing — full feature + design pass                                                   | Not started                    |

### Deviations from the plan

- **Stage 5 (Contact Us) was built before Stages 3 and 4.** It was designed directly against the Home page's cinematic style while that visual language was fresh, rather than waiting its turn. Both have since been built.
- **Contact Us shipped without a requirements doc.** The original rule — write each page's doc just before its stage — was skipped here. Every stage since has had its doc written or settled first, so treat that as the standing practice; Contact Us is the one page still owed a backfilled doc.
- **Stage 7 was built before Stage 6.** Articles shipped 2026-09-01, Portfolio 2026-09-03.
- **Case Studies were dropped, not deferred.** The PM settled on 2026-09-03 that a case study is a project shown in full — so `/portfolio/[slug]` is the case study, and Stage 7's second half disappears rather than moving.
- The original "each stage starts only once the prior one is agreed/done" rule no longer matches how work is actually being sequenced, so it has been dropped from the intro above.

## Open items for PM

Each item below is marked with a `// TODO:` at the referenced location, so the code and this list stay in sync.

### Home page — blocking launch

| Item                   | Needed from PM                                                                | Location                                           |
| ---------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Social proof logos     | Real company logos — currently text placeholders                              | `constants/home.ts` → `socialProofLogos`           |
| Portfolio projects     | Real projects plus one screenshot each — the strip is derived from the roster | `constants/portfolio.ts` → `projects`              |
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

### Portfolio pages — built

Both routes shipped 2026-09-03: `/portfolio` — a pinned reel playing the four highlighted projects one per screen, with the rest in a paged index below it — and ten `/portfolio/[slug]` case studies, statically generated, clearing the 404 the nav had been pointing at. `constants/portfolio.ts` is the single source of truth — the home strip is derived from it and its cards now link to individual projects. Full decisions and data model in [portfolio-pages.md](portfolio-pages.md).

| Item             | Needed from PM                                                             | Note                                                                        |
| ---------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Result figures   | **Nothing in `results` may be published as-is** — every figure is invented | These are the pages' only claims; they need real numbers or cuts            |
| Project copy     | Real engagements to replace all ten placeholders                           | Brief, constraints, approach, handover and stack per project                |
| Screenshots      | One per project                                                            | Set `image`; the reserved plate disappears on its own                       |
| Client naming    | Whether clients can be named, and which are under NDA                      | `client` is an anonymised descriptor today                                  |
| Quotes           | Real attributions, or drop them                                            | Optional per project; omitting one changes no layout                        |
| Which work leads | Confirm the four projects the reel highlights                              | `featured` in `constants/portfolio.ts`; the rest fall to the index          |
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
