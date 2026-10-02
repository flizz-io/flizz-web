import { ApiErrorCode } from '@/enums/auth';
import type { ApiErrorBody } from '@/types/api';

/** A failed API call, with the API's own code and message. */
export class ApiError extends Error {
	constructor(
		readonly status: number,
		readonly code: ApiErrorCode,
		message: string,
		readonly fieldErrors: Record<string, string> = {}
	) {
		super(message);
		this.name = 'ApiError';
	}
}

/** Turns a non-OK response into an `ApiError`, field messages keyed by field. */
export async function toApiError(response: Response) {
	const body = (await response
		.json()
		.catch(() => null)) as ApiErrorBody | null;
	const fieldErrors = Object.fromEntries(
		(body?.error.details ?? []).map((detail) => [
			detail.field,
			detail.message
		])
	);

	return new ApiError(
		response.status,
		body?.error.code ?? ApiErrorCode.INTERNAL,
		body?.error.message ?? 'Something went wrong. Try again.',
		fieldErrors
	);
}
