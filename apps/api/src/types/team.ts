import type { PermissionMap } from './user.js';
import type { UserLifecycle } from '../enums/user-lifecycle.js';
import type { UserRole } from '../generated/prisma/enums.js';

/** Who did something — enough to show "Created by …" without the email. */
export interface UserReference {
	uuid: string;
	name: string;
}

/** A user as the Team screen sees them. */
export interface TeamUserResponse {
	uuid: string;
	email: string;
	role: UserRole;
	lifecycle: UserLifecycle;
	firstName: string | null;
	lastName: string | null;
	designation: string | null;
	avatarUrl: string | null;
	linkedinUrl: string | null;
	xUrl: string | null;
	portfolioUrl: string | null;
	showOnWebsite: boolean;
	isFounder: boolean;
	displayOrder: number;
	/** Only Invited users — never signed in — can be removed. */
	canRemove: boolean;
	permissions: PermissionMap;
	firstLoginAt: string | null;
	lastLoginAt: string | null;
	suspendedAt: string | null;
	createdAt: string;
	updatedAt: string;
	createdBy: UserReference | null;
	updatedBy: UserReference | null;
	suspendedBy: UserReference | null;
}

/** The signed-in user's own profile. */
export interface ProfileResponse {
	uuid: string;
	email: string;
	role: UserRole;
	firstName: string | null;
	lastName: string | null;
	/** Read-only here — admins set it. */
	designation: string | null;
	photoUrl: string | null;
	googleAvatarUrl: string | null;
	linkedinUrl: string | null;
	xUrl: string | null;
	portfolioUrl: string | null;
}

/** A team member as the public About page sees them — nothing private. */
export interface PublicTeamMemberResponse {
	uuid: string;
	firstName: string | null;
	lastName: string | null;
	designation: string | null;
	photoUrl: string | null;
	isFounder: boolean;
	links: {
		linkedin: string | null;
		x: string | null;
		portfolio: string | null;
	};
}
