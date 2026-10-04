# Contact & Booking Setup Guide

For the owner. The new contact form, team inbox and booking slot are built; they switch on once these free accounts exist and their values are in Vercel. Expect about an hour, all free. Specification: [contact-page.md](../requirements/contact-page.md).

## Order of work

Create the accounts first, give the values to the developer (or enter them in Vercel yourself), and only then merge the Contact pull request.

1. Cloudflare Turnstile keys (Step 1).
2. Slack webhook (Step 2) and the Gmail sender (Step 3) — at least one of the two, ideally both.
3. Calendly link (Step 4) — can come later; until then the booking slot asks visitors to email.
4. All values entered in Vercel (Step 5), then the pull request is merged.
5. The checks in Step 6, on the live site.

**Why before the merge:** the website reads its values when it is built. If the new code goes live without them, the contact form shows “That didn’t send” to every visitor until the next deploy.

**Keep secrets out of chat and email.** The Turnstile secret key, the Slack webhook address and the Gmail App Password each let someone act as us. Paste them straight into Vercel, or share them through a password manager.

## Step 1 — Cloudflare Turnstile (spam protection)

Turnstile is Cloudflare’s free CAPTCHA. Visitors normally see nothing; only a suspicious visitor is asked to tick a box.

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com) (a free account is enough; the domain does not need to be on Cloudflare).
2. Open **Turnstile** → **Add widget**.
3. Name it “Flizz contact form”. Under hostnames add `flizz.io` and, if the site also answers on it, `www.flizz.io`.
4. Widget mode: **Managed**. Leave pre-clearance off.
5. Create it. Cloudflare shows two values:
    - **Site key** — public, goes on the website.
    - **Secret key** — private, goes on the API.

The two always go in together. A secret key without the site key makes the API refuse every message.

## Step 2 — Slack alert for each new enquiry

Each message sent from the website posts into one Slack channel: who wrote, what about, the start of the message and a link to it in the dashboard. This works on Slack’s free plan; it uses one of the 10 apps a free workspace may install.

