/** Why an admin landed on /login — drives the notice shown there. */
export enum LoginReason {
	EXPIRED = 'expired'
}

/** Machine-readable API error codes the dashboard reacts to. */
export enum ApiErrorCode {
	VALIDATION_FAILED = 'VALIDATION_FAILED',
	UNAUTHENTICATED = 'UNAUTHENTICATED',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	CONFLICT = 'CONFLICT',
	INTERNAL = 'INTERNAL'
}
