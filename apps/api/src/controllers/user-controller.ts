import type { Request, Response } from 'express';

import {
	createUserSchema,
	listUsersQuerySchema,
	replacePermissionsSchema,
	updateUserSchema,
	userUuidParamSchema
} from '../schemas/user-schema.js';
import {
	addTeamUser,
	getTeamUser,
	listTeamUsers,
	reactivateTeamUser,
	removeTeamUser,
	replaceTeamUserPermissions,
	suspendTeamUser,
	updateTeamUser
} from '../services/team-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { parseInput } from '../utils/parse-input.js';

const uuidOf = (req: Request) =>
	parseInput(userUuidParamSchema, req.params).uuid;

/** GET /api/users */
export async function listUsers(req: Request, res: Response) {
	const filters = parseInput(listUsersQuerySchema, req.query);
	res.json({ data: await listTeamUsers(filters) });
}

/** GET /api/users/:uuid */
export async function getUser(req: Request, res: Response) {
	res.json({ data: await getTeamUser(uuidOf(req)) });
}

/** POST /api/users */
export async function createUser(req: Request, res: Response) {
	const input = parseInput(createUserSchema, req.body);
	res.status(201).json({
		data: await addTeamUser(currentUserOf(res), input)
	});
}

/** PATCH /api/users/:uuid */
export async function updateUser(req: Request, res: Response) {
	const input = parseInput(updateUserSchema, req.body);
	res.json({
		data: await updateTeamUser(currentUserOf(res), uuidOf(req), input)
	});
}

/** POST /api/users/:uuid/suspend */
export async function suspendUser(req: Request, res: Response) {
	res.json({ data: await suspendTeamUser(currentUserOf(res), uuidOf(req)) });
}

/** POST /api/users/:uuid/reactivate */
export async function reactivateUser(req: Request, res: Response) {
	res.json({
		data: await reactivateTeamUser(currentUserOf(res), uuidOf(req))
	});
}

/** DELETE /api/users/:uuid — soft, and only while Invited. */
export async function removeUser(req: Request, res: Response) {
	await removeTeamUser(currentUserOf(res), uuidOf(req));
	res.status(204).end();
}

/** PUT /api/users/:uuid/permissions */
export async function replacePermissions(req: Request, res: Response) {
	const { permissions } = parseInput(replacePermissionsSchema, req.body);
	res.json({
		data: await replaceTeamUserPermissions(
			currentUserOf(res),
			uuidOf(req),
			permissions
		)
	});
}
