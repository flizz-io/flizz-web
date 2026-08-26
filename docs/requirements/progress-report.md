# Requirements — Progress Report

Master index and tracker for the Flizz web project: public site pages, admin CRUD features, and the development plan/stage order. Update this file's status columns as work lands — it's the single place to check "what's done, what's next."

## Pages — public site (`apps/web`)

| #   | Page                            | Notes doc                      | Static build stage | Status      |
| --- | ------------------------------- | ------------------------------ | ------------------ | ----------- |
| 1   | Home                            | [home-page.md](home-page.md)   | Stage 2            | Not started |
| 2   | About                           | [about-page.md](about-page.md) | Stage 3            | Not started |
| 3   | Services (list)                 | _to be written before Stage 4_ | Stage 4            | Not started |
| 4   | Single Service detail           | _to be written before Stage 4_ | Stage 4            | Not started |
| 5   | Contact Us                      | _to be written before Stage 5_ | Stage 5            | Not started |
| 6   | Portfolio/Projects (list)       | _to be written before Stage 6_ | Stage 6            | Not started |
| 7   | Single Portfolio/Project detail | _to be written before Stage 6_ | Stage 6            | Not started |
| 8   | Blog (list)                     | _to be written before Stage 7_ | Stage 7            | Not started |
| 9   | Single Blog detail              | _to be written before Stage 7_ | Stage 7            | Not started |
| 10  | Case Studies (list)             | _to be written before Stage 7_ | Stage 7            | Not started |
| 11  | Single Case Study detail        | _to be written before Stage 7_ | Stage 7            | Not started |

Each page's requirements doc is written just before its static-design stage starts — no point speccing pages we're 5 stages away from.

## Admin dashboard CRUD features (`apps/dashboard`)

| Feature            | Notes                                                                                                                                                                                                                                                                                    | Status      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Services           | Powers the Services list, Single Service detail, and the Home page Services teaser section. Content will be authored via this CRUD (or written fresh) — the original Google Sheet copy was removed from docs since the PM holds the source and no longer wants it folded into seed data. | Not started |
| Portfolio/Projects | Powers the Portfolio list, Single Project detail, and the Home page Portfolio teaser section.                                                                                                                                                                                            | Not started |
| Blog               | Powers the Blog list and Single Blog detail pages.                                                                                                                                                                                                                                       | Not started |
| Case Studies       | Powers the Case Studies list and Single Case Study detail pages.                                                                                                                                                                                                                         | Not started |
| Contact Us         | Stores/manages Contact Us form submissions.                                                                                                                                                                                                                                              | Not started |
| Testimonial        | Home page section only — no dedicated public page or list.                                                                                                                                                                                                                               | Not started |
| Book a Call        | No dedicated public page identified yet — confirm where this is triggered from (e.g. Hero CTA / Final CTA on Home) when we get there.                                                                                                                                                    | Not started |

## Development plan (execution order)

Work proceeds in this order; each stage starts only once the prior one is agreed/done. Update status inline as we move through them.

| #   | Stage                                                                                               | Status                |
| --- | --------------------------------------------------------------------------------------------------- | --------------------- |
| 1   | ~~Read & document PM's Google Sheet content~~                                                       | Done                  |
| 2   | Static Home page — design + build with static/placeholder data, launch-ready                        | Not started (current) |
| 3   | Static About page — design + build                                                                  | Not started           |
| 4   | Static Services + Single Service pages — design + build                                             | Not started           |
| 5   | Static Contact Us page — design + build                                                             | Not started           |
| 6   | Static Portfolio/Project pages — design + build                                                     | Not started           |
| 7   | Static Blog + Case Studies pages — design + build                                                   | Not started           |
| 8   | Database design — schema for all CRUD features                                                      | Not started           |
| 9   | Admin dashboard base structure, design, and authentication                                          | Not started           |
| 10  | Build APIs — feature by feature                                                                     | Not started           |
| 11  | Frontend common API service functions, Zod schemas, models, enums & types (request/response/params) | Not started           |
| 12  | Admin dashboard CRUD feature design & API integration                                               | Not started           |
| 13  | Landing page API integration — replace static data with live data across all public pages           | Not started           |
| 14  | Testing & bug fixing — full feature + design pass                                                   | Not started           |

## Open items for PM (carried over)

- **Home page** — company logos for social proof, a corrected Solution-section headline (currently duplicates the Problem section's headline), Contact Us form field list. See [home-page.md](home-page.md).
- **About page scope** — only a mission statement + 5 values were in the sheet; confirm whether more sections (team, timeline) are coming, or this is the full static-page scope for Stage 3.
- **Book a Call** — confirm entry point(s) on the public site (Home hero/final CTA reuse vs. a standalone flow) before Stage 4+.

## How to use these docs

- Implementing a specific page → that page's notes doc only (written just-in-time, right before its stage).
- Checking overall status / what's next → this file.
- A page or feature has no doc yet → it hasn't reached its stage; don't speculate ahead of the plan above.
