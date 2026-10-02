import type { ApiErrorCode } from '@/enums/auth';

/** The API's failure body: `{ error: { code, message, details? } }`. */
export interface ApiErrorBody {
	error: {
		code: ApiErrorCode;
		message: string;
		details?: { field: string; message: string }[];
	};
}
