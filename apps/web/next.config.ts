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
	// TODO: drop '@workspace/theme-lab' together with that package before production.
	transpilePackages: [
		'@workspace/ui',
		'@workspace/theme-lab',
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

export default nextConfig;
