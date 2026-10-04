import { defineConfig, devices } from '@playwright/test';

import { appUrls } from './support/urls';

/**
 * Smoke tests for the critical paths, run against the apps from `pnpm dev`
 * and the local database. See docs/guides/smoke-tests.md.
 */
export default defineConfig({
	globalSetup: './support/global-setup.ts',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	// Dev servers compile each route on its first visit.
	timeout: 60_000,
	expect: { timeout: 15_000 },
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		...devices['Desktop Chrome']
	},
	projects: [
		{
			name: 'api',
			testDir: './tests/api',
			use: { baseURL: appUrls.api }
		},
		{
			name: 'web',
			testDir: './tests/web',
			use: { baseURL: appUrls.web }
		},
		{
			name: 'web-mobile',
			testDir: './tests/web',
			use: { ...devices['Pixel 7'], baseURL: appUrls.web }
		},
		{
			name: 'dashboard',
			testDir: './tests/dashboard',
			use: { baseURL: appUrls.dashboard }
		}
	]
});
