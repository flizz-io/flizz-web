import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { sessionExpiredPath } from '@/constants/auth';
import { toApiError } from '@/utils/api-error';

/**
 * Calls the API from a server component with the visitor's session cookie.
 * Returns `data`; a rejected session goes to sign in again, any other failure
 * throws an `ApiError` for the nearest error boundary.
 */
export async function serverApi<T>(path: string): Promise<T> {
	const response = await fetch(`${process.env.API_URL}/api${path}`, {
		headers: { cookie: (await cookies()).toString() },
		cache: 'no-store'
	});

	if (response.status === 401) redirect(sessionExpiredPath);
	if (!response.ok) throw await toApiError(response);

	const { data } = (await response.json()) as { data: T };
	return data;
}
