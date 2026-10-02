import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { StorageProvider } from './storage-provider.js';

export interface LocalDiskOptions {
	/** Directory files are written under. */
	rootDir: string;
	/** URL the directory is served from, e.g. `http://localhost:3500/api/media`. */
	publicBaseUrl: string;
}

/**
 * Files on the server's own disk, served by the API. Fine for one server; a
 * second instance or a stateless host needs an object-store provider instead.
 */
export function createLocalDiskProvider({
	rootDir,
	publicBaseUrl
}: LocalDiskOptions): StorageProvider {
	const root = path.resolve(rootDir);
	const base = publicBaseUrl.replace(/\/+$/, '');

	/** The file's path — refusing any key that would escape the root. */
	const resolveKey = (key: string) => {
		const target = path.resolve(root, key);
		if (!target.startsWith(`${root}${path.sep}`)) {
			throw new Error(`Storage key escapes the media root: ${key}`);
		}

		return target;
	};

	return {
		name: 'local',
		async put(key, data) {
			const target = resolveKey(key);
			await mkdir(path.dirname(target), { recursive: true });
			// `wx`: fail rather than silently overwrite an existing file.
			await writeFile(target, data, { flag: 'wx' });
		},
		publicUrl(key) {
			return `${base}/${key.split('/').map(encodeURIComponent).join('/')}`;
		}
	};
}
