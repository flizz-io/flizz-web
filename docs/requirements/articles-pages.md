# Articles — List & Single Article Detail

**Source:** No sheet content. Scope decided 2026-09-01.

Two public routes in `apps/web`:

- `/articles` — the Articles list page
- `/articles/[slug]` — Single Article detail

Stage 7. **Both built 2026-09-01.**

> `/articles` is linked from the header nav (`configs/nav.ts:7`) and the footer, so the route is currently a live 404.

## Naming — settled

The nav says **Articles**; every planning doc said **Blog**. Articles wins: it suits technical writing from an engineering firm, where "Blog" suggests company news, and the nav is already shipped so nothing user-facing changes. `Blog` is renamed to `Articles` throughout the requirements docs and for the future CRUD.

## Scope decisions — 2026-09-01

| Question       | Decision                                                         |
| -------------- | ---------------------------------------------------------------- |
| Stage 7 covers | Both pages together, as with Services                            |
| Body format    | Structured blocks in constants — typed JSON, no new dependencies |
| Authorship     | Both treatments built, switched by a prop                        |
| Roster         | Six placeholder articles                                         |

## Body format

Article bodies are a typed array of blocks, not HTML and not MDX:

```ts
type ArticleBlock =
	| { type: 'paragraph'; text: string }
	| { type: 'heading'; level: 2 | 3; text: string }
	| { type: 'list'; ordered?: boolean; items: string[] }
	| { type: 'quote'; text: string; attribution?: string }
	| { type: 'code'; language: string; code: string };
```

This matches the project convention that rich text is persisted as JSON and never raw HTML, so the renderer written now works unchanged when the Articles CRUD supplies the same shape at Stage 13. MDX was rejected because its content pipeline and dependencies would be discarded at that point.

## Authorship

Both treatments are built and switched by `articleByline` in `constants/articles.ts`:

- `AUTHOR` — bylined to someone from the About roster, reusing `aboutTeam`. Cross-links the two pages, and technical writing carries more weight with a named engineer behind it.
- `COMPANY` — published by Flizz, no individual named. Nothing breaks if the team section is switched off.
- `NONE` — date and reading time only.

Default is `AUTHOR`. **TODO: PM to choose** — the decision is deferred, which is why both exist rather than one.

## Categories and tags

Two separate vocabularies, deliberately:

**Categories** are a fixed taxonomy (`ArticleCategory`) — exactly one per article, and the axis the site is organised by:

1. **Engineering**
2. **Product**
3. **AI**
4. **Practice** — how the work runs

**Tags** are open. `string[]`, several per article, added freely without a schema change. They describe an individual piece rather than sorting it into the site's structure, and the filter list is derived from whatever the roster actually uses — so adding a tag to an article is all it takes to make it filterable.

Tags render as chips on each list row and drive the tag filter. They do not currently have their own pages; `/articles?tag=SaaS` covers the same need without twenty near-empty routes.

## Data model

| Field         | Used by | Notes                                                                                                 |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `slug`        | both    | Route segment                                                                                         |
| `title`       | both    |                                                                                                       |
| `excerpt`     | both    | List entry and meta description                                                                       |
| `category`    | both    | One of the four                                                                                       |
| `publishedAt` | both    | ISO date; the list is ordered by it                                                                   |
| `author`      | both    | Matched by name against `aboutTeam`; ignored when byline is COMPANY                                   |
| `body`        | detail  | The block array                                                                                       |
| `coverImage`  | both    | Optional. Unfilled slots use the registration-mark treatment from the project strip, not invented art |

**Reading time is computed, not stored** — counted from the body at render time, so it can never go stale against an edited article.

## `/articles` — list page

**Job:** let someone find writing worth reading, and see that the writing is current.

1. **Hero** — what this is, stated once.
2. **Featured** — the most recent article, given a larger treatment.
3. **The archive** — the rest, reverse-chronological, each row leading with its date.
4. **CTA** → `/contact`.

Date leads each row because for articles the chronology _is_ the organising information — unlike the services index, where order carried nothing and rows led with the title. That difference is also what keeps the two pages from reading as the same list twice.

