import { ErrorCode } from '../enums/error-code.js';

/**
 * An error that maps straight onto a response. Throw it anywhere in a request
 * — Express 5 forwards rejected promises — and the error handler turns it into
 * `{ error: { code, message, details? } }` with this status.
 */
export class HttpError extends Error {
	constructor(
		readonly status: number,
		readonly code: ErrorCode,
		message: string,
		readonly details?: unknown
	) {
		super(message);
		this.name = 'HttpError';
	}

	static badRequest(message: string, details?: unknown) {
		return new HttpError(
			400,
			ErrorCode.VALIDATION_FAILED,
			message,
			details
		);
	}

	static unauthenticated(message = 'Sign in to continue.') {
		return new HttpError(401, ErrorCode.UNAUTHENTICATED, message);
	}

	static forbidden(message = 'You do not have access to this.') {
		return new HttpError(403, ErrorCode.FORBIDDEN, message);
	}

	static notFound(message = 'Not found.') {
		return new HttpError(404, ErrorCode.NOT_FOUND, message);
	}

	static conflict(message: string) {
		return new HttpError(409, ErrorCode.CONFLICT, message);
	}

	static tooManyRequests(
		message = 'Too many requests. Wait a few minutes and try again.'
	) {
		return new HttpError(429, ErrorCode.RATE_LIMITED, message);
	}
}
