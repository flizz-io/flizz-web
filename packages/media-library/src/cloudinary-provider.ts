import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

import type { StorageProvider } from './storage-provider.js';

export interface CloudinaryOptions {
	cloudName: string;
	apiKey: string;
	apiSecret: string;
	/** Folder every upload goes under, e.g. `flizz`. */
	folder: string;
}

/** `2026/10/<uuid>.webp` → `{ publicId: '<folder>/2026/10/<uuid>', format: 'webp' }` */
function splitKey(folder: string, key: string) {
	const dot = key.lastIndexOf('.');
	const base = dot === -1 ? key : key.slice(0, dot);
	const format = dot === -1 ? undefined : key.slice(dot + 1);

	return { publicId: `${folder}/${base}`, format };
}

/**
 * Files on Cloudinary. Images arrive already processed (`processImage`), so
 * Cloudinary stores the small final file and serves it from its CDN; no
 * transformations are requested, which keeps free-tier credits for traffic.
 * Nothing is ever destroyed — retired files stay, as everywhere else.
 */
export function createCloudinaryProvider({
	cloudName,
	apiKey,
	apiSecret,
	folder
}: CloudinaryOptions): StorageProvider {
	const settings = {
		cloud_name: cloudName,
		api_key: apiKey,
		api_secret: apiSecret,
		secure: true
	};
	const root = folder.replace(/^\/+|\/+$/g, '');

	return {
		name: 'cloudinary',
		put(key, data) {
			const { publicId, format } = splitKey(root, key);

			return new Promise<void>((resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							...settings,
							public_id: publicId,
							resource_type: 'image',
							format,
							overwrite: false,
							unique_filename: false,
							use_filename: false
						},
						(error, result?: UploadApiResponse) => {
							if (error || !result) {
								reject(
									new Error(
										`Cloudinary upload failed: ${error?.message ?? 'no response'}`
									)
								);
								return;
							}
							resolve();
						}
					)
					.end(data);
			});
		},
		publicUrl(key) {
			const { publicId, format } = splitKey(root, key);

			return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/upload/${publicId}${format ? `.${format}` : ''}`;
		}
	};
}
