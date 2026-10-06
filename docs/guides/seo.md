# SEO & AI search — landing app (`apps/web`) and its content

People now find services two ways: classic search engines, and AI assistants (ChatGPT, Perplexity, Gemini, Grok, Claude, Copilot) that read the web and cite sources in their answers. Most of the work serves both; [Part 4](#part-4--ai-search-visibility) covers what's specific to AI. Each part splits into what the **code** must do (once, by a developer) and what the **content** in the database must do (every time someone writes or edits in the dashboard). Check the Next.js metadata docs bundled in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/` before writing any of it; the API changes between majors.

## Part 1 — Codebase

### Where things stand (2026-10-03)

| Item                                               | State                                                                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `metadataBase`, title template, default OG/Twitter | Done, in `app/layout.tsx`                                                                                                        |
| Per-page `metadata` / `generateMetadata`           | Every page calls `buildPageMetadata()` (`utils/metadata.ts`, SEO1): title, description, canonical, robots, full OG + Twitter set |
| Home page's own title/description                  | Missing, so it falls back to the root default ("Flizz")                                                                          |
| JSON-LD                                            | `Article` + `BreadcrumbList` on articles, and on portfolio details. Missing on home and services                                 |
| Generated OG images                                | Articles and portfolio details. Missing for home, services and the list pages                                                    |
| `sitemap.xml`                                      | **Missing**                                                                                                                      |
| `robots.txt`                                       | **Missing**                                                                                                                      |
| Canonical URLs                                     | Done — set by `buildPageMetadata()` from each page's path                                                                        |
| Dashboard `noindex`                                | Done, in `apps/dashboard/app/layout.tsx`                                                                                         |
| Preview deployments kept out of Google             | **Missing**                                                                                                                      |
| Redirect when a slug changes                       | **Missing**. Slugs are editable, so old links 404                                                                                |

### Tasks, in priority order

1. **`app/robots.ts`**: allow `/`, disallow `/api/`, and point to `${siteUrl}/sitemap.xml`. When the deployment isn't production (`VERCEL_ENV !== 'production'`, or a dedicated `NEXT_PUBLIC_INDEXABLE` flag after leaving Vercel), return `disallow: '/'` **and** set `robots: { index: false }` in the root metadata. Otherwise previews get indexed as duplicates of the real site. Production rules for AI crawlers are in [Part 4](#part-4--ai-search-visibility).
2. **`app/sitemap.ts`**: static routes plus every published service, project and article from the API, with `lastModified` set to the record's `updatedAt`. It must use the same public endpoints the pages use, so drafts and future-dated items stay out. Revalidate it on the same tags as the pages.
3. **Canonical on every page**: `alternates: { canonical: '/services/<slug>' }`. List pages with filters (`/articles?tag=…`) canonicalise to the bare list URL.
4. **Home metadata** (and everything in the per-page spec below): a real title (about 50–60 characters, for example "Custom Software & AI Automation Studio — Flizz") and a description of about 150 characters.
5. **Structured data** (see the bundled `02-guides/json-ld.md`):
    - Root layout or home: `Organization` (name, url, logo, `sameAs` social profiles, contact email) and `WebSite`.
    - `/services/[slug]`: `Service` with `provider` → the Organization, plus `BreadcrumbList`.
    - `/about`: `AboutPage`; team members as `Person` with `sameAs` LinkedIn.
    - Contact: `ContactPage`.
    - Home FAQ and the contact FAQ: `FAQPage`, **only** if the questions are visible on the page.
    - Validate each one with [Rich Results Test](https://search.google.com/test/rich-results).
6. **OG images** for home, `/services/[slug]` and the list pages (`opengraph-image.tsx`, same approach as articles).
7. **Slug redirects**: when an admin changes a slug, keep the old one and 301 it to the new one. Database: a `slug_redirects` table (`entity_type`, `old_slug`, `entity_id`, timestamps), written by the API on slug change. Web: `proxy.ts` or the detail page's not-found path looks the old slug up and calls `permanentRedirect()`. Plan this during S1 (services) and AR1 (articles), and retrofit projects.
8. **Search engine verification**: `metadata.verification.google` (and Bing) in the root layout. Then submit the sitemap in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster Tools.

### Meta tags and Open Graph: the per-page spec

Every public page must output the full set below. Search engines use the meta tags for the result snippet. LinkedIn, Facebook, WhatsApp, Slack, X and AI chat link previews use the Open Graph (OG) tags for the share card.

**The trap in today's code:** Next.js merges metadata **shallowly**. A page that sets `openGraph` replaces the root layout's whole `openGraph` object, and a page that doesn't set it inherits the root's as-is. So today:

- About, Services, Contact and every service detail page share with the **home page's** OG title and URL ("Flizz", `/`).
- Portfolio and Articles pages lose the root's `locale`.
- Nothing except portfolio and article details has an **OG image**, so their share cards are text-only.

The fix is one helper that every page calls, so no page can forget a field (task SEO1).

#### Tags every page outputs

| Tag                                        | Rule                                                                                                                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `<title>`                                  | 50–60 characters, unique, keyword first. Template `%s — Flizz` (one brand name, see Part 4)                                               |
| `meta description`                         | 140–160 characters, unique, says what the reader gets                                                                                     |
| `link rel=canonical`                       | Absolute URL of the page without query string                                                                                             |
| `meta robots`                              | `index, follow` in production; `noindex` on previews and on records with `noindex = true`                                                 |
| `og:title` / `og:description`              | Same as title and description by default (title without the `— Flizz` suffix); can be overridden per record                               |
| `og:url`                                   | Same as canonical                                                                                                                         |
| `og:type`                                  | `website` for home, lists and service pages; `article` for article and project details                                                    |
| `og:site_name`, `og:locale`                | Brand name, `en_GB`, on **every** page                                                                                                    |
| `og:image` (+ `:width`, `:height`, `:alt`) | 1200×630 PNG/JPG, under 1 MB, important text inside the centre ~1000×500 (platforms crop). `alt` describes the image                      |
| `twitter:card`                             | `summary_large_image`; `twitter:title`, `twitter:description` and `twitter:image` mirror OG. Add `twitter:site` once there's an X account |
| `meta keywords`                            | Optional. **Google ignores it.** Harmless, low value; derive it from tags or category, never hand-maintain it                             |

#### Per route

| Route               | Title / description source                         | OG type | OG image                                                  | Extras                                                                                                                                                                                                 |
| ------------------- | -------------------------------------------------- | ------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                 | Constants (or `page_seo`, task SEO6)               | website | Site default (root `opengraph-image.tsx`)                 | `Organization` + `WebSite` JSON-LD                                                                                                                                                                     |
| `/about`            | Constants (or `page_seo`)                          | website | Default, or a team photo                                  | `AboutPage` JSON-LD                                                                                                                                                                                    |
| `/services`         | Constants (or `page_seo`)                          | website | Generated list card                                       |                                                                                                                                                                                                        |
| `/services/[slug]`  | `seo_title ?? title`, `seo_description ?? summary` | website | `og_image ?? generated` (title + category)                | `Service` + `FAQPage` + `BreadcrumbList` JSON-LD                                                                                                                                                       |
| `/portfolio`        | Constants (or `page_seo`)                          | website | Generated list card                                       |                                                                                                                                                                                                        |
| `/portfolio/[slug]` | `seo_title ?? name`, `seo_description ?? summary`  | article | `og_image ?? cover ?? generated` (exists today)           | `article:section` = sector                                                                                                                                                                             |
| `/articles`         | Constants (or `page_seo`)                          | website | Generated list card                                       | Filtered views (`?tag=`) canonicalise to `/articles`                                                                                                                                                   |
| `/articles/[slug]`  | `seo_title ?? title`, `seo_description ?? excerpt` | article | `og_image ?? cover ?? generated` (generated exists today) | `article:published_time`, `article:modified_time` (`updatedAt`), `article:author` (author's About URL), `article:section` (category), one `article:tag` per tag; `Article` JSON-LD with the same dates |
| `/contact`          | Constants (or `page_seo`)                          | website | Default                                                   | `ContactPage` JSON-LD                                                                                                                                                                                  |

Database fields behind the `??` fallbacks are in [Part 2](#part-2--content-in-the-database).

#### Testing a page

- View Source (or `curl -s <url> | grep -E '<title|og:|twitter:|canonical|description'`) on a **production build**.
- Share-card previews: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/), [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (also forces a re-scrape after you change an image), and [opengraph.xyz](https://www.opengraph.xyz/) for every platform at once.
- Platforms cache cards for days. After changing an OG image, re-scrape in the debuggers above.

### Rules for every new page or section

- Exactly one `<h1>`, then `h2`/`h3` in order. Never pick a heading level for its size; style it instead.
- Internal links use `<Link>`, and their text says where they go ("See the SaaS case study", not "Click here").
- Images use `next/image` with real `alt` text. Decorative images get `alt=""`.
- Text that matters for ranking (headlines, service copy) must be in the server-rendered HTML, not injected after hydration or hidden in a canvas or WebGL scene. Check with View Source, or `curl <url> | grep "<headline>"`.
- Pages are static or ISR (Server Components). Don't move public content into client-only fetches.
- Speed is a ranking signal: keep Core Web Vitals green. See [quality-audits.md](quality-audits.md).
- A `not-found.tsx` that returns a real 404 status, never a 200 "soft 404".

## Part 2 — Content in the database

### Fields to add during each CRUD's requirements step

All optional. When a field is empty, fall back to the existing content.

| Field             | Applies to                   | Fallback               | Note                           |
| ----------------- | ---------------------------- | ---------------------- | ------------------------------ |
| `seo_title`       | articles, services, projects | `title` / `name`       | Up to about 60 characters      |
| `seo_description` | articles, services, projects | `excerpt` / `summary`  | 140–160 characters             |
| `og_image_id`     | articles, services, projects | the generated OG image | 1200×630                       |
| `noindex`         | articles                     | false                  | For thin or announcement posts |

**Static pages** (home, about, the list pages, contact) have no record, so their meta lives in constants and changes need a deploy. To let the PM edit them from the dashboard, add a small `page_seo` table: one row per page key (an enum: `HOME`, `ABOUT`, `SERVICES`, `PORTFOLIO`, `ARTICLES`, `CONTACT`) with the same four fields, constants as the fallback, and the web page revalidated on save. This is optional (task SEO6).

Add these in S1 (services), AR1 (articles), and a small migration for projects. The dashboard form shows a search-result preview (title, URL, description, with a character count turning red when too long).

### Articles: the editor matters for SEO

- **Inline links.** Today `ArticleBlock` paragraphs are plain strings, so an article **cannot link** to a service, a project or another article. Internal links are one of the strongest on-page signals. AR1 should allow inline marks (link, bold, italic, inline code) in paragraph, list and quote text.
- **Headings** are limited to h2/h3. The title is the h1. Keep it that way.
- **Image blocks require `alt`.** Already enforced in the type; the API must enforce it too.
- **`dateModified`**: the JSON-LD should use `updatedAt` as well as the publish date, so edits show as fresh.
- **Author** (E-E-A-T): byline a real person, link their About entry, and include `sameAs` (LinkedIn) in the `Person` JSON-LD. A named engineer outranks "Flizz Team".

### Writing checklist (for whoever enters content)

- **Slug**: short, lowercase, hyphenated, the main keyword, no dates or stop-words (`saas-application-development`, not `our-saas-app-dev-service-2025`). Don't change it after publishing unless redirects exist.
- **Title**: the keyword near the front, ≤ 60 characters, unique across the site.
- **Description/excerpt**: 140–160 characters; say what the reader gets. It's the snippet under the link in Google.
- **One topic per page.** Two services or articles competing for the same keyword hurt each other.
- **Link in and out.** Each article links to at least one relevant service or project. Each service links to the projects that prove it (the `service_id` link does this automatically).
- **Images**: compressed (the media library resizes to WebP), descriptive `alt`, no text-only images.
- **Real numbers and names.** Specific results ("quote time from two days to under an hour") rank and convert better than adjectives. Project figures are placeholders today; see the PM list in the progress report.
- **Keep it fresh.** Revisit top articles yearly; a real update changes `updatedAt` and the sitemap tells Google.

## Part 3 — After launch

- Search Console: check **Pages** (indexed vs excluded), **Core Web Vitals**, and **Performance** (queries and CTR) monthly. Link it to GA4 (see [analytics.md](analytics.md)).
- Fix "Crawled – currently not indexed" pages by improving content or internal links, not by resubmitting.
- Re-run the Rich Results Test after any JSON-LD change.

## Part 4 — AI search visibility

AI assistants answer "who builds X" questions by searching the web, reading a few pages and citing them. To be cited, the site has to be **reachable** by their crawlers, **readable** without JavaScript, and **quotable**: short, specific, self-contained passages. Classic SEO is the foundation. ChatGPT search and Copilot lean on Bing's index and Gemini on Google's, so Parts 1–3 still matter most.

### Code

1. **Let the AI crawlers in** (`app/robots.ts`). Each company runs separate bots for _search/answers_ and for _model training_. Always allow the search ones. Allowing training is a business choice; for a marketing site, being known to the models is usually the goal, so the recommendation is to allow all.

    | Company    | Search / user-triggered (allow)                              | Training (your choice) |
    | ---------- | ------------------------------------------------------------ | ---------------------- |
    | OpenAI     | `OAI-SearchBot`, `ChatGPT-User`                              | `GPTBot`               |
    | Anthropic  | `Claude-SearchBot`, `Claude-User`                            | `ClaudeBot`            |
    | Perplexity | `PerplexityBot`, `Perplexity-User`                           | none                   |
    | Google     | `Googlebot` (Gemini uses Google's index)                     | `Google-Extended`      |
    | Microsoft  | `Bingbot` (ChatGPT search, Copilot)                          | none                   |
    | Apple      | `Applebot`                                                   | `Applebot-Extended`    |
    | xAI (Grok) | No widely documented crawler yet; Grok also draws on X posts | none                   |

    Bot names change. Check each vendor's crawler documentation when writing the file, and re-check yearly.

2. **Check nothing upstream blocks them.** Cloudflare ("Block AI bots" / Bot Fight Mode) and some Vercel firewall rules block AI crawlers by default. A perfect `robots.txt` doesn't help if the firewall answers 403. Test with `curl -A "OAI-SearchBot" -I https://<domain>/services` and expect `200`.
3. **Content must be in the HTML.** Most AI crawlers don't run JavaScript. The pages are statically rendered, which is right, but anything inside a canvas or WebGL scene, inside an animation that only mounts on the client, or behind a click (tabs, accordions that render on open) is invisible to them. Collapsed FAQ answers must still be in the HTML.
4. **Structured data** (Part 1, task 5) helps AI systems identify the company and its offer: `Organization` with `sameAs`, `Service`, `FAQPage`, `Article` with author and dates.
5. **`/llms.txt`**: a proposed convention, a plain markdown file at the site root that summarises the company and lists the key pages with one-line descriptions. Adoption by AI vendors is uncertain, but it's cheap. Generate it as a route handler (`app/llms.txt/route.ts`) from the same API data as the sitemap, so it never goes stale.
6. **Bing Webmaster Tools + IndexNow.** Verify the site in Bing (ChatGPT search and Copilot depend on its index). Have the API ping IndexNow when a service, project or article is published or updated, next to the existing web revalidation call, so changes reach Bing in minutes instead of weeks.

### Content

AI answers quote **passages**, not pages. Write so that any single paragraph can be lifted out and still make sense:

- **Answer first.** Open each service page and article with one or two sentences that directly answer the question someone would ask ("Flizz builds MVPs for early-stage founders in 6–10 weeks, …"), then the detail.
- **Use the questions people actually ask as headings.** "How long does an MVP take?", "What does SaaS development cost?". Then answer under each heading in two to four sentences.
- **Be specific and factual.** Durations, team sizes, technologies, industries served, where the team is based, typical engagement shapes, results with numbers. Models prefer concrete, checkable claims over adjectives. Vague copy ("innovative solutions") never gets cited.
- **Keep the company's facts consistent everywhere**: name, one-line description, location, services list. `siteConfig` currently uses both "Flizz" and "Flizzio". Pick one canonical brand name and use the other only as an alternate (`alternateName` in JSON-LD), or models may treat them as two companies.
- **Add an FAQ to each service.** Plan a `faqs` JSON field (`[{ question, answer }]`) on `services` in S1, rendered visibly and as `FAQPage` JSON-LD.
- **Write comparison and decision content** in articles: "Custom software vs no-code for operations teams", "When to rebuild a legacy system". These match how people prompt AI assistants.
- **Show dates and authors.** Visible "Updated <date>" and a named author with credentials signal freshness and expertise.
- **Make the About page factual**: founding year, location, team size, founders and their background, notable clients and industries. AI answers about "who is Flizz" come from here.

### Off-site (often the bigger lever)

AI answers lean heavily on **third-party** sources. A company that only describes itself is rarely cited. Build presence where the models look:

- Agency directories with reviews: Clutch, GoodFirms, G2 (for any product), DesignRush.
- Google Business Profile and LinkedIn company page, with the same description as the site.
- Case-study mentions on clients' sites, guest articles, podcasts, and genuine answers in relevant Reddit and community threads.
- Link all of them from the `Organization` JSON-LD `sameAs`.

### Measuring

- **GA4**: AI assistants show up as referrals (`chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com`, `grok.com`). Create a custom channel group "AI assistants" matching those sources, so the traffic is visible next to organic search. See [analytics.md](analytics.md).
- **Crawler hits**: check the hosting logs (or Cloudflare analytics) for the bot names above, to confirm they're crawling and getting `200`.
- **Prompt tracking**: keep a list of 10–20 questions a prospect would ask ("best agency to build a SaaS MVP in <region>", "who can modernise a legacy operations system"). Once a month, ask them in ChatGPT, Perplexity, Gemini, Claude and Grok, and record whether Flizz is mentioned or cited and which page or source was used. Paid tools automate this; a spreadsheet is enough to start.
