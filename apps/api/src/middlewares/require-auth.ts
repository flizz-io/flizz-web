import type { NextFunction, Request, Response } from 'express';

import { sessionCookieName } from '../constants/auth.js';
import { readSessionToken } from '../services/session-service.js';
import { findSignedInUser } from '../services/user-service.js';
import { HttpError } from '../utils/http-error.js';

/**
 * Guards signed-in routes. Verifies the session cookie, then re-reads the
 * user from the database — so removing or suspending someone locks them out
 * on their next request, not when their token expires. Sets
 * `res.locals.currentUser`.
 */
export async function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token: unknown = req.cookies?.[sessionCookieName];
	const uuid =
		typeof token === 'string' ? await readSessionToken(token) : null;
	const user = uuid ? await findSignedInUser(uuid) : null;

	if (!user) throw HttpError.unauthenticated();

	res.locals.currentUser = user;
	next();
}
