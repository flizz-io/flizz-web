import { expect, test, type Page } from '@playwright/test';

import { appUrls } from '../../support/urls';

/** Uncaught exceptions in the page — a broken page often still returns 200. */
function collectPageErrors(page: Page) {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	return errors;
}

async function firstSlug(path: string) {
	const response = await fetch(`${appUrls.api}/api/public/${path}`);
	const { data } = (await response.json()) as { data: { slug: string }[] };
	return data[0]?.slug;
}

const staticPages = [
	'/',
	'/about',
	'/services',
	'/portfolio',
	'/articles',
	'/contact',
	'/privacy-policy',
	'/terms-and-conditions'
];

for (const path of staticPages) {
	test(`${path} renders`, async ({ page }) => {
		const errors = collectPageErrors(page);
		const response = await page.goto(path);

		expect(response?.status()).toBe(200);
		await expect(page.locator('h1').first()).toBeAttached();
		expect(errors).toEqual([]);
	});
}

test('a service page renders', async ({ page }) => {
	const slug = await firstSlug('services');
	test.skip(!slug, 'no published service');

	const response = await page.goto(`/services/${slug}`);
	expect(response?.status()).toBe(200);
	await expect(page.locator('h1').first()).toBeAttached();
});

test('a portfolio project renders', async ({ page }) => {
	const slug = await firstSlug('projects');
	test.skip(!slug, 'no published project');

	const response = await page.goto(`/portfolio/${slug}`);
	expect(response?.status()).toBe(200);
	await expect(page.locator('h1').first()).toBeAttached();
});

test('an article renders', async ({ page }) => {
	const slug = await firstSlug('articles');
	test.skip(!slug, 'no published article');

	const response = await page.goto(`/articles/${slug}`);
	expect(response?.status()).toBe(200);
	await expect(page.locator('h1').first()).toBeAttached();
});

test('an unknown page is a real 404', async ({ page }) => {
	const response = await page.goto('/this-page-does-not-exist');

	expect(response?.status()).toBe(404);
	await expect(page.locator('h1').first()).toBeAttached();
});
