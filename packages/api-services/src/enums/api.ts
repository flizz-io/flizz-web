/** Machine-readable API error codes — the `error.code` of a failed response. */
export enum ApiErrorCode {
	VALIDATION_FAILED = 'VALIDATION_FAILED',
	UNAUTHENTICATED = 'UNAUTHENTICATED',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	CONFLICT = 'CONFLICT',
	INTERNAL = 'INTERNAL'
}

export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PATCH = 'PATCH',
	PUT = 'PUT',
	DELETE = 'DELETE'
}
