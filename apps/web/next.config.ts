import { withSentryConfig } from '@sentry/nextjs/config';
import type { NextConfig } from 'next';

/**
 * Where API images come from: Cloudinary, Google avatars (a team member's
 * fallback photo), and the API's own media route when it serves files from
 * local disk (`MEDIA_PROVIDER=local`).
 */
const mediaPatterns = [
	new URL('https://res.cloudinary.com/**'),
	new URL('https://lh3.googleusercontent.com/**'),
	...(process.env.MEDIA_BASE_URL
		? [new URL(`${process.env.MEDIA_BASE_URL}/**`)]
		: [])
];

const loopbackHosts = ['localhost', '127.0.0.1', '[::1]'];

/** Local-disk media served from this machine — only ever in local runs. */
const mediaIsLocal = Boolean(
	process.env.MEDIA_BASE_URL &&
	loopbackHosts.includes(new URL(process.env.MEDIA_BASE_URL).hostname)
);

const nextConfig: NextConfig = {
	transpilePackages: [
		'@workspace/ui',
		'@workspace/service-visuals',
		'@workspace/api-services'
	],
	images: {
		remotePatterns: mediaPatterns,
		// The optimiser refuses private addresses by default; allowed only
		// while media is served from this machine (local-disk development).
		dangerouslyAllowLocalIP: mediaIsLocal
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
