import { expect, test } from '@playwright/test';

test.describe('API basics', () => {
	test('health check answers', async ({ request }) => {
		const response = await request.get('/api/health');

		expect(response.status()).toBe(200);
		expect(await response.json()).toMatchObject({ status: 'ok' });
	});

	test('sends security headers', async ({ request }) => {
		const response = await request.get('/api/health');
		const headers = response.headers();

		expect(headers['x-content-type-options']).toBe('nosniff');
		expect(headers['x-powered-by']).toBeUndefined();
	});

	test('public lists answer', async ({ request }) => {
		for (const path of [
			'/api/public/services',
			'/api/public/projects',
			'/api/public/team',
			'/api/public/testimonials',
			'/api/public/articles'
		]) {
			const response = await request.get(path);
			expect(response.status(), path).toBe(200);
			expect(Array.isArray((await response.json()).data), path).toBe(
				true
			);
		}
	});

	test('admin routes need a session', async ({ request }) => {
		const response = await request.get('/api/projects');

		expect(response.status()).toBe(401);
	});
});
