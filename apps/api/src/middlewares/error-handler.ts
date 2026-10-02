import type { NextFunction, Request, Response } from 'express';

import { env } from '../configs/env.js';
import { ErrorCode } from '../enums/error-code.js';
import { HttpError } from '../utils/http-error.js';

/** Any `/api` path no route claimed. */
export const notFoundHandler = (req: Request) => {
	throw HttpError.notFound(`No route for ${req.method} ${req.path}.`);
};

/**
 * Every failure leaves as `{ error: { code, message, details? } }`. Known
 * errors keep their status and message; anything unexpected is logged and
 * reported as a generic 500 — internals never reach the client in production.
 */
export const errorHandler = (
	error: unknown,
	_req: Request,
	res: Response,
	// Express recognises an error handler by its four parameters.
	_next: NextFunction
) => {
	if (error instanceof HttpError) {
		res.status(error.status).json({
			error: {
				code: error.code,
				message: error.message,
				...(error.details === undefined
					? {}
					: { details: error.details })
			}
		});
		return;
	}

	// Malformed JSON bodies arrive from express.json() as a 400 SyntaxError.
	if (error instanceof SyntaxError && 'status' in error) {
		res.status(400).json({
			error: {
				code: ErrorCode.VALIDATION_FAILED,
				message: 'The request body is not valid JSON.'
			}
		});
		return;
	}

	console.error(error);
	res.status(500).json({
		error: {
			code: ErrorCode.INTERNAL,
			message: env.isProduction
				? 'Something went wrong on our side.'
				: error instanceof Error
					? error.message
					: String(error)
		}
	});
};