## `/articles/[slug]` — detail page

**Job:** be read. Typography carries this page; nothing should compete with the body.

1. **Hero** — category, title, excerpt, and the meta line (author, date, reading time).
2. **Cover** — when one exists.
3. **Body** — the blocks, in a single reading column.
4. **Byline** — per the prop above.
5. **Related** — others in the same category.
6. **CTA** → `/contact`.

Notes:

- The reading column stays narrow regardless of viewport. Long measure is the one thing that will make this page fail.
- `generateStaticParams` over the six slugs; unknown slug → `notFound()`.
- Code blocks need horizontal scroll inside their own container, never on the page body.

## Build notes

- **Bodies are typed blocks, and the renderer's switch is exhaustive over the union.** Adding a block type to `ArticleBlock` fails the build in `article-body.tsx` rather than silently rendering nothing — the main reason for typed JSON over an HTML string.
- **Reading time is computed from the body**, never stored, so it cannot go stale. Code counts for a quarter of its word count, since code is scanned rather than read.
- **`author` is matched against `aboutTeam` by exact string.** A roster rename silently drops the byline to the company form instead of erroring — this already happened once, when the placeholder team was replaced with real names. Check both files together when either changes.
- **The reading column is capped at `max-w-2xl`** (672px, roughly 70 characters) at every width. Long measure is the single thing most likely to make a reading page fail.
- **Code blocks scroll inside their own container**; the page body never scrolls horizontally. Verified at 390px.
- **The detail hero is centred on the reading column**, unlike the left-aligned heroes elsewhere, so the eye never travels sideways to find where the body starts.
- **Section counters are computed** — "Keep reading" drops out when nothing else shares the category.
- **The six placeholders are all similar length**, so reading times cluster at 2–3 minutes. The figure is correct; real editorial content will vary more.

## Images

**Cover / banner.** `Article.coverImage` is optional. It renders on the detail page as a 21:9 banner wider than the reading column — the one element allowed to break the measure, so the article opens with something before it narrows to text — on the featured card at the top of the list, and as a small 16:9 thumbnail on every archive and related row.

**In-content images.** The `image` block carries diagrams, GIFs and screenshots:

```ts
{ type: 'image'; src?: string; alt: string; caption?: string; aspect?: '16/9' | '4/3' | '1/1' }
```

`alt` is required, not optional — a diagram that explains something is content, and an unlabelled one is invisible to anyone using a screen reader.

**Unfilled slots.** Every image slot renders through the shared `MediaSlot` snippet, which shows registration marks and a "pending" label rather than a broken image or invented artwork. That treatment previously existed only inside the project strip and was extracted so the two cannot drift apart.

**Reading time counts images.** A diagram costs about twelve seconds to parse, so it adds a fixed word-equivalent plus its caption. Otherwise adding a diagram would appear to make an article shorter.

## Engagement — designed, not wired

All four are switched by `articleEngagementOptions` in `constants/articles.ts`:

| Affordance  | State                                                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `views`     | Static count, abbreviated above a thousand (2,847 → 2.8k)                                                                                           |
| `reactions` | Heart with a count. **Rendered `disabled`** — a control that looks live and silently swallows the click is worse than one that says it is not ready |
| `share`     | X, LinkedIn and a permalink. **These genuinely work** — they are ordinary URLs, and are the only live part                                          |
| `comments`  | Threaded, one nesting level, with a disabled compose box reading "Not open yet", plus an empty state                                                |

Nothing persists. The form is disabled rather than left live to collect input that would be discarded.

**TODO: connect to the Articles API at Stage 10** — posting, moderation, pagination, real counts. Then remove `articleEngagement` and `articleComments` from constants.

Replies nest one level only. A thread is a conversation, not a tree, and unbounded nesting is unreadable on a phone.

## SEO

Both routes carry full metadata. This required an absolute origin, so `NEXT_PUBLIC_SITE_URL` was added to `.env.example` and `configs/site.ts` (falling back to localhost rather than a guessed production domain), with `metadataBase` set in the root layout.

