import { prisma } from '../configs/database.js';
import type { Prisma } from '../generated/prisma/client.js';
import { UserStatus } from '../generated/prisma/enums.js';
import type {
	AuthUserResponse,
	CurrentUser,
	GoogleProfile
} from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { permissionMap } from '../utils/permissions.js';

/** Same message for "not listed", "removed" and "suspended" — don't reveal which. */
const NO_ACCESS_MESSAGE =
	"This Google account doesn't have access. Ask an admin to add you.";

const withPermissions = {
	include: { permissions: true }
} satisfies Prisma.UserDefaultArgs;

type UserWithPermissions = Prisma.UserGetPayload<typeof withPermissions>;

/** Signed in and allowed: not removed, not suspended. */
function canSignIn(user: { deletedAt: Date | null; status: UserStatus }) {
	return !user.deletedAt && user.status === UserStatus.ACTIVE;
}

export function toCurrentUser(user: UserWithPermissions): CurrentUser {
	return {
		id: user.id,
		uuid: user.uuid,
		email: user.email,
		role: user.role,
		firstName: user.firstName,
		lastName: user.lastName,
		designation: user.designation,
		avatarUrl: user.photoUrl ?? user.googleAvatarUrl,
		permissions: permissionMap(user.role, user.permissions)
	};
}

/** The response shape — the internal id stays behind. */
export function toAuthUserResponse({
	id: _id,
	...user
}: CurrentUser): AuthUserResponse {
	return user;
}

/**
 * Lets a verified Google account in if — and only if — an admin has added its
 * email and the user is neither removed nor suspended. Links Google's account
 * id and stamps the first sign-in; names Google reports only fill fields the
 * user hasn't set, so their own edits are never overwritten.
 */
export async function signInWithGoogle(
	profile: GoogleProfile
): Promise<CurrentUser> {
	const user = await prisma.user.findUnique({
		where: { email: profile.email }
	});

	if (!user || !canSignIn(user)) throw HttpError.forbidden(NO_ACCESS_MESSAGE);

	// An added email now claimed by a different Google account (the address
	// was recycled) is refused rather than silently re-linked.
	if (user.googleSub && user.googleSub !== profile.sub) {
		throw HttpError.forbidden(NO_ACCESS_MESSAGE);
	}

	const now = new Date();
	const signedIn = await prisma.user.update({
		where: { id: user.id },
		data: {
			googleSub: profile.sub,
			googleAvatarUrl: profile.picture,
			firstName: user.firstName ?? profile.givenName,
			lastName: user.lastName ?? profile.familyName,
			firstLoginAt: user.firstLoginAt ?? now,
			lastLoginAt: now
		},
		...withPermissions
	});

	return toCurrentUser(signedIn);
}

/** The user a session names — `null` once removed or suspended. */
export async function findSignedInUser(uuid: string) {
	const user = await prisma.user.findUnique({
		where: { uuid },
		...withPermissions
	});

	return user && canSignIn(user) ? toCurrentUser(user) : null;
}
