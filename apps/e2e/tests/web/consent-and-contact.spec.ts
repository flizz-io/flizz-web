import { expect, test } from '@playwright/test';

import {
	deleteMessages,
	e2eSenderEmail,
	findMessages
} from '../../support/contact';
import { adminStatePath } from '../../support/urls';

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

	test.describe('with the admin signed in', () => {
		// The session reads the inbox through the API; the form doesn't need it.
		test.use({ storageState: adminStatePath });

		test('a message reaches the inbox', async ({ page, request }) => {
			const email = e2eSenderEmail();
			// Reveal animations hold the form back until it scrolls in.
			await page.emulateMedia({ reducedMotion: 'reduce' });
			await page.goto('/contact');
			await page.getByRole('button', { name: 'Reject' }).click();

			const form = page.locator('form').first();
			await form.scrollIntoViewIfNeeded();
			await form.getByLabel('Your name').fill('E2E Smoke');
			await form
				.getByLabel('What the project is')
				.selectOption('NEW_BUILD');
			await form
				.getByLabel('When you want to start')
				.selectOption('EXPLORING');
			await form.getByLabel('Your email address').fill(email);
			await form
				.locator('textarea')
				.fill('Sent by the smoke tests — safe to delete.');
			await form.locator('button[type="submit"]').click();

			await expect(page.getByText('Message sent.')).toBeVisible();

			const stored = await findMessages(request, email);
			await deleteMessages(request, stored);
			expect(stored).toHaveLength(1);
			expect(stored[0]?.status).toBe('NEW');
		});
	});

	// Calendly's scheduler doesn't render for automated browsers, and a test
	// booking is a real one — it stays a manual step in the pre-launch
	// checklist (docs/guides/smoke-tests.md).
	test.fixme('a call can be booked', async () => {});
});
