import {
	imagePresets,
	withImageSize,
	type ImageSizeOverrides
} from '@workspace/media-library';

import { recordImage, retireMedia, storeImage } from './media-service.js';
import { revalidateSite } from './site-revalidation-service.js';
import { prisma } from '../configs/database.js';
import { maxGalleryImages } from '../constants/media.js';
import { RevalidationTag } from '../enums/revalidation-tag.js';
import type { MediaFile, Prisma } from '../generated/prisma/client.js';
import { MediaPurpose } from '../generated/prisma/enums.js';
import type {
	GalleryImageResponse,
	ImageResponse,
	ProjectImagesResponse
} from '../types/project.js';
import type { CurrentUser } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { mediaUrl } from '../utils/media-url.js';

interface UploadedFile {
	buffer: Buffer;
	originalname: string;
}

function toImageResponse(media: MediaFile): ImageResponse | null {
	const url = mediaUrl(media);

	return url
		? { uuid: media.uuid, url, width: media.width, height: media.height }
		: null;
}

/** A live (not deleted) project's id, or 404. */
async function findProjectId(uuid: string) {
	const project = await prisma.project.findFirst({
		where: { uuid, deletedAt: null },
		select: { id: true }
	});
	if (!project) throw HttpError.notFound('No such project.');

	return project.id;
}

const liveGallery = (projectId: number) =>
	({
		where: { projectId, deletedAt: null },
		include: { media: true },
		orderBy: [{ position: 'asc' }, { id: 'asc' }]
	}) satisfies Prisma.ProjectImageFindManyArgs;

/** The cover and the live gallery, in order — what every endpoint returns. */
export async function getProjectImages(
	projectId: number
): Promise<ProjectImagesResponse> {
	const [project, gallery] = await Promise.all([
		prisma.project.findUniqueOrThrow({
			where: { id: projectId },
			include: { coverImage: true }
		}),
		prisma.projectImage.findMany(liveGallery(projectId))
	]);

	return {
		cover: project.coverImage ? toImageResponse(project.coverImage) : null,
		gallery: gallery.flatMap((entry): GalleryImageResponse[] => {
			const image = toImageResponse(entry.media);
			return image
				? [
						{
							...image,
							uuid: entry.uuid,
							mediaUuid: entry.media.uuid,
							caption: entry.caption,
							position: entry.position
						}
					]
				: [];
		})
	};
}

/** After a change: the site refreshes, the caller gets the new state. */
function imagesChanged(projectId: number) {
	revalidateSite(RevalidationTag.PROJECTS);

	return getProjectImages(projectId);
}

/** Marks the project as changed by this user. */
const touch = (
	tx: Prisma.TransactionClient,
	actor: CurrentUser,
	projectId: number
) =>
	tx.project.update({
		where: { id: projectId },
		data: { updatedById: actor.id }
	});

/** Replaces the cover; the previous one is retired, not deleted. */
export async function setProjectCover(
	actor: CurrentUser,
	projectUuid: string,
	file: UploadedFile,
	size: ImageSizeOverrides
) {
	const projectId = await findProjectId(projectUuid);
	// Upload outside the transaction — it can be slow (see `storeImage`).
	const image = await storeImage({
		buffer: file.buffer,
		originalName: file.originalname,
		purpose: MediaPurpose.PROJECT_COVER,
		preset: withImageSize(imagePresets.projectCover, size)
	});

	await prisma.$transaction(async (tx) => {
		const current = await tx.project.findUniqueOrThrow({
			where: { id: projectId },
			select: { coverImageId: true }
		});
		const media = await recordImage(tx, actor, image);
		if (current.coverImageId) {
			await retireMedia(tx, actor, current.coverImageId);
		}
		await tx.project.update({
			where: { id: projectId },
			data: { coverImageId: media.id, updatedById: actor.id }
		});
	});

	return imagesChanged(projectId);
}

/** Clears the cover — the pages fall back to registration marks. */
export async function clearProjectCover(
	actor: CurrentUser,
	projectUuid: string
) {
	const projectId = await findProjectId(projectUuid);

	await prisma.$transaction(async (tx) => {
		const current = await tx.project.findUniqueOrThrow({
			where: { id: projectId },
			select: { coverImageId: true }
		});
		if (current.coverImageId) {
			await retireMedia(tx, actor, current.coverImageId);
		}
		await tx.project.update({
			where: { id: projectId },
			data: { coverImageId: null, updatedById: actor.id }
		});
	});

	return imagesChanged(projectId);
}

