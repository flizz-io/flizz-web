import type { Request, Response } from 'express';

import {
	contactMessageUuidSchema,
	listContactMessagesQuerySchema,
	updateContactMessageSchema
} from '../schemas/contact-schema.js';
import {
	editContactMessage,
	listContactMessages,
	openContactMessage,
	removeContactMessage,
	summarizeContactMessages
} from '../services/contact-message-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { parseInput } from '../utils/parse-input.js';

const uuidOf = (req: Request) =>
	parseInput(contactMessageUuidSchema, req.params).uuid;

/** GET /api/contact-messages — `?folder=&search=&page=` */
export async function getContactMessages(req: Request, res: Response) {
	const filters = parseInput(listContactMessagesQuerySchema, req.query);
	res.json({ data: await listContactMessages(filters) });
}

/** GET /api/contact-messages/summary — counts per tab and unread. */
export async function getContactMessageSummary(_req: Request, res: Response) {
	res.json({ data: await summarizeContactMessages() });
}

/** GET /api/contact-messages/:uuid — the first open marks it read. */
export async function getContactMessage(req: Request, res: Response) {
	res.json({
		data: await openContactMessage(currentUserOf(res), uuidOf(req))
	});
}

/** PATCH /api/contact-messages/:uuid — `{ status?, internalNote? }` */
export async function updateContactMessage(req: Request, res: Response) {
	const input = parseInput(updateContactMessageSchema, req.body);
	res.json({
		data: await editContactMessage(currentUserOf(res), uuidOf(req), input)
	});
}

/** DELETE /api/contact-messages/:uuid — soft. */
export async function deleteContactMessage(req: Request, res: Response) {
	await removeContactMessage(currentUserOf(res), uuidOf(req));
	res.status(204).end();
}
