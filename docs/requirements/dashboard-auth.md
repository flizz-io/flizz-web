# Admin Dashboard — Shell & Google Sign-in

Stage 9 in [progress-report.md](progress-report.md) (tasks A1–B6). Covers how team members sign in to `apps/dashboard`, how the API knows who they are, and the dashboard's base layout. Feature CRUDs (Projects first) build on this and have their own docs.

## Scope decisions — 2026-10-02

- **Google sign-in only.** No passwords, no email magic links. Every admin has a Google account.
- **Email allowlist.** Only Google accounts whose email is in the `users` table (not removed, not suspended) can sign in. Anyone else is refused with a clear message, even with a valid Google account. People are added by admins from the Team screen — see [users-and-permissions.md](users-and-permissions.md).
- **The API owns auth.** `apps/api` verifies Google's token, checks the allowlist, and issues its own session. The dashboard never trusts Google directly, so every future feature — and any other client — authenticates the same way.
- **Roles and permissions** (`SUPER_ADMIN` / `ADMIN` / `TEAM_MEMBER`, per-feature grants) are specified in [users-and-permissions.md](users-and-permissions.md) — added 2026-10-02, superseding the original "no roles yet" decision.

## Sign-in flow

1. The admin opens `/login` on the dashboard and clicks **Sign in with Google** (Google Identity Services button).
2. Google returns an **ID token** (a signed JWT about the Google account) to the page.
3. The dashboard posts it to `POST /api/auth/google`.
4. The API verifies the token with Google's public keys — signature, expiry, and `aud` = our `GOOGLE_CLIENT_ID` — and requires `email_verified`.
5. It looks the email up in `users` (case-insensitive). Not there, removed, or suspended → `403` with a "not authorised" error; nothing is created.
6. Found → it refreshes the admin's `name`, `avatar_url`, `google_sub` and `last_login_at`, and sets the **session cookie**.
7. The dashboard redirects to the page the admin originally asked for (or `/`).

Sign-out: `POST /api/auth/logout` clears the cookie; the dashboard returns to `/login`.

## Session

| Aspect         | Decision                                                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format         | A JWT signed by the API (HS256, `SESSION_SECRET`), carrying only the admin's public `uuid`                                                                     |
| Storage        | Cookie `flizz_admin_session` — `httpOnly`, `SameSite=Lax`, `Secure` in production, `Path=/`. Never readable by page JavaScript                                 |
| Lifetime       | 7 days, fixed. Signing in again starts a new one                                                                                                               |
| Revocation     | Every authenticated request re-reads the admin from the database, so removing or deactivating an admin locks them out on their **next** request, not in 7 days |
| `GET /auth/me` | Returns the signed-in admin (`uuid`, `email`, `name`, `avatarUrl`) or `401`                                                                                    |

### Why the dashboard proxies the API

The dashboard calls the API as **`/api/*` on its own origin**; a Next.js rewrite forwards those requests to `apps/api`. So the session cookie belongs to the dashboard's origin:

- it works identically on localhost (dashboard `:3400`, API `:3500`) and in production on separate subdomains, with no cross-site cookie settings;
- the dashboard's `proxy.ts` (Next 16's renamed middleware) can see it to redirect signed-out visitors;
- the dashboard needs no CORS at all. CORS on the API stays limited to the public site's read-only requests.

## Route protection (dashboard)

Two layers, as Next 16 recommends — `proxy.ts` is for optimistic checks only:

1. **`proxy.ts`** — cheap redirect on cookie _presence_: no cookie → `/login?next=<path>`; a cookie on `/login` → `/`. It doesn't verify anything.
2. **The protected layout** (server component) calls `GET /api/auth/me` with the incoming cookie. A `401` (expired, tampered, revoked) → `/login`. This is the real check; the admin it returns is passed down to the shell.

The API enforces auth itself on every admin endpoint (`requireAuth`), so even a bypassed dashboard can't reach data.

## Data

The allowlist is the `users` table — columns, roles, lifecycle and the audit rules in [users-and-permissions.md](users-and-permissions.md#data). The session names a user by their public `uuid`.

## Dashboard shell

- **Sidebar** — Overview, Projects; later features add their own entries (Services, Articles, Testimonials, Contact submissions). Entries for features not built yet are not shown.
- **Header** — current section title, the admin's avatar and name, sign-out.
- **Overview** — a placeholder until there's something real to summarise.
- Light/dark via the existing theme provider; uses `@workspace/ui` (shadcn) components throughout.

## Environment variables

| App         | Variable                       | Notes                                                  |
| ----------- | ------------------------------ | ------------------------------------------------------ |
| `api`       | `DATABASE_URL`                 | PostgreSQL connection string                           |
| `api`       | `GOOGLE_CLIENT_ID`             | OAuth client ID — the `aud` every ID token must carry  |
| `api`       | `SESSION_SECRET`               | ≥ 32 random characters; rotating it signs everyone out |
| `api`       | `SUPER_ADMIN_EMAIL`            | The one Super Admin; applied by the seed               |
| `api`       | `CORS_ORIGINS`                 | Public-site origins allowed to read public endpoints   |
| `dashboard` | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Same client ID, for the sign-in button                 |
| `dashboard` | `API_URL`                      | Where the `/api/*` rewrite forwards (server-side only) |

Google Cloud Console: the OAuth client must list `http://localhost:3400` (and the production dashboard origin) under **Authorised JavaScript origins**. No redirect URI is needed — the ID-token flow doesn't redirect.

## Error states on `/login`

| Case                         | Message                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| Email not on the allowlist   | "This Google account doesn't have access. Ask an admin to add you." |
| Account deactivated          | Same as above — don't reveal which                                  |
| Google sign-in failed/closed | "Google sign-in didn't complete. Try again."                        |
| API unreachable              | "Can't reach the server right now. Try again in a moment."          |
| Session expired (redirected) | "Your session ended. Sign in again."                                |
