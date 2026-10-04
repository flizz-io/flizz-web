const HOUR_MS = 3_600_000;

/** Field limits for contact messages — docs/requirements/contact-page.md#form-fields. */
export const contactLimits = {
	nameMin: 2,
	name: 120,
	company: 80,
	email: 254,
	messageMin: 20,
	message: 4000,
	sourcePath: 200,
	internalNote: 2000
} as const;

/**
 * Messages one visitor (by `ip_hash`) may send in the window. Counted in the
 * database, so it holds across serverless instances — unlike the in-memory
 * `publicFormLimiter`, which is the cheap first check.
 */
export const contactIpLimit = { windowMs: HOUR_MS, limit: 5 } as const;

/** Cloudflare's server-side token check. */
export const turnstileVerifyUrl =
	'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const TURNSTILE_TIMEOUT_MS = 5000;
