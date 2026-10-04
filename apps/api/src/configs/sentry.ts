import * as Sentry from '@sentry/node';

import { env } from './env.js';

/**
 * Error tracking for unexpected (500) errors — reported from the error
 * handler. Off unless `SENTRY_DSN` is set; errors only, no tracing.
 */
export const sentryEnabled = Boolean(env.sentry.dsn);

if (sentryEnabled) {
	Sentry.init({
		dsn: env.sentry.dsn ?? undefined,
		environment: env.sentry.environment,
		tracesSampleRate: 0
	});
}

const FLUSH_TIMEOUT_MS = 2000;

/**
 * Reports an error and waits for it to be sent — on serverless the function
 * can freeze as soon as the response goes, taking an unsent event with it.
 */
export async function reportError(error: unknown) {
	if (!sentryEnabled) return;

	Sentry.captureException(error);
	await Sentry.flush(FLUSH_TIMEOUT_MS);
}
