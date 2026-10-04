import type { Request, Response } from 'express';

import { serviceSlugParamSchema } from '../schemas/service-schema.js';
import {
	getPublicService,
	getServiceRedirect,
	listPublicServices
} from '../services/public-service-service.js';
import { parseInput } from '../utils/parse-input.js';

const slugOf = (req: Request) =>
	parseInput(serviceSlugParamSchema, req.params).slug;

/** GET /api/public/services — the list page and the home teaser. */
export async function getPublicServices(_req: Request, res: Response) {
	res.json({ data: await listPublicServices() });
}

/** GET /api/public/services/:slug — the detail page; 404 unless visible. */
export async function getPublicServiceBySlug(req: Request, res: Response) {
	res.json({ data: await getPublicService(slugOf(req)) });
}

/** GET /api/public/services/redirects/:slug — where an old slug went. */
export async function getPublicServiceRedirect(req: Request, res: Response) {
	res.json({ data: await getServiceRedirect(slugOf(req)) });
}
