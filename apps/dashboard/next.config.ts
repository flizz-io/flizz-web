import { withSentryConfig } from '@sentry/nextjs/config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	transpilePackages: [
		'@workspace/ui',
		'@workspace/api-services',
		'@workspace/service-visuals'
	],
	// The dashboard talks to the API as /api/* on its own origin, so the
	// session cookie is first-party here — no CORS, no cross-site cookies.
	// See docs/requirements/dashboard-auth.md.
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${process.env.API_URL}/api/:path*`
			}
		];
	}
};

/**
 * With `SENTRY_AUTH_TOKEN` (plus `SENTRY_ORG` / `SENTRY_PROJECT`) set in the
 * build, source maps are uploaded so Sentry shows readable stack traces.
 * Without it the build is untouched and errors still arrive, minified.
 */
export default process.env.SENTRY_AUTH_TOKEN
	? withSentryConfig(nextConfig, {
			org: process.env.SENTRY_ORG,
			project: process.env.SENTRY_PROJECT,
			authToken: process.env.SENTRY_AUTH_TOKEN,
			silent: true
		})
	: nextConfig;
