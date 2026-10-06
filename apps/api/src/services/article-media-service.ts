import {
	imagePresets,
	withImageSize,
	type ImagePreset,
	type ImageSizeOverrides
} from '@workspace/media-library';

import { recordImage, retireMedia, storeImage } from './media-service.js';
import { revalidateSite } from './site-revalidation-service.js';
import { prisma } from '../configs/database.js';
import { RevalidationTag } from '../enums/revalidation-tag.js';
import { MediaPurpose } from '../generated/prisma/enums.js';
import type {
	ArticleBodyImageResponse,
	ArticleMediaResponse
} from '../types/article.js';
import type { ImageResponse } from '../types/project.js';
import type { CurrentUser } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { mediaUrl } from '../utils/media-url.js';

interface UploadedFile {
	buffer: Buffer;
	originalname: string;
}

interface MediaRow {
	uuid: string;
	storageKey: string;
	deletedAt: Date | null;
	width: number | null;
	height: number | null;
}

/** The two single-image slots an article has. */
type ArticleImageSlot = 'coverImageId' | 'ogImageId';

const slotPurpose: Record<ArticleImageSlot, MediaPurpose> = {
	coverImageId: MediaPurpose.ARTICLE_COVER,
	ogImageId: MediaPurpose.ARTICLE_OG_IMAGE
};

const slotPreset: Record<ArticleImageSlot, ImagePreset> = {
	coverImageId: imagePresets.articleCover,
	ogImageId: imagePresets.shareImage
};

/** A live media file as the API returns it, or `null`. */
export function toImageResponse(
	media: MediaRow | null | undefined
): ImageResponse | null {
	const url = mediaUrl(media);
	if (!media || !url) return null;

	return { uuid: media.uuid, url, width: media.width, height: media.height };
}

/** A live (not deleted) article's internal id by public id, or 404. */
async function findArticleId(uuid: string) {
	const article = await prisma.article.findFirst({
		where: { uuid, deletedAt: null },
		select: { id: true }
	});
	if (!article) throw HttpError.notFound('No such article.');

	return article.id;
}

async function articleMedia(id: number): Promise<ArticleMediaResponse> {
	const article = await prisma.article.findUniqueOrThrow({
		where: { id },
		select: { coverImage: true, ogImage: true }
	});

	return {
		cover: toImageResponse(article.coverImage),
		ogImage: toImageResponse(article.ogImage)
	};
}

/** Replaces the cover or share image; the previous one is retired, not deleted. */
export async function setArticleImage(
	actor: CurrentUser,
	uuid: string,
	slot: ArticleImageSlot,
	file: UploadedFile,
	size: ImageSizeOverrides
) {
	const id = await findArticleId(uuid);
	// Upload outside the transaction — it can be slow (see `storeImage`).
	const image = await storeImage({
		buffer: file.buffer,
		originalName: file.originalname,
		purpose: slotPurpose[slot],
		preset: withImageSize(slotPreset[slot], size)
	});

	await prisma.$transaction(async (tx) => {
		const current = await tx.article.findUniqueOrThrow({
			where: { id },
			select: { [slot]: true }
		});
		const media = await recordImage(tx, actor, image);
		const previous = current[slot];
		if (previous) await retireMedia(tx, actor, previous);
		await tx.article.update({
			where: { id },
			data: { [slot]: media.id, updatedById: actor.id }
		});
	});
	revalidateSite(RevalidationTag.ARTICLES);

	return articleMedia(id);
}

/** Clears the cover or share image — the page falls back (see articles-crud.md). */
export async function clearArticleImage(
	actor: CurrentUser,
	uuid: string,
	slot: ArticleImageSlot
) {
	const id = await findArticleId(uuid);
	const current = await prisma.article.findUniqueOrThrow({
		where: { id },
		select: { [slot]: true }
	});
	const previous = current[slot];

	if (previous) {
		await prisma.$transaction(async (tx) => {
			await retireMedia(tx, actor, previous);
			await tx.article.update({
				where: { id },
				data: { [slot]: null, updatedById: actor.id }
			});
		});
		revalidateSite(RevalidationTag.ARTICLES);
	}

	return articleMedia(id);
}

/**
 * Stores an image for a body image block. Nothing on the article changes
 * until the body that references it is saved.
 */
export async function addArticleBodyImage(
	actor: CurrentUser,
	uuid: string,
	file: UploadedFile,
	size: ImageSizeOverrides
): Promise<ArticleBodyImageResponse> {
	await findArticleId(uuid);
	const image = await storeImage({
		buffer: file.buffer,
		originalName: file.originalname,
		purpose: MediaPurpose.ARTICLE_IMAGE,
		preset: withImageSize(imagePresets.articleBodyImage, size)
	});
	const media = await prisma.$transaction((tx) =>
		recordImage(tx, actor, image)
	);
	const response = toImageResponse(media);
	if (!response) throw new Error('A just-stored image has no URL.');

	return response;
}

/**
 * The live body images among `uuids`, by media uuid — for resolving image
 * blocks to URLs and for checking a body only references real uploads.
 */
export async function bodyImagesByUuid(uuids: string[]) {
	if (uuids.length === 0) return new Map<string, ImageResponse>();

	const files = await prisma.mediaFile.findMany({
		where: {
			uuid: { in: uuids },
			purpose: MediaPurpose.ARTICLE_IMAGE,
			deletedAt: null
		}
	});

	return new Map(
		files.flatMap((file) => {
			const image = toImageResponse(file);

			return image ? [[file.uuid, image] as const] : [];
		})
	);
}
