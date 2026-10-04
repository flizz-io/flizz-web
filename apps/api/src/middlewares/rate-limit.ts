import { rateLimit, type Options } from 'express-rate-limit';

import { rateLimits, safeMethods } from '../constants/rate-limits.js';
import { HttpError } from '../utils/http-error.js';

/**
 * Same envelope as every other error — `{ error: { code: 'RATE_LIMITED' } }`
 * with a 429 — plus the standard `RateLimit` and `Retry-After` headers.
 */
function limiter(
	window: { windowMs: number; limit: number },
	extra: Partial<Options> = {}
) {
	return rateLimit({
		...window,
		standardHeaders: 'draft-8',
		legacyHeaders: false,
		handler: (_req, _res, next) => next(HttpError.tooManyRequests()),
		...extra
	});
}

/** On `POST /api/auth/google`. */
export const signInLimiter = limiter(rateLimits.signIn);

/** On every `/api` write; reads pass straight through. */
export const writeLimiter = limiter(rateLimits.write, {
	skip: (req) => safeMethods.includes(req.method)
});

/** On anonymous form endpoints — `POST /api/public/contact`. */
export const publicFormLimiter = limiter(rateLimits.publicForm);
