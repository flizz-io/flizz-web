const MINUTE_MS = 60_000;

/**
 * Requests allowed per visitor IP in each window. Counts live in the
 * process's memory, so on serverless each instance keeps its own — a brake on
 * abuse, not an exact quota. Public GETs aren't limited: the site's builds
 * fetch every page from one IP within seconds.
 */
export const rateLimits = {
	/** Google sign-in attempts. */
	signIn: { windowMs: 15 * MINUTE_MS, limit: 20 },
	/** Any write (POST, PUT, PATCH, DELETE) — dashboard edits and uploads. */
	write: { windowMs: 15 * MINUTE_MS, limit: 300 },
	/** Anonymous form submissions — the contact form. */
	publicForm: { windowMs: 60 * MINUTE_MS, limit: 5 }
} as const;

/** Methods that only read — never counted by the write limiter. */
export const safeMethods: readonly string[] = ['GET', 'HEAD', 'OPTIONS'];