1. In Slack, create a channel, e.g. `#website-enquiries`, and add the people who should see enquiries.
2. Go to [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → **From scratch**. Name: “Flizz website”. Workspace: ours.
3. In the app, open **Incoming Webhooks** and switch it **On**.
4. Click **Add New Webhook to Workspace**, choose `#website-enquiries`, and **Allow**.
5. Copy the **Webhook URL** — it starts with `https://hooks.slack.com/services/`. This is the value for `CONTACT_SLACK_WEBHOOK_URL`.

On the free plan, Slack hides messages older than 90 days. The enquiries themselves are kept in the dashboard inbox, so nothing is lost.

## Step 3 — Email alert from Gmail

The website emails each enquiry from one of our Gmail accounts to the addresses we choose. It is free, and Gmail allows about 500 emails a day — far more than we need. Replying to the alert email answers the enquirer directly.

**Pick the sending account.** A dedicated address such as `flizz.website@gmail.com` is best, so the password below never belongs to a personal mailbox. It can send to any of our addresses, including itself.

1. Sign in to that Gmail account and open [myaccount.google.com/security](https://myaccount.google.com/security).
2. Turn on **2-Step Verification** (Google requires it before step 3).
3. Open [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords). Name it “Flizz website” and create it.
4. Google shows a 16-letter password in four groups (e.g. `abcd efgh ijkl mnop`). Copy it — it is shown only once. This is `SMTP_PASSWORD`; the spaces don’t matter.
5. `SMTP_USER` is the Gmail address itself. `CONTACT_NOTIFY_TO` is who receives alerts, separated by commas, e.g. `hello@flizz.io,owner@gmail.com`.

Notes:

- Use the App Password, never the account’s normal password.
- If the account is a Google Workspace address rather than @gmail.com, a Workspace admin may need to allow App Passwords first.
- Changing the Google account’s main password cancels its App Passwords; create a new one and update Vercel.
- One wrong address in `CONTACT_NOTIFY_TO` stops the API from starting — double-check the spelling.

## Step 4 — Calendly (Book a call)

The contact page shows Calendly’s scheduler in its “Rather just talk?” section. Calendly keeps the bookings and sends confirmations; nothing is stored on our side.

1. Create an account at [calendly.com](https://calendly.com) with the address that should own bookings (e.g. `hello@flizz.io`).
2. Connect the team calendar (Google or Outlook) so busy times are blocked.
3. Create an event type: “30-minute discovery call”, 30 minutes, location Google Meet or Zoom.
4. Set working hours, a minimum notice (e.g. 4 hours) and a buffer between calls.
5. Copy the event’s link, e.g. `https://calendly.com/flizz/discovery-call`. This is `NEXT_PUBLIC_CALENDLY_URL`.

What we pass along automatically: the name and email the visitor already typed into the form, and campaign tags (`utm_source` and so on) so bookings show where visitors came from.

The free plan allows one event type, which is all we need. Matching the site’s dark colours inside the scheduler needs a paid plan; on the free plan it keeps Calendly’s light look.

## Step 5 — Values to enter in Vercel

In Vercel, open each project → **Settings** → **Environment Variables**, add the values below for the **Production** environment, then **redeploy** that project — Vercel only picks up new values on the next deploy. Type values without quotation marks.

| Vercel project | Variable                         | Value                                                                                       | From      |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------- | --------- |
| API            | `TURNSTILE_SECRET_KEY`           | Turnstile secret key                                                                        | Step 1    |
| API            | `CONTACT_SLACK_WEBHOOK_URL`      | `https://hooks.slack.com/services/…`                                                        | Step 2    |
| API            | `SMTP_USER`                      | The sending Gmail address                                                                   | Step 3    |
| API            | `SMTP_PASSWORD`                  | The 16-letter App Password                                                                  | Step 3    |
| API            | `CONTACT_NOTIFY_TO`              | Who receives alerts, comma-separated                                                        | Step 3    |
| API            | `DASHBOARD_URL`                  | The dashboard’s address, e.g. `https://admin.flizz.io` (no `/` at the end)                  | Dashboard |
| API            | `CORS_ORIGINS`                   | Already set — check it lists the site exactly, e.g. `https://flizz.io,https://www.flizz.io` | Website   |
| Website        | `NEXT_PUBLIC_API_URL`            | The API’s address, usually the same as the website’s `API_URL` (no `/` at the end)          | API       |
| Website        | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key                                                                          | Step 1    |
| Website        | `NEXT_PUBLIC_CALENDLY_URL`       | The Calendly event link (leave empty until Step 4 is done)                                  | Step 4    |

`SMTP_HOST` and `SMTP_PORT` don’t need entering — they default to Gmail’s server.

A badly typed email address or web address in the API rows stops the API from starting, which takes the dashboard down with it. If the API fails right after a redeploy, check these values first.

## Step 6 — Check it works

Run these on the live site after the deploy. Anything that fails, send to the developer with a screenshot.

**Contact form**

- [ ] On a phone, send a message from the contact page → “Message sent.” appears. If a “Verify you are human” box shows, ticking it sends the message.
- [ ] The dashboard shows it under **Messages**, with a number beside it in the sidebar. Opening the message clears the number.
- [ ] The Slack alert arrives in `#website-enquiries`.
- [ ] The alert email arrives; pressing Reply addresses it to the person who wrote in.
- [ ] Send six messages within an hour from the same phone → the sixth asks you to wait a while.
- [ ] Delete the test messages in the dashboard.

**Booking** (once the Calendly link is set)

- [ ] The scheduler appears in the “Rather just talk?” section.
- [ ] Type a name and email in the form first, then scroll down → Calendly already has them filled in.
- [ ] Book a slot, receive the confirmation email, then cancel it from that email.

## Decisions still needed

- [ ] **How long we keep enquiries.** The privacy policy must state a period; the draft proposes 24 months after last contact. Today messages are kept forever, and “delete” in the dashboard only hides them. Keeping the promise means truly erasing names, emails and message text after the period — an exception to our “never hard-delete” rule. Decide the period, and whether to erase the whole record or only blank the personal details. The developer then adds an automatic clean-up.
- [ ] **Who receives alerts.** The Slack channel members and the addresses in `CONTACT_NOTIFY_TO`.
- [ ] **The NDA line** on the contact page (“On request, before you share”) — confirm the wording.

Not needed for this setup: email domain records (SPF, DKIM, DMARC). Gmail sends the alerts from Google’s own servers. They only matter if the website ever emails visitors from an `@flizz.io` address.
