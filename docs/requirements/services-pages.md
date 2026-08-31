# Services — List & Single Service Detail

**Source:** `Home` tab of the requirements Google Sheet (category/scope reference only), plus scope decisions taken 2026-08-31.

Covers two public routes in `apps/web`, specced together because they share one data model and taxonomy:

- `/services` — the Services list page
- `/services/[slug]` — Single Service detail

Stage 4. Both are static for now; the Services CRUD (Stage 8–12) replaces the constants later without changing either page's structure.

> The per-service copy originally transcribed from the sheet was deliberately removed — the PM holds the source and will re-author through the admin CRUD. Everything below is placeholder written to the site's voice, not sheet content.

## Scope decisions — 2026-08-31

| Question       | Decision                                                                     |
| -------------- | ---------------------------------------------------------------------------- |
| Stage 4 covers | Both pages together — the card-to-detail transition is designed as one thing |
| Roster size    | Curated 12 services                                                          |
| Taxonomy       | Four canonical categories                                                    |

## Taxonomy

Four categories, as `home-page.md` defines them:

1. **Custom Software**
2. **AI & Automation**
3. **E-commerce**
4. **Mobile**

Shopify and Payment fold under E-commerce; SaaS and Legacy Modernisation under Custom Software.

> **Corrected 2026-09-01.** `constants/home.ts` had `Shopify` and `Payment` as top-level service categories alongside the four real ones. (The other odd values seen while scoping — `SaaS Platform`, `Legacy Modernisation` — turned out to be _project_ categories on `projectCards`, not services.) Both now fold into E-commerce.
>
> Rather than fixing the strings in place, the roster moved to `constants/services.ts` as the single source of truth, and `serviceCards` is now derived from it — so the home teaser and `/services` cannot disagree about a title, summary or visual.

## The 12 services

`visualKind` refers to a scene in `@workspace/service-visuals`. Summaries are placeholder copy in the site's voice — one line, plain, slightly contrarian.

| Slug                            | Title                         | Category        | Visual kind        |
| ------------------------------- | ----------------------------- | --------------- | ------------------ |
| `mvp-development`               | MVP Development               | Custom Software | `mvp-ascent`       |
| `saas-application-development`  | SaaS Application Development  | Custom Software | `tenant-column`    |
| `legacy-modernisation`          | Legacy Modernisation          | Custom Software | `layered-stack`    |
| `api-development`               | API Development               | Custom Software | `grid-lattice`     |
| `ai-integration`                | AI Integration                | AI & Automation | `neural-layers`    |
| `chatbots-conversational-ai`    | Chatbots & Conversational AI  | AI & Automation | `dialogue-bubbles` |
| `intelligent-automation`        | Intelligent Automation        | AI & Automation | `particle-swarm`   |
| `online-store-development`      | Online Store Development      | E-commerce      | `catalog-checkout` |
| `shopify-app-development`       | Shopify App Development       | E-commerce      | `plugin-socket`    |
| `payment-integration`           | Payment Integration           | E-commerce      | `secure-rail`      |
| `native-mobile-app-development` | Native Mobile App Development | Mobile          | `dual-handset`     |
| `app-modernisation`             | App Modernisation             | Mobile          | `device-frame`     |

Eight already exist in `constants/home.ts`. Four are new to this stage — Legacy Modernisation, API Development, Intelligent Automation, App Modernisation — with draft summaries:

- **Legacy Modernisation** — Move off a system you can no longer hire for, in stages rather than one risky rewrite.
- **API Development** — Interfaces other teams can build against without booking a meeting first.
- **Intelligent Automation** — Take repetitive work off people, and keep the audit trail.
- **App Modernisation** — Bring an app that still works onto a platform that still ships.

`mvp-development` pointed at `layered-stack` with `mvp-ascent` commented out beside it; the purpose-built visual is now restored.

That assignment leaves `pulse-orb` and `orbit-ring` free for the future admin picker; `pulse-orb` is also the hero's default centre object.

## Data model

The fields each service needs. This is what the Services CRUD will eventually store, so it is worth settling now rather than discovering it at Stage 8.

