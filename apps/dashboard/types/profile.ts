import type { UserRole } from '@/enums/user';

/** The signed-in user's own profile, as `GET /api/me/profile` returns it. */
export interface Profile {
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

/** What `PATCH /api/me/profile` takes — blank clears a field. */
export interface ProfileInput {
	firstName: string;
	lastName: string;
	linkedinUrl: string;
	xUrl: string;
	portfolioUrl: string;
}