/** Adds an image at the end of the gallery (at most `maxGalleryImages`). */
export async function addGalleryImage(
	actor: CurrentUser,
	projectUuid: string,
	file: UploadedFile,
	input: ImageSizeOverrides & { caption?: string | null }
) {
	const projectId = await findProjectId(projectUuid);
	const count = await prisma.projectImage.count({
		where: { projectId, deletedAt: null }
	});
	if (count >= maxGalleryImages) {
		throw HttpError.conflict(
			`A gallery holds up to ${maxGalleryImages} images — remove one first.`
		);
	}

	const { caption, ...size } = input;
	const image = await storeImage({
		buffer: file.buffer,
		originalName: file.originalname,
		purpose: MediaPurpose.PROJECT_GALLERY,
		preset: withImageSize(imagePresets.projectGallery, size)
	});

	await prisma.$transaction(async (tx) => {
		const last = await tx.projectImage.findFirst({
			where: { projectId, deletedAt: null },
			orderBy: { position: 'desc' },
			select: { position: true }
		});
		const media = await recordImage(tx, actor, image);
		await tx.projectImage.create({
			data: {
				projectId,
				mediaId: media.id,
				position: (last?.position ?? -1) + 1,
				caption: caption ?? null,
				createdById: actor.id,
				updatedById: actor.id
			}
		});
		await touch(tx, actor, projectId);
	});

	return imagesChanged(projectId);
}

/** A live gallery entry of this project, or 404. */
async function findGalleryImage(projectId: number, imageUuid: string) {
	const entry = await prisma.projectImage.findFirst({
		where: { uuid: imageUuid, projectId, deletedAt: null }
	});
	if (!entry) throw HttpError.notFound('No such gallery image.');

	return entry;
}

export async function updateGalleryCaption(
	actor: CurrentUser,
	projectUuid: string,
	imageUuid: string,
	caption: string | null
) {
	const projectId = await findProjectId(projectUuid);
	const entry = await findGalleryImage(projectId, imageUuid);

	await prisma.$transaction([
		prisma.projectImage.update({
			where: { id: entry.id },
			data: { caption, updatedById: actor.id }
		}),
		prisma.project.update({
			where: { id: projectId },
			data: { updatedById: actor.id }
		})
	]);

	return imagesChanged(projectId);
}

/** Retires one gallery image (entry and file record) — nothing is deleted. */
export async function retireGalleryImage(
	actor: CurrentUser,
	projectUuid: string,
	imageUuid: string
) {
	const projectId = await findProjectId(projectUuid);
	const entry = await findGalleryImage(projectId, imageUuid);
	const now = new Date();

	await prisma.$transaction(async (tx) => {
		await tx.projectImage.update({
			where: { id: entry.id },
			data: {
				deletedAt: now,
				deletedById: actor.id,
				updatedById: actor.id
			}
		});
		await retireMedia(tx, actor, entry.mediaId);
		await touch(tx, actor, projectId);
	});

	return imagesChanged(projectId);
}

/**
 * Puts the gallery in the given order. The list must name every live image
 * exactly once — a partial or stale list (someone else changed the gallery)
 * is refused rather than guessed at.
 */
export async function reorderGallery(
	actor: CurrentUser,
	projectUuid: string,
	imageUuids: string[]
) {
	const projectId = await findProjectId(projectUuid);
	const live = await prisma.projectImage.findMany({
		where: { projectId, deletedAt: null },
		select: { id: true, uuid: true }
	});

	const byUuid = new Map(live.map((entry) => [entry.uuid, entry.id]));
	const complete =
		imageUuids.length === live.length &&
		new Set(imageUuids).size === imageUuids.length &&
		imageUuids.every((uuid) => byUuid.has(uuid));
	if (!complete) {
		throw HttpError.conflict(
			'The gallery changed since it was loaded — reload and try again.'
		);
	}

	await prisma.$transaction([
		...imageUuids.map((uuid, position) =>
			prisma.projectImage.update({
				where: { id: byUuid.get(uuid) },
				data: { position, updatedById: actor.id }
			})
		),
		prisma.project.update({
			where: { id: projectId },
			data: { updatedById: actor.id }
		})
	]);

	return imagesChanged(projectId);
}