- **Per-page:** title, description, canonical URL, keywords, author.
- **Open Graph:** `article` type with `publishedTime`, `authors` and `section` on detail pages; `website` on the list.
- **Twitter:** `summary_large_image` throughout.
- **JSON-LD:** `Article` (headline, dates, author, publisher, `timeRequired`, `inLanguage`) plus `BreadcrumbList`. Verified present in the rendered HTML.
- **OG images are generated per article** by `opengraph-image.tsx` using `ImageResponse` — 1200×630, brand ground, category, title, byline. Generated rather than hand-designed so every share card is correct on publish without anyone remembering to make one. System fonts only: loading the brand faces would ship font binaries into the edge bundle for a single PNG.

The root layout now also carries site-wide OG and Twitter defaults, which benefits every page, not just Articles.

## Search, filter and sort

The index is a client component (`articles-browser.tsx`) with the logic in `use-article-filters.ts`.

**Still server-rendered.** `"use client"` governs hydration, not rendering — the initial HTML contains every article, so the page is complete for crawlers and for anyone before JavaScript arrives. Filtering takes over after hydration.

**State lives in the query string, not component state.** `?q=`, `?category=`, `?tag=`, `?sort=`. That makes a filtered view linkable, survives a refresh, keeps the back button working, and means the URL contract already exists when the API takes over filtering at Stage 13. `router.replace` rather than `push`, so typing in the search box does not fill the history stack with one entry per keystroke.

| Control  | Behaviour                                                                     |
| -------- | ----------------------------------------------------------------------------- |
| Search   | Matches title, excerpt, category and tags. Multi-term: every term must appear |
| Category | **Multi-select** dropdown with checkboxes, over the four fixed values         |
| Tag      | **Multi-select** single-line rail that pans, over the derived tag list        |
| Sort     | Newest, oldest, longest read, shortest read                                   |

**Both facets are multi-select, and the two combine differently on purpose.** Within one facet the selections are OR-ed — ticking Engineering and AI widens the result. Across facets they are AND-ed — a category plus a tag narrows it. That is what a reader means by each action, which is why the two are not implemented with one shared rule. Selections travel as comma-separated values: `?category=Engineering,AI&tag=SaaS,APIs`.

**Category dropdown.** `DropdownMenuCheckboxItem`, with `onSelect` prevented so the menu stays open across several ticks — otherwise picking a second category costs a second trip. Each row draws its own always-visible box: the built-in indicator only appears once something is ticked, so an untouched menu gave no sign it accepted more than one answer. That box is presentational; the menu item itself carries the `menuitemcheckbox` role and `aria-checked`, and nesting a real checkbox inside would fight it for focus.

**Tag rail.** One line that pans rather than a block that wraps — at eighteen tags it already ran to three rows and pushed the results off screen, and the list only grows as articles are added. It reuses `useDragScroll`, the same hook the services teaser uses, which already handles the thing that matters here: suppressing the click when a drag ends over a control, so panning the rail never toggles a tag by accident. A right-edge fade signals there is more without adding a control.

**The featured card hides whenever a filter is active.** Promoting one piece above a set the reader has deliberately narrowed makes the result look wrong, so it only appears on the unfiltered index.

Unrecognised values are dropped rather than left to match nothing — an unknown category in the URL is filtered out of the selection, and an unknown sort falls back to newest-first.

An empty state appears when nothing matches, with a clear action rather than a dead end.

## Design constraints

See the layout table in [services-pages.md](services-pages.md) for everything already in use. The nearest neighbours to avoid are the **services index rows** (title-led, unnumbered) and the **portfolio drag carousel**.

## Open items for PM

| Item          | Needed                                                       |
| ------------- | ------------------------------------------------------------ |
| Article copy  | All six are placeholder, written to the site's voice         |
| Byline choice | `AUTHOR`, `COMPANY` or `NONE` — both first options are built |
| Cover images  | None supplied; slots render as honest empties                |
| Real authors  | Bylines currently point at the placeholder About roster      |
