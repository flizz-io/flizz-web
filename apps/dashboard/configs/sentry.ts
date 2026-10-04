import type { BrowserOptions } from '@sentry/nextjs';

/**
 * Error tracking. Off unless `NEXT_PUBLIC_SENTRY_DSN` is set — set it on the
 * Production environment in Vercel only. Errors only: no performance tracing
 * or session replay, so the free tier lasts and no visitor is recorded.
 */
export const sentryOptions: BrowserOptions = {
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
	environment:
		process.env.NEXT_PUBLIC_VERCEL_ENV ??
		process.env.NODE_ENV ??
		'development',
	tracesSampleRate: 0
};
