import type { Request, Response } from 'express';

import { imageSizeSchema } from '../schemas/media-schema.js';
import {
	createServiceSchema,
	listServicesQuerySchema,
	reorderServicesSchema,
	serviceUuidSchema,
	updateServiceSchema
} from '../schemas/service-schema.js';
import {
	addService,
	clearServiceOgImage,
	editService,
	getDashboardService,
	listDashboardServices,
	listServiceOptions,
	removeService,
	reorderServices,
	setServiceOgImage
} from '../services/service-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { HttpError } from '../utils/http-error.js';
import { parseInput } from '../utils/parse-input.js';

const uuidOf = (req: Request) => parseInput(serviceUuidSchema, req.params).uuid;

/** GET /api/services — `?search=&category=&status=` */
export async function listServices(req: Request, res: Response) {
	const filters = parseInput(listServicesQuerySchema, req.query);
	res.json({ data: await listDashboardServices(filters) });
}

/** GET /api/services/options — the project form's dropdown. */
export async function getServiceOptions(_req: Request, res: Response) {
	res.json({ data: await listServiceOptions() });
}

/** GET /api/services/:uuid */
export async function getService(req: Request, res: Response) {
	res.json({ data: await getDashboardService(uuidOf(req)) });
}

/** POST /api/services — always a Draft, last in its category. */
export async function createService(req: Request, res: Response) {
	const input = parseInput(createServiceSchema, req.body);
	res.status(201).json({
		data: await addService(currentUserOf(res), input)
	});
}

/** PATCH /api/services/:uuid */
export async function updateService(req: Request, res: Response) {
	const input = parseInput(updateServiceSchema, req.body);
	res.json({
		data: await editService(currentUserOf(res), uuidOf(req), input)
	});
}

/** DELETE /api/services/:uuid — soft; 409 while projects link to it. */
export async function deleteService(req: Request, res: Response) {
	await removeService(currentUserOf(res), uuidOf(req));
	res.status(204).end();
}

/** PUT /api/services/order — `{ category, serviceUuids: [...] }` */
export async function reorderServiceList(req: Request, res: Response) {
	const input = parseInput(reorderServicesSchema, req.body);
	res.json({ data: await reorderServices(currentUserOf(res), input) });
}

/** POST /api/services/:uuid/og-image — multipart `file` (+ `width`, `height`, `fit`). */
export async function uploadOgImage(req: Request, res: Response) {
	if (!req.file) throw HttpError.badRequest('Choose an image to upload.');
	const size = parseInput(imageSizeSchema, req.body);

	res.json({
		data: await setServiceOgImage(
			currentUserOf(res),
			uuidOf(req),
			req.file,
			size
		)
	});
}

/** DELETE /api/services/:uuid/og-image */
export async function removeOgImage(req: Request, res: Response) {
	res.json({
		data: await clearServiceOgImage(currentUserOf(res), uuidOf(req))
	});
}
