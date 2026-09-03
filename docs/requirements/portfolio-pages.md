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

### The list page is a reel plus an index

`/portfolio` went through three shapes before it settled, and the middle one is
worth recording because it explains the final one:

1. **A sector-grouped ledger of rows.** Honest, scannable, and completely flat —
   every project carried the same weight and browsing ten of them read like a
   table. Rejected 2026-09-03.
2. **A reel of all ten projects**, one per screen. Right treatment, wrong scope:
   nobody wants to scroll ten full-height frames to reach the one that matches
   their situation.
3. **What ships:** the reel plays the _highlighted_ work only, and everything
   else falls to an index below it.

**The reel** pins one stage to the viewport and advances by scrolling:

- **Highlighted work only**, flagged by `featured` on the project itself. Four
  today, one per service category, so the reel covers the range of what we do
  rather than four variations on one thing.
- **Chapters.** Frames run sector by sector, newest first inside each.
- **Scenery.** Each chapter plays against a specimen from
  `@workspace/service-visuals`, masked into a soft blob and dimmed under the
  type. Changing scenery is what tells you the sector changed — no second label
  needed. Per chapter, not per project: see the performance note below.
- **A frame** carries the chapter, the name at display size, the summary in the
  serif, the change the project made, and the way into the case study.
- **A scrubber** along the foot — one tick per frame, grouped into chapters,
  each one a jump. That is what keeps the reel browsable rather than a queue.

Every frame stays in the DOM, so all its links are crawlable and the copy is
always in the page; only the active frame is visible, and the inactive ones are
`inert` so they take no focus and no clicks.

**The index** below it is the shared `IndexedList` snippet — numbered rows with
the sector as an eyebrow, the summary, and the project's headline result, all
in fixed columns so the set reads as a table rather than a ragged stack. It
opens at four rows behind a **Load more** button (`archivePageSize`), because an
index that opens at full length reads as a backlog. Paging is client-side over a
static roster today, and the shape is what the Projects API will page against at
Stage 13.

Because there are no longer per-sector groups to link to, the sector anchors are
gone: the masthead lists sectors and counts as a statement of range, and a case
study's sector eyebrow is plain text rather than a link back to a group.

### Two treatments for the highlighted work — 2026-09-03

All three are built and dispatched by one component, `PortfolioReelSection`,
which takes a `variant` prop (default `PREMIERE`). The page passes
`portfolioReelVariant` from `constants/portfolio.ts` into it, so the PM can
switch the whole page from one constant — the same way the article byline and
the service back-nav are switched. **TODO: PM to choose.**

| Variant    | Component           | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SCROLL`   | `PortfolioReel`     | The pinned stage above: advanced by scroll, chapter specimen behind the type.                                                                                                                                                                                                                                                                                                                                                                                |
| `CAROUSEL` | `PortfolioCarousel` | A run of project stills advanced by the visitor — the screenshot is the frame, with the name and result set into its foot over a scrim like a caption on a still. Neighbours peek in dimmed at the edges so the set reads as a strip of film. Built on the shared embla `Carousel`.                                                                                                                                                                          |
| `PREMIERE` | `PortfolioPremiere` | **Current default.** A letterboxed stage that _plays_. The project's name runs past behind the plate in outline at title-card size; the plate hangs in perspective and answers the cursor (near layer leaning, title drifting against it); cuts are light-bar wipes; a timecode runs in the corner; and the reel autoplays, the active tick filling as each scene holds. Pauses on hover/focus. Swipe, arrow keys, ticks and transport buttons all drive it. |

Notes across the driven variants:

- **Carousel has no autoplay** — a strip the visitor pulls. **Premiere does**,
  because a premiere runs; it holds each scene eight seconds and pauses the
  moment a hand or focus is on it, and the active tick's fill _is_ the timer, so
  the countdown is visible rather than a surprise.
- **Motion is gated on reality and preference.** The carousel's push-in and the
  premiere's plate parallax only fire when there is a real `image`; everything
  animated in both is dropped under `prefers-reduced-motion`, which the premiere
  falls back to as a plain cross-fade with a static tick.
- **Premiere takes two layout props**, both on by default: `fullWidth` runs
  the stage edge to edge, and `fullHeight` makes it fill the viewport on
  desktop the way the home Problem section does. `fullHeight` is deliberately
  desktop-only — a fixed height on a phone would clip the stacked copy and
  plate, so mobile keeps its natural height.
- **Premiere forces a dark surface** (`.dark` on the section) whatever the site
  theme: a screen is a dark object and the letterbox bars are black. Harmless
  today — the site ships dark — and correct the day a light theme lands.
- Until screenshots land, every plate is the `MediaSlot` reserved state, which
  is the honest version of this section and the reason the PM's screenshot item
  below is the one that changes it most.

### Cover plates

Still none on the list page: not one project has a real screenshot, and reserved
slots down a page read as an unfinished site. The detail page keeps one reserved
21:9 plate under its hero, matching the article banner treatment.

### Performance — why the scenery is sized and scoped the way it is

Measured, not assumed. Two findings from profiling the reel:

- A **full-bleed WebGL surface** (64% of the viewport) cost a **3.8s
  main-thread task** on every scene change under software rasterisation, against
  151ms for the small framed specimen the services page ships. The cost is
  pixel-bound: shrinking the panel to half the stage took the long task to
  **zero**. Never give one of these scenes the whole screen.
- Binding scenery to the **chapter** rather than the project means moving
  between two projects in the same sector costs nothing at all.

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
