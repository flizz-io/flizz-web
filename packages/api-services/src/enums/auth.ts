/** Mirrors the API's `UserRole` — same keys and values. */
export enum UserRole {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	TEAM_MEMBER = 'TEAM_MEMBER'
}

/** Mirrors the API's `Feature` — the grantable content features. */
export enum Feature {
	PROJECTS = 'PROJECTS',
	ARTICLES = 'ARTICLES',
	SERVICES = 'SERVICES',
	TESTIMONIALS = 'TESTIMONIALS',
	CONTACT_MESSAGES = 'CONTACT_MESSAGES'
}
