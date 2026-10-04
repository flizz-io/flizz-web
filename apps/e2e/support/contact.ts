import type { APIRequestContext } from '@playwright/test';

import { appUrls } from './urls';

export interface InboxItem {
	uuid: string;
	email: string;
	status: string;
}

/** A unique, recognisable sender per test run. */
export function e2eSenderEmail() {
	return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

/** A complete, valid submission for `POST /api/public/contact`. */
export function contactPayload(email: string) {
	return {
		name: 'E2E Smoke',
		company: 'Playwright',
		email,
		scope: 'NEW_BUILD',
		start: 'EXPLORING',
		message: 'Sent by the smoke tests — safe to delete.',
		sourcePath: '/contact'
	};
}

/** Every message from this sender, any folder — needs an admin session. */
export async function findMessages(
	request: APIRequestContext,
	email: string
): Promise<InboxItem[]> {
	const response = await request.get(
		`${appUrls.api}/api/contact-messages?folder=ALL&search=${encodeURIComponent(email)}`
	);
	if (!response.ok()) {
		throw new Error(`Inbox search failed: ${response.status()}`);
	}

	return (await response.json()).data.items as InboxItem[];
}

/** Soft-deletes what a test sent, so the local inbox stays readable. */
export async function deleteMessages(
	request: APIRequestContext,
	items: InboxItem[]
) {
	for (const item of items) {
		await request.delete(
			`${appUrls.api}/api/contact-messages/${item.uuid}`
		);
	}
}
