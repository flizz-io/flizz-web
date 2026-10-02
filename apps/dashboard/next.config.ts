import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	transpilePackages: ['@workspace/ui'],
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

export default nextConfig;
