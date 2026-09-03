# Portfolio / Projects — List & Single Project Detail

**Source:** No sheet content. Scoping paused 2026-09-01, settled with the PM 2026-09-03.

Two public routes in `apps/web`:

- `/portfolio` — the work index
- `/portfolio/[slug]` — single project, written as a case study

Stage 6. **Both built 2026-09-03.**

## Scope decisions — 2026-09-03

The three questions this doc paused on are answered:

| Question                     | Decision                                                                                                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Category taxonomy            | **Tag by service, group by sector.** Every project carries a `ServiceCategory` and a service slug for cross-linking; the index groups by sector, because a visitor recognises their own business before they recognise our catalogue.                                    |
| Roster size                  | **Ten projects.** The six placeholders that were in `constants/home.ts` plus four new ones, two per sector.                                                                                                                                                              |
| Relationship to case studies | **Same record, two depths.** The project detail page _is_ the case study — brief, constraints, approach, handover, results. Stage 7's separate Case Studies feature is dropped; the home teaser's existing "View all case studies →" CTA is therefore correct and stays. |

## Sectors

Five, defined in `enums/portfolio.ts` as `ProjectSector`, two projects each:

1. **Operations & Logistics** — Northwind Ops Platform, Marlin & Co Dashboard
2. **Retail & Commerce** — Halden Grove Subscriptions, Vantage Cove Storefront
3. **Field & Frontline** — Ardsley Crew Scheduler, Fieldstone Field App
4. **Financial Services** — Rivergate Rebuild, Penhurst Claims Triage
5. **Professional Services** — Adaptive Labs Intake, Brightmoor Client Portal

Sector is the index's grouping axis and each group is an anchor (`projectSectorAnchors`), so the masthead rail and a project's own detail page land on the group rather than the top of the page.

## Data model

`types/portfolio.ts`, split the way `types/services.ts` is — `Project` is what the index and the home strip need, `ProjectDetail` adds the case-study body.

| Field                                                         | Used by | Notes                                                           |
| ------------------------------------------------------------- | ------- | --------------------------------------------------------------- |
| `slug`                                                        | both    | Route segment                                                   |
| `name`                                                        | both    |                                                                 |
| `client`                                                      | detail  | Anonymised descriptor — the client's shape, not a trading name  |
| `sector`                                                      | both    | One of the five                                                 |
| `service`, `serviceSlug`                                      | both    | The cross-link to `/services/[slug]`, matched by slug           |
| `year`                                                        | both    | String; nothing does arithmetic on it                           |
| `summary`                                                     | both    | One line, carries the index row and the home card               |
| `results`                                                     | both    | `{ label, from, to }[]`. The **first** carries the index row    |
| `image`                                                       | both    | Optional; unfilled slots use the `MediaSlot` registration marks |
| `duration`, `team`                                            | detail  | Hero fact ledger                                                |
| `brief`, `constraints`, `approach`, `built`, `stack`, `quote` | detail  | The case study itself                                           |

### Why results are pairs

A single figure claims nothing a visitor can check — "four hours" only means something beside the six days it replaced. Every result is stored as `from` → `to` and rendered by one component (`ProjectShift`), which is the signature device of both pages: the index shows a project's first result, the detail page spends all three.

## Design notes

### The list page is a reel, not an index

The first build of `/portfolio` was a sector-grouped ledger of rows. It was
honest and scannable and completely flat — every project carried the same
weight, and browsing ten of them felt like reading a table. Rejected on that
basis 2026-09-03 and replaced.

What ships instead pins one stage to the viewport and plays the work through it,
one project per screen, advanced by scrolling:

- **Chapters.** The reel runs sector by sector, newest first inside each, so it
  reads as five chapters rather than ten unrelated frames.
- **Scenery.** Each chapter plays against a specimen from
  `@workspace/service-visuals`, masked into a soft blob and dimmed under the
  type. Changing scenery is what tells you the sector changed — no second label
  needed. It is per chapter rather than per project deliberately: see the
  performance note below.
- **One project, full-bleed.** Chapter label, the name at display size, the
  summary in the serif, the change it made, and the way into the case study.
- **A scrubber**, not a list. Ten ticks along the foot, grouped into chapters,
  each one a jump — that is what keeps the reel browsable rather than a queue.
  The masthead's sector rail lands on the same frames.

Every frame stays in the DOM, so all ten links are crawlable and the copy is
always in the page; only the active frame is visible, and the inactive ones are
`inert` so they take no focus and no clicks.

### Cover plates

Still none, anywhere on the list page: not one project has a real screenshot,
and ten reserved slots would read as an unfinished site. The detail page keeps
one reserved 21:9 plate under its hero, matching the article banner treatment.

### Performance — why the scenery is sized and scoped the way it is

Measured, not assumed. Two findings from profiling the reel:

- A **full-bleed WebGL surface** (64% of the viewport) cost a **3.8s
  main-thread task** on every scene change under software rasterisation, against
  151ms for the small framed specimen the services page ships. The cost is
  pixel-bound: shrinking the panel to half the stage took the long task to
  **zero**. Never give one of these scenes the whole screen.
- Binding scenery to the **chapter** rather than the project cuts a full scroll
  of the reel from nine scene builds to four, and means moving between the two
  projects inside a sector costs nothing at all.

A settle delay (`sceneSettleMs`) means a fast scroll through several chapters
builds only the set it lands on.

## Home page coupling

`constants/portfolio.ts` is the single source of truth. `constants/home.ts` re-exports `homeTeaserProjects` as `projectCards`, so the strip and `/portfolio` can never disagree, and each card now links to its own detail page rather than all six landing on `/portfolio`. `ProjectCard` in `types/home.ts` and the strip's local pending-slot copy were both deleted in favour of `Project` and the shared `MediaSlot`.

## Open items for PM

| Item               | Needed from PM                                                                                                                     | Note                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Every project      | Real engagements to replace all ten placeholders                                                                                   | `constants/portfolio.ts` carries a single `// TODO:`                |
| Result figures     | **Nothing in `results` may be published as-is** — all illustrative                                                                 | These are the page's only claims, so they need real numbers or cuts |
| Screenshots        | One per project                                                                                                                    | Set `image`; the reserved plate disappears on its own               |
| Client names       | Whether clients can be named at all, and which are under NDA                                                                       | `client` is deliberately an anonymised descriptor today             |
| Quotes             | Real attributions, or drop the quote per project                                                                                   | `quote` is optional; omitting it changes no layout                  |
| Social proof logos | The four new names (Halden Grove, Ardsley, Penhurst, Brightmoor) were added to `socialProofLogos` to keep the two lists consistent | Replace both together                                               |
