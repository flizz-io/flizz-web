import type { Feature, UserRole } from '../generated/prisma/enums.js';

/** One feature's grant, as the API exposes it. */
export interface FeatureGrant {
	create: boolean;
	view: boolean;
	edit: boolean;
	delete: boolean;
}

/** Every feature's grant — admins get all of them, always. */
export type PermissionMap = Record<Feature, FeatureGrant>;

/** The signed-in user, as `GET /api/auth/me` returns it. */
export interface AuthUserResponse {
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

/**
 * What `requireAuth` leaves on `res.locals` — the response shape plus the
 * internal id, which the API needs for audit columns and never sends out.
 */
export interface CurrentUser extends AuthUserResponse {
	id: number;
}

/** The Google account an ID token vouches for. */
export interface GoogleProfile {
	/** Google's stable account id. */
	sub: string;
	email: string;
	givenName: string | null;
	familyName: string | null;
	picture: string | null;
}
