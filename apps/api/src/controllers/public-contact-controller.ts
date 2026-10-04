import type { Request, Response } from 'express';

import { submitContactSchema } from '../schemas/contact-schema.js';
import { submitContactMessage } from '../services/public-contact-service.js';
import { parseInput } from '../utils/parse-input.js';

/** POST /api/public/contact — the website's Contact Us form. */
export async function postContactMessage(req: Request, res: Response) {
	const input = parseInput(submitContactSchema, req.body);
	await submitContactMessage(input, req.ip);

	// Never echo the record — the same answer whether stored or a caught bot.
	res.status(201).json({ data: { received: true } });
}
