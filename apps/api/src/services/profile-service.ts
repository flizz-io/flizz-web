import {
	imagePresets,
	withImageSize,
	type ImageSizeOverrides
} from '@workspace/media-library';

import { recordImage, retireMedia, storeImage } from './media-service.js';
import { revalidateSite } from './site-revalidation-service.js';
import { prisma } from '../configs/database.js';
import { RevalidationTag } from '../enums/revalidation-tag.js';
import type { Prisma } from '../generated/prisma/client.js';
import { MediaPurpose } from '../generated/prisma/enums.js';
import type { ProfileResponse } from '../types/team.js';
import type { CurrentUser } from '../types/user.js';
import { mediaUrl } from '../utils/media-url.js';

const profileInclude = { photo: true } satisfies Prisma.UserInclude;

type ProfileUser = Prisma.UserGetPayload<{ include: typeof profileInclude }>;

function toProfileResponse(user: ProfileUser): ProfileResponse {
	return {
		uuid: user.uuid,
		email: user.email,
		role: user.role,
		firstName: user.firstName,
		lastName: user.lastName,
		designation: user.designation,
		photoUrl: mediaUrl(user.photo),
		googleAvatarUrl: user.googleAvatarUrl,
		linkedinUrl: user.linkedinUrl,
		xUrl: user.xUrl,
		portfolioUrl: user.portfolioUrl
	};
}

export async function getProfile(user: CurrentUser) {
	return toProfileResponse(
		await prisma.user.findUniqueOrThrow({
			where: { id: user.id },
			include: profileInclude
		})
	);
}

export interface UpdateProfileInput {
	firstName?: string | null;
	lastName?: string | null;
	linkedinUrl?: string | null;
	xUrl?: string | null;
	portfolioUrl?: string | null;
}

/** Name and links only — designation and everything else is admin-set. */
export async function updateProfile(
	user: CurrentUser,
	input: UpdateProfileInput
) {
	const updated = await prisma.user.update({
		where: { id: user.id },
		data: { ...input, updatedById: user.id },
		include: profileInclude
	});
	revalidateSite(RevalidationTag.TEAM);

	return toProfileResponse(updated);
}

/**
 * Replaces the user's photo; the previous one is retired, not deleted. The
 * output size defaults to the avatar preset (512×512 cover) unless the
 * uploader asked for another.
 */
export async function setProfilePhoto(
	user: CurrentUser,
	file: { buffer: Buffer; originalname: string },
	size: ImageSizeOverrides = {}
) {
	// Upload first — slow, and outside the transaction (see `storeImage`).
	const image = await storeImage({
		buffer: file.buffer,
		originalName: file.originalname,
		purpose: MediaPurpose.AVATAR,
		preset: withImageSize(imagePresets.avatar, size)
	});

	const updated = await prisma.$transaction(async (tx) => {
		const current = await tx.user.findUniqueOrThrow({
			where: { id: user.id },
			select: { photoId: true }
		});

		const photo = await recordImage(tx, user, image);

		if (current.photoId) await retireMedia(tx, user, current.photoId);

		return tx.user.update({
			where: { id: user.id },
			data: { photoId: photo.id, updatedById: user.id },
			include: profileInclude
		});
	});
	revalidateSite(RevalidationTag.TEAM);

	return toProfileResponse(updated);
}

/** Back to the Google avatar. */
export async function removeProfilePhoto(user: CurrentUser) {
	const updated = await prisma.$transaction(async (tx) => {
		const current = await tx.user.findUniqueOrThrow({
			where: { id: user.id },
			select: { photoId: true }
		});
		if (current.photoId) await retireMedia(tx, user, current.photoId);

		return tx.user.update({
			where: { id: user.id },
			data: { photoId: null, updatedById: user.id },
			include: profileInclude
		});
	});
	revalidateSite(RevalidationTag.TEAM);

	return toProfileResponse(updated);
}
