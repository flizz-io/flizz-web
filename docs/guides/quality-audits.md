# Quality audits — security, performance, Lighthouse and more

How to get an audit report from Claude Code for any of the three apps, and how to turn it into fixes, either by instructing Claude or by doing it yourself. Copy the prompts as they are; replace the `<…>` parts.

## The workflow (same for every audit)

1. **Report first, no fixes.** Ask for findings only, ranked by severity, each with `file:line`, the concrete risk and a suggested fix. Fixing while auditing hides what was found.
2. **Save the report** to `docs/reports/<yyyy-mm-dd>-<area>.md` (or ask Claude to publish it as an artifact if you want to share it). It's the baseline the next audit is compared against.
3. **Triage it yourself**: mark each finding _fix now_, _later_ (add a `// TODO:` or a progress-report line) or _won't fix_ (with the reason).
4. **Fix one finding (or one small group) per commit**, on a feature branch, with typecheck, lint and a re-test after each.
5. **Re-measure** with the same tool and settings as the baseline, and note the before/after in the report.

Run the full set before each production launch, and the relevant one after any large feature (for example, the security audit after Contact Us, because it's the first public write endpoint).

## 1. Security

**Built-in commands:**

- `/security-review` reviews the pending changes on the current branch. Run it before opening every PR that touches `apps/api`, auth, uploads or public forms.
- `/code-review high` is a broader correctness review of the current diff. Add `--fix` to apply the findings.

**Whole-codebase audit prompt:**

```
Do a security audit of the whole monorepo — report only, don't change code.
Cover: apps/api (auth & session cookies, requireAuth/requireAdmin/requirePermission
on every route, IDOR via uuid, Zod validation on every input, file uploads in
packages/media-library, error responses leaking internals, CORS, rate limiting,
security headers, secrets in code or logs), apps/web and apps/dashboard (XSS via
dangerouslySetInnerHTML, env vars exposed with NEXT_PUBLIC_, the /api/revalidate
secret, open redirects), and dependencies (run `pnpm audit --prod`).
Rank findings Critical/High/Medium/Low with file:line, exploit scenario and fix.
Write it to docs/reports/<date>-security.md.
```

**Known gaps to expect (2026-10-03):** the API has no security-headers middleware (for example `helmet`) and no rate limiting; the web app has no Content Security Policy. Contact Us (CM2) is the forcing deadline for rate limiting. The bundled guide `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` covers CSP.

**Dependencies:** `pnpm audit --prod` and `pnpm outdated -r`. Ask Claude to explain and upgrade one package at a time; majors (Next, Prisma 8, Zod) get their own branch and a read of the upgrade guide first.

## 2. Performance & Lighthouse

**Always measure a production build**, never `pnpm dev` (dev mode is many times slower and the scores mean nothing):

```bash
pnpm build && pnpm --filter web start      # serves on :3300
npx lighthouse http://localhost:3300/ --preset=desktop --output=html --output-path=./lh-home-desktop.html
npx lighthouse http://localhost:3300/ --form-factor=mobile --output=html --output-path=./lh-home-mobile.html
```

Run each page **3 times and take the median**. Scores vary between runs. Mobile is the score that matters (Google indexes mobile-first). Better still, use the real numbers: PageSpeed Insights or the Search Console Core Web Vitals report on the live domain.

**Prompt:**

```
Run a Lighthouse audit (production build, mobile and desktop, 3 runs each, median)
on: /, /about, /services, /services/mvp-development, /portfolio,
/portfolio/<a slug>, /articles, /articles/<a slug>, /contact.
Report a table of Performance/Accessibility/Best Practices/SEO per page plus
LCP, CLS, INP/TBT, and for every score under 90 the top causes with file:line
and a fix. Also run `pnpm next experimental-analyze` in apps/web and list the
largest client bundles and what pulls them in. Report only; write it to
docs/reports/<date>-performance.md.
```

**Targets:** Performance ≥ 90 mobile and Accessibility, Best Practices and SEO ≥ 95. Core Web Vitals: LCP < 2.5 s, CLS < 0.1, INP < 200 ms.

**Where this site is likely to lose points**, so check these first:

- **GSAP ScrollSmoother and the cinematic hero**: main-thread time (TBT/INP) on mobile. Check that animations lazy-load and respect `prefers-reduced-motion`.
- **Three.js service visuals** (`@workspace/service-visuals`): large client bundle. Should be `dynamic(() => …, { ssr: false })` and mounted only when scrolled into view.
- **Fonts**: four families are loaded in the root layout. Each one costs. Check weights and subsets and whether all four are used above the fold.
- **Hero LCP image or text**: must not be hidden behind an intro animation or loaded lazily.
- **Third-party scripts** (Crisp, later GA, Pixel, Calendly): must stay `lazyOnload`/`afterInteractive`. Re-measure after adding each.

**API performance prompt:**

```
Audit apps/api for performance — report only. Look for N+1 Prisma queries,
missing indexes for the where/orderBy each endpoint uses (compare against
schema.prisma), unbounded list endpoints without pagination, over-fetching
(select/include), and slow cold starts on Vercel. Suggest fixes with file:line.
```

## 3. Accessibility

Lighthouse catches only about 30% of accessibility issues. Prompt:

```
Do an accessibility audit of apps/web and apps/dashboard — report only:
keyboard navigation (focus order, visible focus, focus traps in dialogs/menus),
heading order, alt text, form labels and error announcements (contact form),
colour contrast in light AND dark themes, reduced-motion handling for GSAP,
and screen-reader names for icon-only buttons. Use the browser at 390px and
1440px widths. Rank by WCAG 2.2 AA severity.
```

## 4. SEO

See [seo.md](seo.md) for the checklist. Prompt:

```
Audit apps/web SEO and AI-search visibility against docs/guides/seo.md
(including Part 4: AI crawler access with a curl per bot, content in the raw HTML) — report which items are done,
missing or wrong, per page, with the rendered metadata/JSON-LD as evidence
(production build). Report only.
```

## 5. Code health (periodic)

```
Review the monorepo for code health against .claude/rules/conventions.md —
dead code, duplicated logic that belongs in a shared package, `any`, oversized
components, hardcoded strings, missing error/empty/loading states, and
inconsistent patterns between features. Report only, grouped by app.
```

Use `/simplify` on a finished feature branch for a cleanup pass that applies fixes directly.

## 6. Production readiness (before launch)

```
Check production readiness — report only: every env var in each .env.example is
set on the hosting project; dashboard noindex; robots/sitemap correct for
production vs preview; error pages (404/500) return correct status; API health
check; logs don't contain secrets or personal data; database backups (Neon
branch/PITR) configured; pending migrations in apps/api/README.md applied;
the "Engineering cleanup before production" list in the progress report done.
```

Also see the bundled `node_modules/next/dist/docs/01-app/02-guides/production-checklist.md`.

## Instructing Claude to fix

Once a report is triaged:

```
Fix finding <#> from docs/reports/<file>.md. Keep the change minimal, follow
.claude/rules/conventions.md, run typecheck + lint, re-check the finding
(re-run the same Lighthouse page / test), update the report's status column,
and commit with a conventional message.
```

Fix one finding at a time; that way a regression points at one commit.
