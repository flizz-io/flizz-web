import path from 'node:path';

import {
	createCloudinaryProvider,
	createLocalDiskProvider,
	type StorageProvider
} from '@workspace/media-library';

import { env } from './env.js';
import { MediaProvider } from '../enums/media-provider.js';

/** Where the local provider writes (relative to apps/api), served at /api/media. */
export const mediaRootDir = path.resolve(env.media.storageDir);

/** True when the API itself must serve uploaded files. */
export const servesMediaLocally = env.media.provider === MediaProvider.LOCAL;

/** The one storage provider — chosen by `MEDIA_PROVIDER`; nothing else changes. */
export const storage: StorageProvider =
	env.media.provider === MediaProvider.CLOUDINARY
		? createCloudinaryProvider(env.media.cloudinary)
		: createLocalDiskProvider({
				rootDir: mediaRootDir,
				publicBaseUrl: env.media.publicBaseUrl
			});
