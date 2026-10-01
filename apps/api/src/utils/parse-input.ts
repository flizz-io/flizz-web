import type { z } from 'zod';

import { HttpError } from './http-error.js';

/**
 * Validates request input against a Zod schema and returns it typed. On
 * failure it throws a 400 listing every problem by field, so controllers
 * never handle invalid input themselves:
 *
 *     const body = parseInput(googleSignInSchema, req.body);
 */
export function parseInput<Schema extends z.ZodType>(
	schema: Schema,
	input: unknown
): z.infer<Schema> {
	const result = schema.safeParse(input);
	if (result.success) return result.data;

	throw HttpError.badRequest(
		'Some fields are missing or invalid.',
		result.error.issues.map((issue) => ({
			field: issue.path.join('.'),
			message: issue.message
		}))
	);
}
