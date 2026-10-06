# Articles CRUD

Phase AR in [progress-report.md](progress-report.md) (tasks AR1–AR8). Replaces the six placeholder articles in `apps/web/constants/articles.ts` with records managed from the dashboard. The public pages and their design are specified in [articles-pages.md](articles-pages.md); this doc covers the data, the body format, the rules and the dashboard. Who may do what follows [users-and-permissions.md](users-and-permissions.md). SEO fields follow [seo.md](../guides/seo.md#part-2--content-in-the-database) (task SEO5 for articles; SEO4 lands in AR7).

## Scope decisions — 2026-10-06

- **Same contract as the static roster, plus inline marks.** An article carries every field the pages render today (`Article` in `apps/web/types/articles.ts`), so `/articles` and `/articles/[slug]` switch data source without a redesign. The one format change: paragraph, list and quote text becomes **inline content** (spans with bold, italic, code and links) instead of plain strings, so articles can link to services, projects and each other — the strongest on-page SEO signal the site has ([seo.md](../guides/seo.md#articles-the-editor-matters-for-seo)).
- **A block editor, not a WYSIWYG.** The body is edited as an ordered list of typed blocks — the same `ArticleBlock` union the web renderer is written against — in a new shared package, `packages/text-editor`. Inline marks are typed in a small markdown-like syntax inside each block's text box and stored as spans, never as markup. Tiptap/ProseMirror was rejected: its document JSON is a different shape from `ArticleBlock[]`, so every save and every render would need a converter, and it adds a large dependency for six block types.
- **Byline: a person from the Team, optional.** The author is a dashboard user who is **shown on the website** (the About page roster), picked from a dropdown. An article without one — or whose author is later hidden from the website — renders the company byline. The site-wide treatment stays the `articleByline` switch in `apps/web/constants/articles.ts` (`AUTHOR` default); **PM still to choose** between `AUTHOR` and `COMPANY`, which needs no data change either way.
- **Draft / Published with an optional publish date**, like projects. An article is public when it is **Published, not deleted, and its publish date is empty or past** — computed at read time, no job.
- **Changing a slug keeps the old URL working**, through the shared `slug_redirects` table (`entity_type = ARTICLE`), exactly as for services ([services-crud.md](services-crud.md#slug-redirects)).
- **Deleting is never blocked.** Nothing references an article; its slug (and old slugs) stay reserved.
- **Engagement stays static** (views, reactions, comments — decided 2026-10-03). Only the share links work, as today.
- **Nothing is hard-deleted; every change records who made it** (project-wide rule).

## Fields

| Field            | Rule                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title            | Required, ≤ 120 chars. The page's only `h1`                                                                                                                |
| Slug             | Generated from the title on create; unique across live and deleted articles; editable (lower-case letters, digits, hyphens). The URL is `/articles/<slug>` |
| Excerpt          | Required, ≤ 300 chars — the list entry, the detail hero lead, and the meta description fallback                                                            |
| Category         | One of the four `ArticleCategory` values (`ENGINEERING`, `PRODUCT`, `AI`, `PRACTICE`)                                                                      |
| Tags             | 0–8, each ≤ 32 chars, trimmed, duplicates (ignoring case) dropped. Open vocabulary; the form suggests tags already in use                                  |
| Author           | Optional — a user shown on the website. Shown with their name, designation, photo and links                                                                |
| Cover            | Optional image, via the media library (`articleCover` preset, 1920 × 1080 `cover`), ≤ 2 MB. Empty → the registration-mark slot                             |
| Body             | 1–200 blocks, see [Body format](#body-format)                                                                                                              |
| SEO title        | Optional, ≤ 70 chars; the counter warns past 60. Empty → the title                                                                                         |
| SEO description  | Optional, ≤ 200 chars; the counter warns outside 140–160. Empty → the excerpt                                                                              |
| Share image      | Optional, 1200 × 630 (`shareImage` preset), ≤ 2 MB. Empty → the cover; no cover → the generated card                                                       |
| Hide from search | `noindex`, default off. For thin or announcement posts: the page still renders but carries `robots: noindex` and stays out of the sitemap                  |
| Status           | `DRAFT` / `PUBLISHED`                                                                                                                                      |
| Publish date     | Optional date-time. In the future → Scheduled. The public date is `publish_at ?? first_published_at`                                                       |

Reading time stays **computed from the body** at render time, never stored.

## Body format

`body` is a JSONB array of blocks. The API validates the whole union with Zod and refuses anything else (400, naming the block index).

```ts
type TextSpan = {
	text: string;
	bold?: true;
	italic?: true;
	code?: true;
	/** `/path` on this site, or an `https://` URL. */
	href?: string;
};
type InlineContent = TextSpan[];

type ArticleBlock =
	| { type: 'paragraph'; content: InlineContent }
	| { type: 'heading'; level: 2 | 3; text: string }
	| { type: 'list'; ordered?: boolean; items: InlineContent[] }
	| { type: 'quote'; content: InlineContent; attribution?: string }
	| { type: 'code'; language: string; code: string }
	| {
			type: 'image';
			/** Stored: the `media_files.uuid`. Absent → the reserved slot. */
			mediaUuid?: string;
			/** Responses only: the URL the API resolved `mediaUuid` to. */
			src?: string;
			alt: string;
			caption?: string;
			aspect?: '16/9' | '4/3' | '1/1';
	  };
```

| Block     | Limits                                                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Paragraph | 1–100 spans, ≤ 5,000 chars in total                                                                                                           |
| Heading   | Level 2 or 3 only (the title is the `h1`), ≤ 120 chars, plain text                                                                            |
| List      | 1–30 items, each ≤ 1,000 chars                                                                                                                |
| Quote     | ≤ 1,000 chars; attribution optional, ≤ 120                                                                                                    |
| Code      | ≤ 10,000 chars; language required, ≤ 30 (`ts`, `sql`, `text`…), shown as a label                                                              |
| Image     | `alt` **required**, ≤ 200 (the API enforces it, not just the type); caption ≤ 300. `mediaUuid` must be an `ARTICLE_IMAGE` upload, not deleted |

**Spans.** Empty spans are dropped and neighbours with identical marks merged on save, so the same text always stores the same way. A link's `href` is either a site path (`/services/mvp-development`) or an absolute `https://` URL — no `javascript:`, `mailto:` or `http:`. On the site, internal links use `<Link>`; external ones open in a new tab with `rel="noopener noreferrer"`.

**Typing marks in the editor.** Each text box takes `**bold**`, `_italic_`, `` `code` `` and `[link text](/path or https://…)`, converted to spans on every change and back to this syntax when the article loads. A character that would otherwise start a mark can be escaped with `\`. The form shows a live preview of the block under the box.

## Visibility

**Public** (the website and the public API) — an article appears only if it is **not deleted**, **Published**, and its **publish date is empty or past**. Drafts, scheduled and deleted articles are invisible, including their detail URL (404) — unless the slug is an old one of a visible article, which redirects.

The dashboard shows a status badge per article: **Draft**, **Scheduled** (Published, date in the future), **Live**.

A scheduled article appears on the site at the next revalidation after its date: any article save, a deploy, or — when `ENABLE_PERIODIC_REVALIDATION=true` in apps/web — within five minutes (same rule as projects).

## Permissions

Feature `ARTICLES` (admins always have all four):

| Action   | Allows                                                                |
| -------- | --------------------------------------------------------------------- |
| `VIEW`   | The Articles list and each article's form, read-only                  |
| `CREATE` | New articles (they start as Draft)                                    |
| `EDIT`   | Every field, the body, cover, share image and body images, publishing |
| `DELETE` | Soft delete                                                           |

The author dropdown reads the team list (users shown on the website) through `GET /api/articles/authors` with the `ARTICLES` `VIEW` grant, so picking an author doesn't need user-management access.

## Data

- `articles` — already created in migration `20261003094516_add_content_tables`. AR2/AR3 add `seo_title`, `seo_description`, `og_image_id` → `media_files`, and `noindex` (default false).
- `media_purpose` gains `ARTICLE_OG_IMAGE`; `ARTICLE_COVER` and `ARTICLE_IMAGE` exist.
- Body images are uploaded first (`ARTICLE_IMAGE`, `articleBodyImage` preset: 1600 × 1600 `inside`, ≤ 2 MB) and referenced by `mediaUuid`. Removing an image block leaves the media row in place (nothing is hard-deleted); the uploads are cheap, and an undo in the form can still find them.
- `slug_redirects` — shared with services; `entity_type = ARTICLE`.
- **Seed** (`pnpm --filter api db:seed`): the six placeholder articles in `apps/api/prisma/seed-data/articles.json`, created Published with their current dates as `publish_at`, authored by the Super Admin, the author matched by name against website users (unmatched → no author). Plain-string text becomes one span. Only creates slugs that don't exist yet.

## API

| Endpoint                                       | Who               | Purpose                                                                                                                                                |
| ---------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /api/articles`                            | `ARTICLES` `VIEW` | Dashboard list — `?search=` (title, slug, excerpt, tags), `?category=`, `?visibility=DRAFT\|SCHEDULED\|LIVE`. Newest first (public date, then created) |
| `GET /api/articles/tags`                       | `VIEW`            | Every tag in use on a non-deleted article, with counts — the form's suggestions                                                                        |
| `GET /api/articles/authors`                    | `VIEW`            | Users shown on the website: `{ uuid, name, designation }`                                                                                              |
| `GET /api/articles/:uuid`                      | `VIEW`            | One article, all fields, image blocks with `src` resolved, authorship                                                                                  |
| `POST /api/articles`                           | `CREATE`          | New Draft; slug optional (from the title, `-2`, `-3`… if taken); 409 on a taken slug                                                                   |
| `PATCH /api/articles/:uuid`                    | `EDIT`            | Any fields and status. A slug change records a redirect; publishing sets `first_published_at` once                                                     |
| `DELETE /api/articles/:uuid`                   | `DELETE`          | Soft delete                                                                                                                                            |
| `POST` / `DELETE /api/articles/:uuid/cover`    | `EDIT`            | Upload (multipart `file` ≤ 2 MB) or clear the cover                                                                                                    |
| `POST` / `DELETE /api/articles/:uuid/og-image` | `EDIT`            | Upload or clear the share image                                                                                                                        |
| `POST /api/articles/:uuid/images`              | `EDIT`            | Upload a body image → `{ uuid, url, width, height }`, for an image block                                                                               |
| `GET /api/public/articles`                     | Public            | Every visible article, card fields, newest first. Optional `?category=`, `?tag=`, `?search=`, `?sort=newest\|oldest`                                   |
| `GET /api/public/articles/:slug`               | Public            | One visible article with body, author, SEO fields and dates — 404 otherwise                                                                            |
| `GET /api/public/articles/redirects/:slug`     | Public            | `{ slug }` — the current slug of the visible article an old slug belonged to; 404 otherwise                                                            |

Public responses carry the web's `Article` shape: `slug`, `title`, `excerpt`, `category` (enum key), `tags`, `publishedAt` (ISO), `updatedAt` (ISO), `author` (`{ name, role, photo?, links }`, left out when none or hidden), `coverImage` (URL), and on the detail also `body` (image blocks with `src`, never `mediaUuid`), `seoTitle`, `seoDescription`, `ogImage` (URL) and `noindex`. No ids, status or authorship. Optional keys are left out rather than `null`.

"Related" on the detail page stays **derived on the website** from the public list (same category, newest first), as today — no endpoint.

Every change revalidates the `articles` cache tag.

## Website integration (AR7)

- `/articles` and `/articles/[slug]` stay statically generated and read through `@workspace/api-services` (`apps/web/utils/articles-api.ts`), tagged `articles`. The list's filters keep working on the client over the fetched list.
- The detail page asks the redirects endpoint before 404ing, and uses the SEO fields in its metadata: `seo_title ?? title`, `seo_description ?? excerpt`, `noindex`, plus `article:published_time`, `article:modified_time` (`updatedAt`), `article:author` (the About page URL), `article:section` and one `article:tag` per tag, and the same dates in the `Article` JSON-LD (SEO4).
- The share card route serves the share image, else the cover, else the generated card ([seo.md](../guides/seo.md)).
- The byline reads the author from the API instead of matching `aboutTeam` by name — the rename trap described in [articles-pages.md](articles-pages.md#build-notes) goes away.
- `constants/articles.ts` keeps page copy, the byline switch and the static engagement data; the roster moves to `seed-data/articles.json`.

## Dashboard

- **Articles list** — cover thumbnail, title, slug, category, tags, author, status badge (Draft / Scheduled / Live), public date, last updated by. Search, category and status filters. Visible with `VIEW`.
- **Article form** — sections: Basics (title, slug, excerpt, category, tags), Author, Cover, Body (the block editor), Search & social (SEO title/description with counters, the search-result preview shared with Services, share image, hide from search), Publishing (status, publish date). Read-only without `EDIT`.
- **Body editor** (`packages/text-editor`) — add a block from a menu after any block; move up / down and remove each block (buttons, keyboard-reachable — the dashboard has no drag-and-drop); per-block fields as in [Body format](#body-format) with a live preview; image blocks upload through the media library and require alt text before Save.
- **Saving** — fields and body save together with the form's Save. Cover and share image save as they change and only once the article exists, like the service share image; body images upload once the article exists (the editor says so on a new article).
- **Delete** — confirmed; only with `DELETE`.
- Each article shows "Created by … · Last changed by …".
