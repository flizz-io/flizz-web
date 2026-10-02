import type { UserLifecycle } from '@/enums/user';
import type {
	PermissionMap,
	UserReference,
	UserRole
} from '@workspace/api-services';

/** A user as `GET /api/users` returns them. */
export interface TeamUser {
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

/** What `POST /api/users` takes. */
export interface AddTeamUserInput {
	email: string;
	role: UserRole.ADMIN | UserRole.TEAM_MEMBER;
	designation?: string | null;
}
