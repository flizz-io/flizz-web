import { jwtVerify, SignJWT } from 'jose';

import { env } from '../configs/env.js';
import {
	sessionAudience,
	sessionIssuer,
	sessionTtlSeconds
} from '../constants/auth.js';

const secret = new TextEncoder().encode(env.sessionSecret);
const ALGORITHM = 'HS256';

/** A signed session token carrying only the admin's public uuid. */
export function createSessionToken(adminUuid: string) {
	return new SignJWT({})
		.setProtectedHeader({ alg: ALGORITHM })
		.setSubject(adminUuid)
		.setIssuer(sessionIssuer)
		.setAudience(sessionAudience)
		.setIssuedAt()
		.setExpirationTime(`${sessionTtlSeconds}s`)
		.sign(secret);
}

/** The admin uuid a session token names, or `null` if it's invalid/expired. */
export async function readSessionToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, secret, {
			algorithms: [ALGORITHM],
			issuer: sessionIssuer,
			audience: sessionAudience
		});

		return payload.sub ?? null;
	} catch {
		return null;
	}
}
