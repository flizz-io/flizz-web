import type { Request, Response } from 'express';

import { googleSignInSchema } from '../schemas/auth-schema.js';
import { verifyGoogleIdToken } from '../services/google-service.js';
import { createSessionToken } from '../services/session-service.js';
import {
	signInWithGoogle,
	toAuthUserResponse
} from '../services/user-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { parseInput } from '../utils/parse-input.js';
import {
	clearSessionCookie,
	setSessionCookie
} from '../utils/session-cookie.js';

/** POST /api/auth/google — swap a Google ID token for a session. */
export async function googleSignIn(req: Request, res: Response) {
	const { credential } = parseInput(googleSignInSchema, req.body);
	const profile = await verifyGoogleIdToken(credential);
	const user = await signInWithGoogle(profile);

	setSessionCookie(res, await createSessionToken(user.uuid));
	res.json({ data: toAuthUserResponse(user) });
}

/** GET /api/auth/me — the signed-in user, role and permissions. */
export function getMe(_req: Request, res: Response) {
	res.json({ data: toAuthUserResponse(currentUserOf(res)) });
}

/** POST /api/auth/logout — always succeeds, signed in or not. */
export function logout(_req: Request, res: Response) {
	clearSessionCookie(res);
	res.status(204).end();
}
