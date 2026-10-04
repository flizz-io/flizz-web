import { expect, test } from '@playwright/test';

/** Must match apps/web/constants/consent.ts. */
const consentCookieName = 'flizz_consent';

test.describe('cookie consent', () => {
	test('rejecting is stored and the banner stays away', async ({
		page,
		context
	}) => {
		await page.goto('/about');

		const banner = page.getByRole('dialog', { name: 'Cookies' });
		const reject = page.getByRole('button', { name: 'Reject' });
		await expect(reject).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Accept' })
		).toBeVisible();

		await reject.click();
		await expect(reject).toBeHidden();

		const cookies = await context.cookies();
		expect(cookies.map((cookie) => cookie.name)).toContain(
			consentCookieName
		);

		await page.reload();
		await expect(banner).toBeHidden();
		await expect(reject).toBeHidden();
	});

	test('the footer reopens the choice', async ({ page }) => {
		await page.goto('/about');
		await page.getByRole('button', { name: 'Accept' }).click();

		await page.getByRole('button', { name: 'Cookie settings' }).click();
		await expect(
			page.getByRole('button', { name: 'Reject' })
		).toBeVisible();
	});
});

test.describe('contact', () => {
	test('the form is there', async ({ page }) => {
		await page.goto('/contact');

		await expect(page.locator('form').first()).toBeAttached();
		await expect(
			page.locator('form button[type="submit"]').first()
		).toBeAttached();
	});

	// TODO: submit a message and find it in the dashboard inbox once the
	// contact API (CM2) and inbox (CM3/CM5) exist.
	test.fixme('a message reaches the inbox', async () => {});

	// TODO: open the Calendly booking once it's configured (CM1).
	test.fixme('a call can be booked', async () => {});
});
