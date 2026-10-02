import { env } from '../configs/env.js';
import type { RevalidationTag } from '../enums/revalidation-tag.js';

const REVALIDATE_TIMEOUT_MS = 5000;

/**
 * Asks the public site to refresh pages built from this content. Fire and
 * forget: a site that's down or slow must never fail the dashboard change —
 * its pages still refresh on their own interval.
 */
export function revalidateSite(...tags: RevalidationTag[]) {
	const { url, revalidateSecret } = env.web;
	if (!url || !revalidateSecret) return;

	fetch(`${url}/api/revalidate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${revalidateSecret}`
		},
		body: JSON.stringify({ tags }),
		signal: AbortSignal.timeout(REVALIDATE_TIMEOUT_MS)
	})
		.then((response) => {
			if (!response.ok) {
				console.warn(
					`Site revalidation refused (${response.status}) for: ${tags.join(', ')}`
				);
			}
		})
		.catch((error: unknown) => {
			console.warn(
				`Site revalidation failed for: ${tags.join(', ')}`,
				error instanceof Error ? error.message : error
			);
		});
}
