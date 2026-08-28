import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// TODO: drop '@workspace/theme-lab' together with that package before production.
	transpilePackages: ['@workspace/ui', '@workspace/theme-lab']
};

export default nextConfig;
