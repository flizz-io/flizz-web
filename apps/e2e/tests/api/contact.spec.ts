import { expect, test } from '@playwright/test';

import {
	contactPayload,
	deleteMessages,
	e2eSenderEmail,
	findMessages
} from '../../support/contact';
import { adminStatePath } from '../../support/urls';

test.describe('contact form endpoint', () => {
	test('names each invalid field', async ({ request }) => {
		const response = await request.post('/api/public/contact', {
			data: { name: 'x', email: 'not-an-address' }
		});

		expect(response.status()).toBe(400);
		const fields = (
			(await response.json()).error.details as { field: string }[]
		).map((detail) => detail.field);
		expect(fields).toEqual(
			expect.arrayContaining(['name', 'email', 'scope', 'message'])
		);
	});

	test('the inbox needs a session', async ({ request }) => {
		const response = await request.get('/api/contact-messages');

		expect(response.status()).toBe(401);
	});
});

test.describe('contact inbox', () => {
	test.use({ storageState: adminStatePath });

	test('a message is stored, opens as read and can be deleted', async ({
		request
	}) => {
		const email = e2eSenderEmail();
		const sent = await request.post('/api/public/contact', {
			data: contactPayload(email.toUpperCase())
		});
		expect(sent.status()).toBe(201);

		const [message] = await findMessages(request, email);
		expect(message, 'stored with the email lower-cased').toBeTruthy();
		expect(message?.status).toBe('NEW');

		const opened = await request.get(
			`/api/contact-messages/${message?.uuid}`
		);
		expect((await opened.json()).data.status).toBe('READ');

		const noted = await request.patch(
			`/api/contact-messages/${message?.uuid}`,
			{ data: { status: 'REPLIED', internalNote: 'Smoke test' } }
		);
		expect((await noted.json()).data).toMatchObject({
			status: 'REPLIED',
			internalNote: 'Smoke test'
		});

		const deleted = await request.delete(
			`/api/contact-messages/${message?.uuid}`
		);
		expect(deleted.status()).toBe(204);
		expect(await findMessages(request, email)).toHaveLength(0);
	});

	test('a honeypot hit answers like a success but stores nothing', async ({
		request
	}) => {
		const email = e2eSenderEmail();
		const sent = await request.post('/api/public/contact', {
			data: { ...contactPayload(email), website: 'https://spam.example' }
		});

		expect(sent.status()).toBe(201);
		const stored = await findMessages(request, email);
		await deleteMessages(request, stored);
		expect(stored).toHaveLength(0);
	});
});
