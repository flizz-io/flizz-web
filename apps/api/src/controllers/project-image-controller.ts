import type { Request, Response } from 'express';

import { imageSizeSchema } from '../schemas/media-schema.js';
import {
	galleryImageParamsSchema,
	galleryUploadSchema,
	projectUuidParamSchema,
	reorderGallerySchema,
	updateGalleryImageSchema
} from '../schemas/project-image-schema.js';
import {
	addGalleryImage,
	clearProjectCover,
	reorderGallery,
	retireGalleryImage,
	setProjectCover,
	updateGalleryCaption
} from '../services/project-image-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { HttpError } from '../utils/http-error.js';
import { parseInput } from '../utils/parse-input.js';

const projectUuidOf = (req: Request) =>
	parseInput(projectUuidParamSchema, req.params).uuid;

function uploadedFile(req: Request) {
	if (!req.file) throw HttpError.badRequest('Choose an image to upload.');

	return req.file;
}

/** POST /api/projects/:uuid/cover — multipart `file` (+ `width`, `height`, `fit`). */
export async function uploadCover(req: Request, res: Response) {
	const file = uploadedFile(req);
	const size = parseInput(imageSizeSchema, req.body);

	res.json({
		data: await setProjectCover(
			currentUserOf(res),
			projectUuidOf(req),
			file,
			size
		)
	});
}

/** DELETE /api/projects/:uuid/cover */
export async function removeCover(req: Request, res: Response) {
	res.json({
		data: await clearProjectCover(currentUserOf(res), projectUuidOf(req))
	});
}

/** POST /api/projects/:uuid/gallery — multipart `file` (+ `caption`, size). */
export async function uploadGalleryImage(req: Request, res: Response) {
	const file = uploadedFile(req);
	const input = parseInput(galleryUploadSchema, req.body);

	res.status(201).json({
		data: await addGalleryImage(
			currentUserOf(res),
			projectUuidOf(req),
			file,
			input
		)
	});
}

/** PATCH /api/projects/:uuid/gallery/:imageUuid — `{ caption }` */
export async function updateGalleryImage(req: Request, res: Response) {
	const { uuid, imageUuid } = parseInput(
		galleryImageParamsSchema,
		req.params
	);
	const { caption } = parseInput(updateGalleryImageSchema, req.body);

	res.json({
		data: await updateGalleryCaption(
			currentUserOf(res),
			uuid,
			imageUuid,
			caption
		)
	});
}

/** DELETE /api/projects/:uuid/gallery/:imageUuid — retires it. */
export async function removeGalleryImage(req: Request, res: Response) {
	const { uuid, imageUuid } = parseInput(
		galleryImageParamsSchema,
		req.params
	);

	res.json({
		data: await retireGalleryImage(currentUserOf(res), uuid, imageUuid)
	});
}

/** PUT /api/projects/:uuid/gallery/order — `{ imageUuids: [...] }` */
export async function reorderGalleryImages(req: Request, res: Response) {
	const { imageUuids } = parseInput(reorderGallerySchema, req.body);

	res.json({
		data: await reorderGallery(
			currentUserOf(res),
			projectUuidOf(req),
			imageUuids
		)
	});
}
