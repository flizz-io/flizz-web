# Contact Us & Book a Call

Phase CM in [progress-report.md](progress-report.md) (tasks CM1–CM9). Backfills the doc the `/contact` page shipped without (Stage 5), and specifies what the page needs to work for real: the form's endpoint, spam protection, the team's inbox in the dashboard, the new-message notification and the Calendly booking slot. Who may do what follows [users-and-permissions.md](users-and-permissions.md).

## Scope decisions — 2026-10-04

- **The page design stays as built.** Hero, form (the `brief` variation), next steps, booking, channels and FAQ — in that order. Only the form's submission and the booking slot change.
- **The browser posts straight to the API** (`POST /api/public/contact`, at `NEXT_PUBLIC_API_URL`). The API already allows the public site's origin (`CORS_ORIGINS`), and calling it directly means the rate limit and IP hash see the visitor's own address rather than the web server's.
- **Three layers of spam protection**, cheapest first: a honeypot field, rate limits, and Cloudflare Turnstile. Each one is off-switchable through its environment variable so local development needs no accounts.
- **Messages are stored, then announced.** The record is saved first; the notification is sent after, and a notification failure never fails the visitor's submission.
- **No table for bookings.** Calendly holds them and sends its own notifications. A `call_bookings` table fed by Calendly webhooks is added only if the dashboard ever needs to list calls.
- **Nothing is hard-deleted; every change records who made it** (project-wide rule). "Delete" in the inbox is a soft delete.

## The page

| #   | Section    | Component                    | Content source                                      |
| --- | ---------- | ---------------------------- | --------------------------------------------------- |
| —   | Hero       | `contact-hero.tsx`           | `contactCommitments` in `constants/contact.ts`      |
| 1   | Form       | `contact-form.tsx` (`brief`) | Choices in `constants/contact.ts`; posts to the API |
| 2   | Next steps | `contact-next-steps.tsx`     | `contactNextSteps`                                  |
| 3   | Book       | `contact-booking.tsx`        | `contactBookingPoints` + the Calendly embed         |
| 4   | Channels   | `contact-channels.tsx`       | `contactChannels`                                   |
| 5   | FAQ        | `contact-faq.tsx`            | `contactFaqItems`                                   |

Three form variations exist (`brief`, `console`, `classic`) and share one hook, `use-contact-form`, so the variation never changes what is sent.

## Form fields

The web schema (`apps/web/schemas/contact.ts`) and the API schema (`apps/api/src/schemas/contact-schema.ts`) apply the same rules. The API is the authority; the web copy exists so the visitor sees errors without a round trip.

| Field       | Rule                                                                               | Column        |
| ----------- | ---------------------------------------------------------------------------------- | ------------- |
| Name        | Required, 2–120 chars, trimmed                                                     | `name`        |
| Company     | Optional, ≤ 80 chars. Blank is stored as `null`                                    | `company`     |
| Email       | Required, valid, ≤ 254 chars. Stored **lower-cased**                               | `email`       |
| Scope       | One of `NEW_BUILD`, `REBUILD`, `SCALE`, `FIX`, `UNDECIDED` (`ContactScope`)        | `scope`       |
| Start       | One of `IMMEDIATELY`, `THIS_QUARTER`, `NEXT_QUARTER`, `EXPLORING` (`ContactStart`) | `start`       |
| Message     | Required, 20–4,000 chars, trimmed                                                  | `message`     |
| Source path | Set by the browser: the page path the form was sent from (`/contact`), ≤ 200 chars | `source_path` |
| Honeypot    | `website` — a hidden text field. Must be empty (see below). Never stored           | —             |
| Turnstile   | `turnstileToken` — the widget's token. Verified, never stored                      | —             |

## Spam protection

1. **Honeypot.** The form renders a `website` field that people never see (off-screen, `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`). Bots that fill every field fill it too. A submission with a value gets the **same 201 response** as a real one but is not stored and not announced — so the bot learns nothing.
2. **Rate limits.**
    - Per IP in memory (`publicFormLimiter`, 5 per hour) — cheap, but each serverless instance counts on its own.
    - Per IP in the database: more than **5 messages from the same `ip_hash` in the past hour** → 429. This one holds across instances.
    - Outside production, requests from this machine (loopback) skip both, so local runs and the e2e suite don't lock the form.
    - `ip_hash` is an HMAC-SHA-256 of the visitor's IP keyed with `SESSION_SECRET` — enough to spot repeats without keeping the address. Rotating the secret only resets this count.
