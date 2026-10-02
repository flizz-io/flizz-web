import { randomUUID } from 'node:crypto';

/**
 * A fresh, unguessable key, grouped by month so a directory never grows
 * without bound: `2026/10/9b2c….webp`.
 */
export function createStorageKey(extension: string, now = new Date()) {
	const month = String(now.getUTCMonth() + 1).padStart(2, '0');

	return `${now.getUTCFullYear()}/${month}/${randomUUID()}.${extension}`;
}
