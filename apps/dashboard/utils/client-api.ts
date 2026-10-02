import { apiService, HttpMethod, toUploadForm } from '@workspace/api-services';

interface ClientApiOptions {
	method?: HttpMethod;
	body?: unknown;
}

/**
 * Calls the API from the browser through the dashboard's own `/api` rewrite,
 * so the session cookie goes along. Returns `data`, or throws an `ApiError`.
 * Features with a service in `@workspace/api-services` call that instead.
 */
export function clientApi<T>(
	path: string,
	{ method = HttpMethod.GET, body }: ClientApiOptions = {}
): Promise<T> {
	return apiService<T>(path, { method, body });
}

/**
 * Uploads a file (multipart) through the `/api` rewrite. Extra fields go
 * alongside it — e.g. an image's `width` / `height` / `fit`.
 */
export function clientUpload<T>(
	path: string,
	file: File,
	fields: Record<string, string | number> = {}
): Promise<T> {
	return apiService<T>(path, {
		method: HttpMethod.POST,
		form: toUploadForm(file, fields)
	});
}
