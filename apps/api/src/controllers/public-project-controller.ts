import type { Request, Response } from 'express';

import { projectSlugParamSchema } from '../schemas/project-schema.js';
import {
	getPublicProject,
	listHomeProjects,
	listPublicProjects
} from '../services/public-project-service.js';
import { parseInput } from '../utils/parse-input.js';

/** GET /api/public/projects — the index and the reel. */
export async function getPublicProjects(_req: Request, res: Response) {
	res.json({ data: await listPublicProjects() });
}

/** GET /api/public/projects/home — the home strip. */
export async function getHomeProjects(_req: Request, res: Response) {
	res.json({ data: await listHomeProjects() });
}

/** GET /api/public/projects/:slug — the detail page; 404 unless visible. */
export async function getPublicProjectBySlug(req: Request, res: Response) {
	const { slug } = parseInput(projectSlugParamSchema, req.params);
	res.json({ data: await getPublicProject(slug) });
}
