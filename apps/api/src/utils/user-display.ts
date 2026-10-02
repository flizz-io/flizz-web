import type { UserReference } from '../types/team.js';

interface NamedUser {
	uuid: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
}

/** "First Last", or the email until they've set a name. */
export function displayName(user: NamedUser) {
	const name = [user.firstName, user.lastName].filter(Boolean).join(' ');

	return name || user.email;
}

export function toUserReference(
	user: NamedUser | null | undefined
): UserReference | null {
	return user ? { uuid: user.uuid, name: displayName(user) } : null;
}
