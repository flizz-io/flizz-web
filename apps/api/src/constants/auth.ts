/** The admin session cookie — `httpOnly`, so page scripts never see it. */
export const sessionCookieName = 'flizz_admin_session';

/** Seven days; signing in again starts a fresh session. */
export const sessionTtlSeconds = 7 * 24 * 60 * 60;

/** Who issues session tokens and who they're for — checked on every read. */
export const sessionIssuer = 'flizz-api';
export const sessionAudience = 'flizz-dashboard';
