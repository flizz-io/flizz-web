import type { CookieOptions, Response } from 'express';

import { env } from '../configs/env.js';
import { sessionCookieName, sessionTtlSeconds } from '../constants/auth.js';

const cookieOptions: CookieOptions = {
	httpOnly: true,
	sameSite: 'lax',
	secure: env.isProduction,
	path: '/'
};

export function setSessionCookie(res: Response, token: string) {
	res.cookie(sessionCookieName, token, {
		...cookieOptions,
		maxAge: sessionTtlSeconds * 1000
	});
}

export function clearSessionCookie(res: Response) {
	res.clearCookie(sessionCookieName, cookieOptions);
}
