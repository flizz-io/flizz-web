# Smoke tests — Playwright and the pre-launch checklist

Two halves: automated Playwright tests for the critical paths (`apps/e2e`), and a short manual checklist for what a robot can't or shouldn't do (real Google sign-in, real email, real bookings, production).

## Playwright (`apps/e2e`)

### Running

```bash
pnpm dev                       # all three apps, in another terminal
pnpm --filter e2e test         # whole suite
pnpm --filter e2e test:ui      # pick and watch tests interactively
pnpm --filter e2e report       # open the last HTML report
```

First time on a machine: `pnpm --filter e2e exec playwright install chromium`.

The suite runs against the apps from `pnpm dev` and the **local** database. Global setup (`support/global-setup.ts`):

1. Checks the API, website and dashboard answer, and stops with a clear message if not.
2. Signs the Super Admin in without Google: reads `apps/api/.env`, looks up `SUPER_ADMIN_EMAIL` in the database and signs a session cookie with `SESSION_SECRET`, exactly as `POST /api/auth/google` would. It refuses any `DATABASE_URL` that isn't on this machine, so a run never writes to Neon. Needs a seeded database (`pnpm --filter api db:seed`).
3. Visits every tested route once so the dev servers compile them up front — otherwise a first-compile reload fails whichever test got there first.

Point it elsewhere with `E2E_WEB_URL`, `E2E_DASHBOARD_URL` and `E2E_API_URL`.

### What's covered

| Project      | File                                    | Checks                                                                                                                                           |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api`        | `tests/api/api.spec.ts`                 | Health, security headers, public lists, admin routes need a session                                                                              |
| `api`        | `tests/api/project-lifecycle.spec.ts`   | C4's live check: create a Draft (not public) → publish (public on API and website) → delete (gone again)                                         |
| `api`        | `tests/api/contact.spec.ts`             | Contact endpoint names invalid fields; a message is stored, opens as read, takes a note, deletes; honeypot stores nothing; inbox needs a session |
| `web`        | `tests/web/pages.spec.ts`               | Every public page renders with no page errors, a service and a project page, unknown URLs are a real 404                                         |
| `web`        | `tests/web/consent-and-contact.spec.ts` | Cookie banner reject is remembered, footer reopens it; the contact form sends and the message reaches the inbox                                  |
| `web-mobile` | same as `web`                           | The same on a Pixel 7 viewport                                                                                                                   |
| `dashboard`  | `tests/dashboard/dashboard.spec.ts`     | Signed out → sign-in with `next=`; signed in → every section loads; opening a message marks it read; `/login` sends an admin home                |

The lifecycle test leaves one soft-deleted `E2E smoke …` project in the local database per run; the contact tests soft-delete the `e2e-…@example.com` messages they send. Outside production, contact form rate limits skip requests from this machine, so repeated runs don't lock the form.

**Not covered** (`test.fixme` in `consent-and-contact.spec.ts`): booking a call. Calendly's scheduler doesn't render for automated browsers, and a test booking is a real one — it stays in the manual checklist.

Not in CI: it needs a database and running apps. Run it before every PR that touches routing, auth, publishing or the consent banner.

## Pre-launch checklist (manual)

Run on **production** after the launch deploy, and on a preview before it. Tick each line; anything that fails blocks the launch.

**Sign-in**

- [ ] Dashboard: sign in with Google as the Super Admin lands in the dashboard.
- [ ] Sign in with an account that isn't approved is refused with a clear message.
- [ ] Sign out, then open `/projects` directly → back to sign-in, and after signing in you return to Projects.

**Publish a project**

- [ ] Create a project as a Draft with a cover image → not on `/portfolio`.
- [ ] Publish it → on `/portfolio` and its own page within a minute (revalidation), with the image.
- [ ] Its link preview (OG image) renders when pasted into Slack or WhatsApp.
- [ ] Unpublish or delete it → gone from the site again.

**Contact form end to end** _(needs `NEXT_PUBLIC_API_URL`, Turnstile keys and a notification channel set)_

- [ ] Send a message from `/contact` on a phone → success state. If Turnstile shows a checkbox, ticking it sends the message.
- [ ] It appears in the dashboard inbox with the sidebar's unread badge; opening it clears the badge.
- [ ] The notification email (and/or Slack message) arrives, and replying to the email answers the sender.
- [ ] Sending a sixth message within the hour is refused with the "wait a while" message.

**Test booking** _(needs `NEXT_PUBLIC_CALENDLY_URL`)_

- [ ] The Calendly scheduler loads in the booking slot, in the site's light and dark themes.
- [ ] Type a name and email into the form first, then scroll to the scheduler → they're prefilled.
- [ ] Book a call, receive the confirmation, then cancel it.

**Site-wide**

- [ ] Cookie banner: Reject → no analytics requests; Accept → GA4 loads; the footer link reopens the choice.
- [ ] An unknown URL shows the branded 404 with the header and footer.
- [ ] `robots.txt` and `sitemap.xml` are reachable and point at the production domain.
- [ ] A test error shows up in Sentry for the website, dashboard and API (see [deployment.md](deployment.md)).