3. **Cloudflare Turnstile** (CAPTCHA). The widget runs when the visitor submits, in `interaction-only` appearance — invisible unless Cloudflare finds the visitor suspicious, when it shows a checkbox. The API verifies the token with Cloudflare (`siteverify`, with the visitor's IP) before saving.
    - `TURNSTILE_SECRET_KEY` unset on the API → no verification (local development). Set it in Production and Preview.
    - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset on the web → no widget, no token.
    - Set both or neither: a secret without a site key refuses every submission.

## API

### Public

`POST /api/public/contact` — no session.

- Body: the form fields plus `sourcePath`, `website` and `turnstileToken`.
- `201 { data: { received: true } }` on success (and on a caught honeypot).
- `400 VALIDATION_FAILED` with per-field `details`; `400` with `field: turnstileToken` when the CAPTCHA fails; `429 RATE_LIMITED`.
- The response never echoes the stored record.

### Inbox (dashboard)

Every route needs a session and the `CONTACT_MESSAGES` grant.

| Route                                | Action   | Does                                                                                                                                                                          |
| ------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/contact-messages`          | `VIEW`   | `?folder=&search=&page=` — newest first, 25 a page. `folder` is a tab: `INBOX` (default), `UNREAD`, `ARCHIVED`, `SPAM`, `ALL`. Search covers name, email, company and message |
| `GET /api/contact-messages/summary`  | `VIEW`   | Count per folder, including unread (status `NEW`) — the sidebar badge and the tab counts                                                                                      |
| `GET /api/contact-messages/:uuid`    | `VIEW`   | The message. **The first open marks it read**: `read_at`, `read_by_id`, and `NEW` → `READ`                                                                                    |
| `PATCH /api/contact-messages/:uuid`  | `EDIT`   | `{ status?, internalNote? }` — status change and the team note                                                                                                                |
| `DELETE /api/contact-messages/:uuid` | `DELETE` | Soft delete                                                                                                                                                                   |

Marking read is a side effect of viewing, so a View-only member records reads too — reading is what View is for.

## Inbox statuses

| Status     | Meaning                                   | Set by                                |
| ---------- | ----------------------------------------- | ------------------------------------- |
| `NEW`      | Nobody on the team has opened it — unread | Submission                            |
| `READ`     | Opened at least once                      | First open, automatically; or by hand |
| `REPLIED`  | Someone answered (by email, outside here) | By hand                               |
| `ARCHIVED` | Dealt with; out of the working list       | By hand                               |
| `SPAM`     | Junk that got through                     | By hand                               |

Any status may move to any other — moving one back to `NEW` makes it unread again. The dashboard's default tab is **Inbox** (`NEW`, `READ`, `REPLIED`); Archived, Spam and All are their own tabs.

## Permissions

Feature `CONTACT_MESSAGES` (admins always have all four):

| Action   | Allows                                                      |
| -------- | ----------------------------------------------------------- |
| `VIEW`   | The inbox, each message (and marking it read by opening it) |
| `CREATE` | Nothing — messages only come from the website               |
| `EDIT`   | Status changes and the internal note                        |
| `DELETE` | Soft delete                                                 |

## Notification (CM4)

Required (L8): the team hears about every stored message. Two channels, each on when its variables are set — either, both, or (locally) neither:

- **Email** through [Resend](https://resend.com)'s HTTP API — `RESEND_API_KEY`, `CONTACT_NOTIFY_FROM` (a sender on a domain verified in Resend, with SPF and DKIM), `CONTACT_NOTIFY_TO` (comma-separated). `Reply-To` is the enquirer, so replying from the inbox answers them directly.
- **Slack** through an incoming webhook — `CONTACT_SLACK_WEBHOOK_URL`.

The message carries name, company, email, scope, start, the first 500 characters of the message, and a link to it in the dashboard (`DASHBOARD_URL`). Sending waits up to 5 seconds and logs a failure rather than throwing. Caught honeypots are never announced.

L8 still has the owner pick the provider and set up SPF, DKIM and DMARC. Resend is the default because it needs no SDK and has a free tier; swapping it is a change to `contact-notification-service.ts` only.

## Book a Call (CM8)

- **Calendly inline embed** in the booking section's slot, as an `iframe` (`loading="lazy"`, so nothing loads from Calendly until the visitor scrolls near it). URL from `NEXT_PUBLIC_CALENDLY_URL` — the event link, e.g. `https://calendly.com/flizz/discovery-call`. Unset → the slot keeps its "email us instead" state.
- **Prefill**: once the visitor has typed a name and email into the form above, the embed is opened with them (`name`, `email`), so they don't type them twice.
- **UTM tags**: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from the page URL are passed through; without them it sends `utm_source=website`, `utm_medium=contact-page`.
- **Light/dark**: `background_color`, `text_color` and `primary_color` follow the site theme; `hide_gdpr_banner=1` (the cookie banner is ours).
- **No database and no CAPTCHA of ours** — the booking happens inside Calendly's iframe, which handles its own abuse.
- **Consent**: the embed is the service the visitor asked for, not tracking, so it isn't gated by the cookie banner. Calendly is listed as a processor in the privacy policy.

## Environment variables

| App | Variable                         | Purpose                                      |
| --- | -------------------------------- | -------------------------------------------- |
| api | `TURNSTILE_SECRET_KEY`           | Verifies the CAPTCHA token. Unset → skipped  |
| api | `RESEND_API_KEY`                 | Email notification. Unset → no email         |
| api | `CONTACT_NOTIFY_FROM`            | Sender of the notification email             |
| api | `CONTACT_NOTIFY_TO`              | Who receives it, comma-separated             |
| api | `CONTACT_SLACK_WEBHOOK_URL`      | Slack notification. Unset → no Slack message |
| api | `DASHBOARD_URL`                  | Links in the notification to the message     |
| web | `NEXT_PUBLIC_API_URL`            | Where the browser posts the form             |
| web | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | The CAPTCHA widget. Unset → no widget        |
| web | `NEXT_PUBLIC_CALENDLY_URL`       | The booking embed. Unset → placeholder slot  |

## Open decisions

| Decision                                           | Owner | Until then                                                                              |
| -------------------------------------------------- | ----- | --------------------------------------------------------------------------------------- |
| Email provider, sender domain, SPF/DKIM/DMARC (L8) | Owner | Resend wired, off until its keys are set; Slack works on its own                        |
| How long messages are kept (L1, legal decision 3)  | Owner | Kept indefinitely (soft-deleted ones too). A purge job comes once the period is decided |
| The Calendly account and event                     | Owner | Placeholder slot                                                                        |
| NDA line in the hero                               | PM    | Ships as written (`constants/contact.ts`)                                               |
