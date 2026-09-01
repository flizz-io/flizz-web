# Portfolio / Projects — List & Single Project Detail

**Status:** Scoping paused 2026-09-01, pending a conversation with the PM. Not started.

Two public routes in `apps/web`:

- `/portfolio` — the Projects list page
- `/portfolio/[slug]` — Single Project detail

Stage 6.

> `/portfolio` is linked from the header nav (`configs/nav.ts:7`) and the footer, so the route is currently a live 404 — the same state `/about` and `/services` were in before their stages.

## Settled

| Question       | Decision                                                               |
| -------------- | ---------------------------------------------------------------------- |
| Stage 6 covers | Both pages together, so the card-to-detail transition is designed once |

## Open — needs the PM

### 1. Category taxonomy

`constants/home.ts` tags the six placeholder projects with six different categories:

| Project                 | Current category     | Under the services taxonomy |
| ----------------------- | -------------------- | --------------------------- |
| Northwind Ops Platform  | Custom Software      | Custom Software             |
| Vantage Cove Storefront | E-commerce           | E-commerce                  |
| Fieldstone Field App    | Mobile               | Mobile                      |
| Adaptive Labs Intake    | AI & Automation      | AI & Automation             |
| Marlin & Co Dashboard   | SaaS Platform        | → Custom Software           |
| Rivergate Rebuild       | Legacy Modernisation | → Custom Software           |

`SaaS Platform` and `Legacy Modernisation` are services _within_ Custom Software, not categories alongside it. Three ways to resolve it:

- **Align to the four service categories.** Each project can then link to the service that delivered it, and each service page can show real work against it. The strongest pairing once both exist — but three of six projects collapse into one category.
- **Keep richer project-specific labels.** More descriptive per project, no clean cross-link, and six categories over six projects means most groups hold one item.
- **Tag by service, group by sector.** Categories align for cross-linking, but the page groups by sector — B2B Operations, DTC Retail, Field Services, Finance — since that is what a visitor recognises their own business in.

**Ask the PM:** do visitors pick work by _what was built_ or by _who it was built for_? That answer settles this.

### 2. Roster size

Six placeholder projects exist. Options: keep six (honest for a company founded in 2024, and the home strip becomes a true subset), expand to nine or ten for a fuller page, or ship six but build for twenty since the CRUD will feed real projects later.

**Ask the PM:** how many real projects can actually be published — including any blocked by client NDAs?

### 3. Relationship to Case Studies

The plan treats Case Studies as a separate feature with its own pages and CRUD at Stage 7. But the home teaser's CTA already reads **"View all case studies →"** while linking to `/portfolio`.

**Ask the PM:** are a project and a case study the same record shown two ways, or genuinely separate things? If they are the same, Stage 7 shrinks considerably and the copy is right. If they are separate, that CTA is wrong and should say "View all work".

## Findings to carry into the build

- The home strip's cards all link to `/portfolio` rather than to individual projects — the same gap the services teaser had, to be fixed when detail routes exist.
- `ProjectCard.image` is optional and unfilled; the strip already renders an honest empty slot with registration marks rather than invented cover art. Reuse that treatment.
- Placeholder project names match `socialProofLogos`, so the two stay consistent.

## Design constraints

The home teaser is a **horizontal drag-and-snap carousel** of 620:388 landscape cards with a progress bar. The list page must not repeat it. See the layout table in [services-pages.md](services-pages.md) for everything else already in use.
