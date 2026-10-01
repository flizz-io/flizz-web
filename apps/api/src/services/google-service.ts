import { OAuth2Client } from 'google-auth-library';

import { env } from '../configs/env.js';
import type { GoogleProfile } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';

const client = new OAuth2Client();

/**
 * Verifies a Google ID token — signature against Google's published keys,
 * expiry, and that it was issued for *our* client — and returns the account
 * it vouches for. Only verified emails count: an unverified one could be
 * anyone's.
 */
export async function verifyGoogleIdToken(
	credential: string
): Promise<GoogleProfile> {
	const payload = await client
		.verifyIdToken({ idToken: credential, audience: env.googleClientId })
		.then((ticket) => ticket.getPayload())
		.catch(() => undefined);

	if (!payload?.email || !payload.email_verified) {
		throw HttpError.unauthenticated(
			'Google sign-in could not be verified.'
		);
	}

	return {
		sub: payload.sub,
		email: payload.email.toLowerCase(),
		givenName: payload.given_name ?? null,
		familyName: payload.family_name ?? null,
		picture: payload.picture ?? null
	};
}
