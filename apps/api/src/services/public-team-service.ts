import { prisma } from '../configs/database.js';
import { UserStatus } from '../generated/prisma/enums.js';
import type { PublicTeamMemberResponse } from '../types/team.js';
import { avatarUrlOf } from '../utils/media-url.js';

/**
 * The About page roster: active, not removed, and shown on the website by an
 * admin — in their chosen order. Only public profile fields leave the API.
 */
export async function listPublicTeam(): Promise<PublicTeamMemberResponse[]> {
	const members = await prisma.user.findMany({
		where: {
			showOnWebsite: true,
			status: UserStatus.ACTIVE,
			deletedAt: null
		},
		include: { photo: true },
		orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }]
	});

	return members.map((member) => ({
		uuid: member.uuid,
		firstName: member.firstName,
		lastName: member.lastName,
		designation: member.designation,
		photoUrl: avatarUrlOf(member),
		isFounder: member.isFounder,
		links: {
			linkedin: member.linkedinUrl,
			x: member.xUrl,
			portfolio: member.portfolioUrl
		}
	}));
}
