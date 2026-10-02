import type { Feature, UserRole } from '../enums/auth';

export interface FeatureGrant {
	create: boolean;
	view: boolean;
	edit: boolean;
	delete: boolean;
}

/** Every feature's grant — all-true for admins. */
export type PermissionMap = Record<Feature, FeatureGrant>;

/** The signed-in user, as `GET /api/auth/me` returns them. */
export interface AuthUser {
	uuid: string;
	email: string;
	role: UserRole;
	firstName: string | null;
	lastName: string | null;
	designation: string | null;
	/** Uploaded photo, else the Google avatar. */
	avatarUrl: string | null;
	permissions: PermissionMap;
}

/** Who did something — "Created by …". */
export interface UserReference {
	uuid: string;
	name: string;
}
