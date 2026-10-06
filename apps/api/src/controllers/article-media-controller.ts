import type { Request, Response } from 'express';

import { articleUuidSchema } from '../schemas/article-schema.js';
import { imageSizeSchema } from '../schemas/media-schema.js';
import {
	addArticleBodyImage,
	clearArticleImage,
	setArticleImage
} from '../services/article-media-service.js';
import { currentUserOf } from '../utils/current-user.js';
import { HttpError } from '../utils/http-error.js';
import { parseInput } from '../utils/parse-input.js';

const uuidOf = (req: Request) => parseInput(articleUuidSchema, req.params).uuid;

function fileOf(req: Request) {
	if (!req.file) throw HttpError.badRequest('Choose an image to upload.');

	return req.file;
}

/** POST /api/articles/:uuid/cover — multipart `file` (+ `width`, `height`, `fit`). */
export async function uploadCover(req: Request, res: Response) {
	const file = fileOf(req);
	const size = parseInput(imageSizeSchema, req.body);
	res.json({
		data: await setArticleImage(
			currentUserOf(res),
			uuidOf(req),
			'coverImageId',
			file,
			size
		)
	});
}

/** DELETE /api/articles/:uuid/cover */
export async function removeCover(req: Request, res: Response) {
	res.json({
		data: await clearArticleImage(
			currentUserOf(res),
			uuidOf(req),
			'coverImageId'
		)
	});
}

/** POST /api/articles/:uuid/og-image — multipart `file` (+ `width`, `height`, `fit`). */
export async function uploadOgImage(req: Request, res: Response) {
	const file = fileOf(req);
	const size = parseInput(imageSizeSchema, req.body);
	res.json({
		data: await setArticleImage(
			currentUserOf(res),
			uuidOf(req),
			'ogImageId',
			file,
			size
		)
	});
}

/** DELETE /api/articles/:uuid/og-image */
export async function removeOgImage(req: Request, res: Response) {
	res.json({
		data: await clearArticleImage(
			currentUserOf(res),
			uuidOf(req),
			'ogImageId'
		)
	});
}

/** POST /api/articles/:uuid/images — a body image, for an image block. */
export async function uploadBodyImage(req: Request, res: Response) {
	const file = fileOf(req);
	const size = parseInput(imageSizeSchema, req.body);
	res.status(201).json({
		data: await addArticleBodyImage(
			currentUserOf(res),
			uuidOf(req),
			file,
			size
		)
	});
}
