import { prisma } from '../configs/database.js';
import type { ProfileResponse } from '../types/team.js';
import type { CurrentUser } from '../types/user.js';

const profileSelect = {
	uuid: true,
	email: true,
	role: true,
	firstName: true,
	lastName: true,
	designation: true,
	photoUrl: true,
	googleAvatarUrl: true,
	linkedinUrl: true,
	xUrl: true,
	portfolioUrl: true
} as const;

export async function getProfile(user: CurrentUser): Promise<ProfileResponse> {
	return prisma.user.findUniqueOrThrow({
		where: { id: user.id },
		select: profileSelect
	});
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
): Promise<ProfileResponse> {
	return prisma.user.update({
		where: { id: user.id },
		data: { ...input, updatedById: user.id },
		select: profileSelect
	});
}
