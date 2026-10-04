import { expect, test } from '@playwright/test';

import { adminStatePath, appUrls } from '../../support/urls';

test.use({ storageState: adminStatePath });

interface Item {
	uuid: string;
	slug: string;
}

/**
 * C4's live end-to-end check: a project is created as a Draft (not public),
 * published (public on the API and the website), then deleted (gone again).
 * Writes to the local database only; the project is soft-deleted at the end.
 */
test('create, publish and delete a project', async ({ request, page }) => {
	const services = await request.get('/api/services');
	expect(services.status()).toBe(200);
	const service = ((await services.json()).data as Item[])[0];
	expect(
		service,
		'needs at least one service — seed the database'
	).toBeTruthy();

	const name = `E2E smoke ${Date.now()}`;
	const created = await request.post('/api/projects', {
		data: {
			name,
			client: 'Playwright',
			sector: 'OPERATIONS',
			serviceUuid: service?.uuid,
			year: new Date().getFullYear(),
			summary: 'Created by the smoke tests.',
			results: [{ label: 'Checks', from: 'Manual', to: 'Automated' }],
			duration: 'One run',
			team: 'One robot',
			brief: ['Prove the publish path works.'],
			constraints: ['Local database only.'],
			approach: ['Create, publish, delete.'],
			built: ['Nothing that lasts.']
		}
	});
	expect(created.status()).toBe(201);
	const project = (await created.json()).data as Item;
	const publicPath = `/api/public/projects/${project.slug}`;

	await test.step('a draft is not public', async () => {
		expect((await request.get(publicPath)).status()).toBe(404);
	});

	await test.step('publishing makes it public', async () => {
		const published = await request.patch(`/api/projects/${project.uuid}`, {
			data: { status: 'PUBLISHED' }
		});
		expect(published.status()).toBe(200);
		expect((await request.get(publicPath)).status()).toBe(200);

		const list = await request.get('/api/public/projects');
		const slugs = ((await list.json()).data as Item[]).map(
			(item) => item.slug
		);
		expect(slugs).toContain(project.slug);
	});

	await test.step('the website shows it', async () => {
		const response = await page.goto(
			`${appUrls.web}/portfolio/${project.slug}`
		);
		expect(response?.status()).toBe(200);
		await expect(page.getByRole('heading', { level: 1 })).toContainText(
			name
		);
	});

	await test.step('deleting removes it', async () => {
		const deleted = await request.delete(`/api/projects/${project.uuid}`);
		expect(deleted.status()).toBe(204);
		expect((await request.get(publicPath)).status()).toBe(404);
	});
});
