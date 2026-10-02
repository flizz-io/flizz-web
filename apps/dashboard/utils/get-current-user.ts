import 'server-only';

import { cookies } from 'next/headers';

import { getMeService, type AuthUser } from '@workspace/api-services';

/**
 * The signed-in user, checked against the API — the real auth check behind
 * every dashboard page (`proxy.ts` only looks for the cookie). `null` when
 * the session is missing, expired, tampered with, or the user was removed or suspended.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
	const cookieHeader = (await cookies()).toString();
	if (!cookieHeader) return null;

	return getMeService({
		baseUrl: process.env.API_URL,
		headers: { cookie: cookieHeader },
		init: { cache: 'no-store' }
	}).catch(() => null);
}
