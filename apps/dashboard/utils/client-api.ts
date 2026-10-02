import { ApiErrorCode } from '@/enums/auth';
import { ApiError, toApiError } from '@/utils/api-error';

interface ClientApiOptions {
	method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	body?: unknown;
}

/**
 * Calls the API from the browser through the dashboard's own `/api` rewrite,
 * so the session cookie goes along. Returns `data`, or throws an `ApiError`.
 */
export async function clientApi<T>(
	path: string,
	{ method = 'GET', body }: ClientApiOptions = {}
): Promise<T> {
	const response = await fetch(`/api${path}`, {
		method,
		headers:
			body === undefined
				? undefined
				: { 'Content-Type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body)
	}).catch(() => {
		throw new ApiError(
			0,
			ApiErrorCode.INTERNAL,
			"Can't reach the server right now. Try again in a moment."
		);
	});

	if (!response.ok) throw await toApiError(response);
	if (response.status === 204) return undefined as T;

	const { data } = (await response.json()) as { data: T };
	return data;
}

/**
 * Uploads a file (multipart) through the `/api` rewrite. Extra fields go
 * alongside it — e.g. an image's `width` / `height` / `fit`.
 */
export async function clientUpload<T>(
	path: string,
	file: File,
	fields: Record<string, string | number> = {}
): Promise<T> {
	const form = new FormData();
	form.append('file', file);
	for (const [key, value] of Object.entries(fields)) {
		form.append(key, String(value));
	}

	const response = await fetch(`/api${path}`, {
		method: 'POST',
		body: form
	}).catch(() => {
		throw new ApiError(
			0,
			ApiErrorCode.INTERNAL,
			"Can't reach the server right now. Try again in a moment."
		);
	});

	if (!response.ok) throw await toApiError(response);

	const { data } = (await response.json()) as { data: T };
	return data;
}
