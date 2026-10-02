import 'server-only';

import { CacheTag, contentRevalidate } from '@/constants/cache';
import type { TeamMember, TeamMemberLinks } from '@/types/about';
import {
	getPublicTeamService,
	type ApiContext,
	type PublicTeamMember
} from '@workspace/api-services';

const teamContext: ApiContext = {
	baseUrl: process.env.API_URL,
	init: {
		next: { revalidate: contentRevalidate, tags: [CacheTag.TEAM] }
	}
};

/** Links they've set — an unset one is left out, not shown empty. */
function linksOf(member: PublicTeamMember): TeamMemberLinks {
	return Object.fromEntries(
		Object.entries(member.links).filter(([, href]) => Boolean(href))
	);
}

function toTeamMember(member: PublicTeamMember): TeamMember | null {
	const name = [member.firstName, member.lastName].filter(Boolean).join(' ');
	// Someone shown before they've set a name has nothing to put on a slat.
	if (!name) return null;

	return {
		name,
		role: member.designation ?? '',
		...(member.photoUrl ? { photo: member.photoUrl } : {}),
		links: linksOf(member),
		isFounder: member.isFounder
	};
}

/**
 * The people admins chose to show on the website, in their display order —
 * Team › Edit › "Show on the website" in the dashboard.
 */
export async function getAboutTeam(): Promise<TeamMember[]> {
	return (await getPublicTeamService(teamContext)).flatMap((member) => {
		const entry = toTeamMember(member);
		return entry ? [entry] : [];
	});
}
