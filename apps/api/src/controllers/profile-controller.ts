import type { Request, Response } from 'express';

import { updateProfileSchema } from '../schemas/profile-schema.js';
import { getProfile, updateProfile } from '../services/profile-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { parseInput } from '../utils/parse-input.js';

/** GET /api/me/profile */
export async function getMyProfile(_req: Request, res: Response) {
	res.json({ data: await getProfile(currentUserOf(res)) });
}

/** PATCH /api/me/profile */
export async function updateMyProfile(req: Request, res: Response) {
	const input = parseInput(updateProfileSchema, req.body);
	res.json({ data: await updateProfile(currentUserOf(res), input) });
}
