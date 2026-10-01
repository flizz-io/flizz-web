import {
	createStorageKey,
	InvalidImageError,
	processImage,
	type ImagePreset
} from '@workspace/media-library';

import { storage } from '../configs/media.js';
import type { Prisma } from '../generated/prisma/client.js';
import type { MediaPurpose } from '../generated/prisma/enums.js';
import type { CurrentUser } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';

export interface StoreImageInput {
	buffer: Buffer;
	originalName: string;
	purpose: MediaPurpose;
	preset: ImagePreset;
}

/** An image already in storage, waiting to be recorded. */
export interface StoredImage {
	purpose: MediaPurpose;
	storageKey: string;
	mimeType: string;
	sizeBytes: number;
	width: number;
	height: number;
	originalName: string;
}

/**
 * Validates, processes and uploads an image. Runs *outside* any database
 * transaction — an upload to Cloudinary can take longer than a transaction
 * may stay open. Every upload in the API goes through here (and so through
 * the shared media library).
 */
export async function storeImage(input: StoreImageInput): Promise<StoredImage> {
	const image = await processImage(input.buffer, input.preset).catch(
		(error: unknown) => {
			if (error instanceof InvalidImageError) {
				throw HttpError.badRequest(error.message);
			}
			throw error;
		}
	);

	const storageKey = createStorageKey(image.extension);
	await storage.put(storageKey, image.data, image.contentType);

	return {
		purpose: input.purpose,
		storageKey,
		mimeType: image.contentType,
		sizeBytes: image.sizeBytes,
		width: image.width,
		height: image.height,
		originalName: input.originalName.slice(0, 255)
	};
}

/** Records a stored image — inside the caller's transaction. */
export function recordImage(
	tx: Prisma.TransactionClient,
	actor: CurrentUser,
	image: StoredImage
) {
	return tx.mediaFile.create({
		data: {
			...image,
			provider: storage.name,
			createdById: actor.id,
			updatedById: actor.id
		}
	});
}

/** Retires a file record. The bytes stay — nothing is ever hard-deleted. */
export function retireMedia(
	tx: Prisma.TransactionClient,
	actor: CurrentUser,
	mediaId: number
) {
	return tx.mediaFile.update({
		where: { id: mediaId },
		data: {
			deletedAt: new Date(),
			deletedById: actor.id,
			updatedById: actor.id
		}
	});
}
