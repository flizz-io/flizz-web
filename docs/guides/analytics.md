# Analytics — Google Analytics 4 & Meta Pixel (`apps/web`)

How to add GA4 and the Meta Pixel to the landing app yourself. Nothing here is built yet. The dashboard never gets analytics: it's internal and `noindex`.

Before you start, check the Next.js version in `apps/web/package.json` (16.2 when this was written). The bundled docs in `node_modules/next/dist/docs/01-app/02-guides/third-party-libraries.md` are the reference for the `@next/third-parties` API.

## 0. Decide two things first

| Decision                       | Options                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Direct tags or Tag Manager** | **Direct** (GA4 via `@next/third-parties`, Pixel via `next/script`): everything lives in the code, and a change needs a deploy. **Google Tag Manager**: one script in the code, and GA4, Pixel, LinkedIn and others are added in GTM's UI without deploying. Pick GTM if marketing will keep adding tags; pick direct if it's only these two. |
| **Cookie consent**             | The site targets the UK/EU (`locale: en_GB`). Both GA4 and the Pixel set cookies, so under UK GDPR/PECR they need consent before they run. You need a consent banner. Either a CMP (Cookiebot, CookieYes and Termly have free tiers and handle Google Consent Mode v2) or your own small banner (steps below).                                |

The steps below use **direct tags + your own banner**. If you choose GTM, do step 1, then use `GoogleTagManager` instead of steps 3–4 and configure the tags in GTM.

## 1. Accounts and IDs

- **GA4**: [analytics.google.com](https://analytics.google.com) → Admin → Create property → Web data stream for the production domain. Copy the **Measurement ID** (`G-XXXXXXX`). Under the stream, keep **Enhanced measurement** on: it tracks client-side route changes ("page changes based on browser history events"), scrolls and outbound clicks without extra code.
- **Meta Pixel**: [Meta Events Manager](https://business.facebook.com/events_manager) → Connect data sources → Web → Meta Pixel. Copy the **Pixel ID** (digits only). Under Settings, verify the domain.

## 2. Environment variables

Add to `apps/web/.env.example`, with a comment for each (project convention), then to `.env` and the Vercel project:

```bash
# Google Analytics 4 measurement id (G-…). Unset → no GA script.
NEXT_PUBLIC_GA_MEASUREMENT_ID=
# Meta Pixel id (digits). Unset → no Pixel script.
NEXT_PUBLIC_META_PIXEL_ID=
```

Set them **only on the Production environment** in Vercel, so previews and local dev never send data. The components render nothing when a variable is unset, the same way `CrispChat` does.

## 3. Where the code goes

Follow the Crisp chat pattern (`components/snippets/crisp-chat/`):

```
apps/web/
  constants/analytics.ts            # event names (enum), consent cookie name
  enums/analytics.ts                # AnalyticsEvent, ConsentChoice
  components/snippets/analytics/
    analytics.tsx                   # renders GA + Pixel, only after consent
    meta-pixel.tsx                  # Pixel base code + route-change PageView
    consent-banner.tsx              # accept / reject, stores the choice
  utils/analytics.ts                # trackEvent() — one call, both providers
```

Render `<Analytics />` once in `app/layout.tsx`, next to `<CrispChat />`.

## 4. Implementation notes

**GA4**: `pnpm --filter web add @next/third-parties`, then `<GoogleAnalytics gaId={id} />`. With Enhanced measurement, client-side navigations are counted automatically. **Do not** also send `page_view` by hand, or every page counts twice.

**Meta Pixel**: load the standard base code with `<Script id="meta-pixel" strategy="afterInteractive">`. The Pixel does **not** see App Router navigations, so add a small client component that calls `fbq('track', 'PageView')` whenever `usePathname()` changes. Skip the first render, because the base code already sent that PageView.

**Consent (Consent Mode v2)**:

1. Before any tag loads, default everything to denied:
   `gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })`
2. On **Accept**: `gtag('consent', 'update', { …: 'granted' })`, then load the Pixel (or call `fbq('consent', 'grant')` if it was loaded with `fbq('consent', 'revoke')`).
3. Store the choice in a first-party cookie for 6–12 months and offer a "Cookie settings" link in the footer (`configs/` footer menu) to change it.
4. Rejecting must be as easy as accepting: same prominence, one click.

**Performance**: both scripts load after hydration. Never use `beforeInteractive`. Check Lighthouse before and after (see [quality-audits.md](quality-audits.md)); expect a small drop in Total Blocking Time, not in LCP.

**Smooth scrolling**: the site uses GSAP ScrollSmoother. A consent banner must use the `SmoothScroll` `fixed` slot, or be mounted on `<body>` outside the smoother wrapper, or it won't stay pinned. Don't use plain `position: fixed`/`sticky` inside the wrapper.

**Content Security Policy**: there's no CSP today. If one is added, allow `www.googletagmanager.com`, `www.google-analytics.com`, `*.google-analytics.com`, `connect.facebook.net` and `www.facebook.com`.

## 5. Conversion events worth tracking

One helper, `trackEvent(AnalyticsEvent.X, params)`, sends to both providers:

| When                                          | GA4 event                                   | Pixel event          | Where it fires                                                                                                 |
| --------------------------------------------- | ------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| Contact form sent successfully                | `generate_lead`                             | `Lead`               | `hooks/use-contact-form.ts`, on API success only                                                               |
| Calendly booking made                         | `schedule_call` (custom)                    | `Schedule`           | `window.addEventListener('message')` for `event.data.event === 'calendly.event_scheduled'` from `calendly.com` |
| "Book a call" / "Start a project" CTA clicked | `select_content` with `content_type: 'cta'` | `Contact` (optional) | the CTA components                                                                                             |
| Chat opened                                   | `chat_open` (custom)                        | none                 | Crisp `chat:opened` callback                                                                                   |

In GA4, Admin → Events, mark `generate_lead` and `schedule_call` as **Key events** (conversions). Never send personal data (name, email, message) in event parameters.

## 6. Verify

- **GA4**: Admin → DebugView (install the "Google Analytics Debugger" extension), or Reports → Realtime. Navigate between pages and confirm one `page_view` per page.
- **Pixel**: the "Meta Pixel Helper" Chrome extension, plus Events Manager → Test events.
- Reject consent: confirm in DevTools → Network that no request goes to `google-analytics.com` or `facebook.com` and no `_ga` or `_fbp` cookie is set.

## Later

- **Meta Conversions API (server-side)**: send `Lead` from `apps/api` when a contact message is stored. It isn't blocked by ad blockers. Deduplicate it with the browser event through a shared `event_id`.
- **Search Console ↔ GA4 link**: Admin → Product links. See [seo.md](seo.md).
