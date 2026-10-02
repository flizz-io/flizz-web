import { ApiError, toApiError, unreachableMessage } from './api-error';
import { ApiErrorCode, HttpMethod } from '../enums/api';
import type { ApiContext, ApiQuery, ApiSuccessBody } from '../models/api';

export interface ApiServiceOptions {
	method?: HttpMethod;
	/** Sent as JSON. */
	body?: unknown;
	/** Sent as multipart instead of `body`. */
	form?: FormData;
	query?: ApiQuery;
	context?: ApiContext;
}

function toQueryString(query: ApiQuery = {}) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null && value !== '') {
			params.set(key, String(value));
		}
	}
	const text = params.toString();

	return text ? `?${text}` : '';
}

/**
 * The one fetcher every API call goes through. `path` is relative to `/api`
 * (`/projects`). Returns the response's `data` (`undefined` for a 204), or
 * throws an `ApiError` — status 0 when the server can't be reached.
 */
export async function apiService<T>(
	path: string,
	{
		method = HttpMethod.GET,
		body,
		form,
		query,
		context = {}
	}: ApiServiceOptions = {}
): Promise<T> {
	const { baseUrl = '', headers = {}, init = {} } = context;
	const url = `${baseUrl}/api${path}${toQueryString(query)}`;
	const json = body !== undefined && !form;

	const response = await fetch(url, {
		...init,
		method,
		headers: {
			...(json ? { 'Content-Type': 'application/json' } : {}),
			...headers
		},
		body: form ?? (json ? JSON.stringify(body) : undefined)
	}).catch(() => {
		throw new ApiError(0, ApiErrorCode.INTERNAL, unreachableMessage);
	});

	if (!response.ok) throw await toApiError(response);
	if (response.status === 204) return undefined as T;

	const { data } = (await response.json()) as ApiSuccessBody<T>;
	return data;
}

/** A multipart body: the file as `file`, plus any extra fields. */
export function toUploadForm(
	file: Blob,
	fields: Record<string, string | number | null | undefined> = {}
) {
	const form = new FormData();
	form.append('file', file);
	for (const [key, value] of Object.entries(fields)) {
		if (value !== undefined && value !== null)
			form.append(key, String(value));
	}

	return form;
}
