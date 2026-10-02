interface NamedUser {
	email: string;
	firstName: string | null;
	lastName: string | null;
}

/** "First Last", or the email until they've set a name. */
export function displayName(user: NamedUser) {
	const name = [user.firstName, user.lastName].filter(Boolean).join(' ');

	return name || user.email;
}

/** Up to two initials for an avatar fallback. */
export function initials(user: NamedUser) {
	return displayName(user)
		.split(/[\s@.]+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');
}
