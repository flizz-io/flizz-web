import type { CurrentUser } from './user.js';

declare global {
	namespace Express {
		interface Locals {
			/** Set by `requireAuth` — the signed-in user for this request. */
			currentUser?: CurrentUser;
		}
	}
}

export {};