| Field          | Used by       | Notes                                                      |
| -------------- | ------------- | ---------------------------------------------------------- |
| `slug`         | both, routing | Backend-generated later, unique, editable                  |
| `title`        | both          |                                                            |
| `category`     | both          | One of the four                                            |
| `summary`      | both          | One line. Also feeds the home teaser                       |
| `intro`        | detail        | Two or three sentences under the detail hero               |
| `problem`      | detail        | What the service is actually for                           |
| `deliverables` | detail        | 3–6 concrete items                                         |
| `outcomes`     | detail        | 3 items, business-level not technical                      |
| `engagement`   | detail        | Typical shape — duration, cadence. Optional per service    |
| `visualKind`   | both          | Id only; the palette lives in `@workspace/service-visuals` |

Related services are derived from `category` rather than stored, so nothing has to be maintained by hand.

## `/services` — list page

**Job:** let someone find the service that matches their problem, and understand the range without reading twelve pages. It is a routing surface, not a sales pitch — the detail pages sell.

Sections:

1. **Hero** — what Flizz builds, stated once. No figures strip; that belongs to About.
2. **The twelve, grouped by category** — the substance of the page. Each entry carries title, summary, and its visual, and links to the detail page.
3. **Final CTA** → `/contact`.

Notes:

- Every card links to `/services/[slug]`. No dead cards.
- Category grouping must be visible without being four separate walls of the same component.
- The visuals are WebGL and there are twelve of them. They must not all mount and animate at once — mount on view, and respect reduced motion.

## `/services/[slug]` — detail page

**Job:** turn interest into a conversation. One service, argued properly.

Sections:

1. **Hero** — category, title, intro, the service's visual, CTA.
2. **The problem** — what this is for, in the client's terms.
3. **What's included** — deliverables, concrete.
4. **What you get** — outcomes, business-level.
5. **Typical engagement** — shape and duration, where known. Omit rather than invent.
6. **Related services** — the others in the same category.
7. **Final CTA** → `/contact`.

Notes:

- **Do not restate the five-step process from the home page.** It already lives there and on About; a service page repeating it is filler. Reference it or leave it out.
- Twelve pages share one template. It has to hold up when `engagement` is missing and when `deliverables` runs long.
- `generateStaticParams` over the twelve slugs; unknown slug → `notFound()`.

## Design constraints

The site now has a large vocabulary of section layouts. These pages must not reuse them, and in particular must not clone the closest neighbour.

| Layout                                            | Already used by                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| Horizontal scrolling spine, alternating specimens | **Home services teaser** — nearest neighbour, hardest constraint |
| Slat frame that opens on hover                    | About team                                                       |
| Asymmetric card grid                              | About values                                                     |
| Drag carousel                                     | Portfolio strip                                                  |
| Numbered index rows (`IndexedList`)               | Process, services listings                                       |
| Timeline rail                                     | About origin, Contact next steps                                 |
| Accordion                                         | FAQ                                                              |
| Marquee                                           | Social proof, Who we build for                                   |
| Schematic readout / spec sheet                    | About guarantees, Contact hero                                   |
| Console / instrument panel                        | Home process, Contact form                                       |
| Quiet dot-field band                              | About operating principles                                       |

Motion sits at the Contact/About register — `Reveal`, CSS micro-interactions, one orchestrated moment per section — except the service visuals themselves, which are the page's showpiece.

## Open items for PM

| Item                | Needed                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| Service copy        | Real `intro`, `problem`, `deliverables`, `outcomes` for all twelve. Placeholder ships meanwhile        |
| Roster confirmation | Are the four new services actually offered? They were candidates in the sheet, not confirmed offerings |
| Engagement shapes   | Typical duration and cadence per service, where one exists                                             |
| Pricing             | Whether any pricing or "from" figure appears on detail pages at all                                    |

## Housekeeping found during scoping

- `@workspace/service-visuals` is not listed in the Architecture section of root `CLAUDE.md`. Conventions require every scaffolded package to be recorded there.
- `constants/home.ts` category strings need folding into the four canonical categories (see Taxonomy above).
