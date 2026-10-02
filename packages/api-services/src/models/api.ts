import type { ApiErrorCode } from '../enums/api';
import type { ImageFit } from '../enums/projects';

/** The API's success body: `{ data }`. */
export interface ApiSuccessBody<T> {
	data: T;
}

/** The API's failure body: `{ error: { code, message, details? } }`. */
export interface ApiErrorBody {
	error: {
		code: ApiErrorCode;
		message: string;
		details?: { field: string; message: string }[];
	};
}

/** Query-string values; `undefined`, `null` and `''` are left out. */
export type ApiQuery = Record<
	string,
	string | number | boolean | null | undefined
>;

/** `fetch` options plus Next's caching hints, for server callers. */
export interface ApiRequestInit extends Omit<RequestInit, 'body' | 'method'> {
	next?: { revalidate?: number | false; tags?: string[] };
}

/**
 * Where and how to call the API. In the browser the defaults are right — the
 * app's own `/api` rewrite, cookies included. A server passes the API's
 * origin, the visitor's cookie and any caching hints.
 */
export interface ApiContext {
	/** Origin in front of `/api` — empty for same-origin. */
	baseUrl?: string;
	headers?: Record<string, string>;
	init?: ApiRequestInit;
}

/** An image's output size — the uploader's `width` / `height` / `fit` props. */
export interface ImageSizeOptions {
	width?: number;
	height?: number;
	fit?: ImageFit;
}
