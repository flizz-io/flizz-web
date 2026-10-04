import * as Sentry from '@sentry/nextjs';

import { sentryOptions } from '@/configs/sentry';

/** Server and edge error tracking — see `configs/sentry.ts`. */
export function register() {
	if (sentryOptions.enabled) Sentry.init(sentryOptions);
}

/** Errors thrown while rendering on the server or in route handlers. */
export const onRequestError = Sentry.captureRequestError;
