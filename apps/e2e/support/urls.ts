/** Where the apps under test run — `pnpm dev` defaults; override per env. */
export const appUrls = {
	web: process.env.E2E_WEB_URL ?? 'http://localhost:3300',
	dashboard: process.env.E2E_DASHBOARD_URL ?? 'http://localhost:3400',
	api: process.env.E2E_API_URL ?? 'http://localhost:3500'
} as const;

/** The signed-in admin's browser state, written by the global setup. */
export const adminStatePath = '.auth/admin.json';

/** Visited once before the tests so dev servers compile them up front. */
export const warmUpRoutes = {
	web: [
		'/',
		'/about',
		'/services',
		'/portfolio',
		'/contact',
		'/privacy-policy',
		'/terms-and-conditions',
		'/this-page-does-not-exist'
	],
	dashboard: ['/login', '/projects', '/services', '/team', '/profile']
} as const;
