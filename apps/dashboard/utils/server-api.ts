import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { sessionExpiredPath } from '@/constants/auth';
import { ApiError, apiService, type ApiContext } from '@workspace/api-services';

const UNAUTHENTICATED_STATUS = 401;

/**
 * The context a server component calls the API with: the API's origin, the
 * visitor's session cookie, and no caching.
 */
export async function serverApiContext(): Promise<ApiContext> {
	return {
		baseUrl: process.env.API_URL,
		headers: { cookie: (await cookies()).toString() },
		init: { cache: 'no-store' }
	};
}

/**
 * Runs an API call from a server component. A rejected session goes to sign
 * in again; any other failure throws the `ApiError` for the nearest error
 * boundary.
 *
 *     const projects = await serverCall(getProjectsService({}, context))
 */
export async function serverCall<T>(call: Promise<T>): Promise<T> {
	try {
		return await call;
	} catch (error) {
		if (
			error instanceof ApiError &&
			error.status === UNAUTHENTICATED_STATUS
		) {
			redirect(sessionExpiredPath);
		}
		throw error;
	}
}

/** `GET` any API path from a server component — see `serverCall`. */
export async function serverApi<T>(path: string): Promise<T> {
	return serverCall(
		apiService<T>(path, { context: await serverApiContext() })
	);
}
