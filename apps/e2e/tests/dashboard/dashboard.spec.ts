import { expect, test } from '@playwright/test';

import { adminStatePath } from '../../support/urls';

test.describe('signed out', () => {
	test('a protected page goes to sign-in and remembers it', async ({
		page
	}) => {
		await page.goto('/projects');

		await expect(page).toHaveURL(/\/login\?next=%2Fprojects/);
		await expect(
			page.getByRole('heading', { name: 'Sign in to Flizz Admin' })
		).toBeVisible();
	});
});

test.describe('signed in as the Super Admin', () => {
	test.use({ storageState: adminStatePath });

	for (const { path, heading } of [
		{ path: '/projects', heading: 'Projects' },
		{ path: '/services', heading: 'Services' },
		{ path: '/team', heading: 'Team' },
		{ path: '/profile', heading: 'My profile' }
	]) {
		test(`${path} loads`, async ({ page }) => {
			await page.goto(path);

			await expect(page).toHaveURL(new RegExp(`${path}$`));
			await expect(
				page.getByRole('heading', { level: 1, name: heading })
			).toBeVisible();
		});
	}

	test('sign-in page sends a signed-in admin home', async ({ page }) => {
		await page.goto('/login');

		await expect(page).not.toHaveURL(/\/login/);
	});
});
