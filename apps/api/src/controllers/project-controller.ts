import type { Request, Response } from 'express';

import {
	createProjectSchema,
	listProjectsQuerySchema,
	projectUuidSchema,
	updateProjectSchema
} from '../schemas/project-schema.js';
import {
	addProject,
	editProject,
	getDashboardProject,
	listDashboardProjects,
	removeProject
} from '../services/project-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { parseInput } from '../utils/parse-input.js';

const uuidOf = (req: Request) => parseInput(projectUuidSchema, req.params).uuid;

/** GET /api/projects — `?search=&sector=&visibility=` */
export async function listProjects(req: Request, res: Response) {
	const filters = parseInput(listProjectsQuerySchema, req.query);
	res.json({ data: await listDashboardProjects(filters) });
}

/** GET /api/projects/:uuid */
export async function getProject(req: Request, res: Response) {
	res.json({ data: await getDashboardProject(uuidOf(req)) });
}

/** POST /api/projects — always a Draft. */
export async function createProject(req: Request, res: Response) {
	const input = parseInput(createProjectSchema, req.body);
	res.status(201).json({
		data: await addProject(currentUserOf(res), input)
	});
}

/** PATCH /api/projects/:uuid */
export async function updateProject(req: Request, res: Response) {
	const input = parseInput(updateProjectSchema, req.body);
	res.json({
		data: await editProject(currentUserOf(res), uuidOf(req), input)
	});
}

/** DELETE /api/projects/:uuid — soft. */
export async function deleteProject(req: Request, res: Response) {
	await removeProject(currentUserOf(res), uuidOf(req));
	res.status(204).end();
}
