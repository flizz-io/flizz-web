import 'server-only';

import { cookies } from 'next/headers';

import type { AuthUser } from '@/types/user';

/**
 * The signed-in user, checked against the API — the real auth check behind
 * every dashboard page (`proxy.ts` only looks for the cookie). `null` when
 * the session is missing, expired, tampered with, or the user was removed or suspended.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
	const cookieHeader = (await cookies()).toString();
	if (!cookieHeader) return null;

	const response = await fetch(`${process.env.API_URL}/api/auth/me`, {
		headers: { cookie: cookieHeader },
		cache: 'no-store'
	});
	if (!response.ok) return null;

	const { data } = (await response.json()) as { data: AuthUser };
	return data;
}
