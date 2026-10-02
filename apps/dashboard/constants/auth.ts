/** Must match the API's cookie name (apps/api/src/constants/auth.ts). */
export const sessionCookieName = 'flizz_admin_session';

export const loginPath = '/login';
/** Where a signed-in admin lands by default. */
export const homePath = '/';
/** Query param carrying the page to return to after signing in. */
export const returnToParam = 'next';
/** Query param explaining why the admin was sent to sign in. */
export const loginReasonParam = 'reason';
/** Clears a session the API rejected, then goes to /login. */
export const sessionExpiredPath = '/auth/expired';
