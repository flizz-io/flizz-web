import type { Response } from 'express';

import { HttpError } from './http-error.js';

/** The signed-in user — for handlers behind `requireAuth`. */
export function currentUserOf(res: Response) {
	const user = res.locals.currentUser;
	if (!user) throw HttpError.unauthenticated();

	return user;
}
