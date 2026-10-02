import type { Request, Response } from 'express';

import { imageSizeSchema } from '../schemas/media-schema.js';
import { updateProfileSchema } from '../schemas/profile-schema.js';
import {
	getProfile,
	removeProfilePhoto,
	setProfilePhoto,
	updateProfile
} from '../services/profile-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { HttpError } from '../utils/http-error.js';
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

/**
 * POST /api/me/photo — multipart: `file`, plus optional `width`, `height`
 * and `fit` (default 512×512 cover).
 */
export async function uploadMyPhoto(req: Request, res: Response) {
	if (!req.file) throw HttpError.badRequest('Choose an image to upload.');
	const size = parseInput(imageSizeSchema, req.body);

	res.json({
		data: await setProfilePhoto(currentUserOf(res), req.file, size)
	});
}

/** DELETE /api/me/photo — back to the Google avatar. */
export async function removeMyPhoto(_req: Request, res: Response) {
	res.json({ data: await removeProfilePhoto(currentUserOf(res)) });
}
