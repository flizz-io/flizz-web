/** Machine-readable error codes — the `error.code` of every failed response. */
export enum ErrorCode {
	VALIDATION_FAILED = 'VALIDATION_FAILED',
	UNAUTHENTICATED = 'UNAUTHENTICATED',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	CONFLICT = 'CONFLICT',
	INTERNAL = 'INTERNAL'
}
