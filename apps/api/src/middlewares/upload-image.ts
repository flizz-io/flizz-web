import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import { HttpError } from '../utils/http-error.js';

/** Upload size cap — 500 KB (decided 2026-10-02). */
const MAX_UPLOAD_KB = 500;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_KB * 1024;
const UPLOAD_FIELD = 'file';

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 }
}).single(UPLOAD_FIELD);

/**
 * Reads one `multipart/form-data` file field named `file` into memory. Only
 * size and count are checked here; whether it's really an image is decided by
 * decoding it (`processImage`), not by its name or claimed type.
 */
export function uploadImage(req: Request, res: Response, next: NextFunction) {
	upload(req, res, (error: unknown) => {
		if (error instanceof multer.MulterError) {
			next(
				HttpError.badRequest(
					error.code === 'LIMIT_FILE_SIZE'
						? `Images can be up to ${MAX_UPLOAD_KB} KB.`
						: 'Send exactly one file in the "file" field.'
				)
			);
			return;
		}
		if (error) {
			next(error);
			return;
		}
		if (!req.file) {
			next(HttpError.badRequest('Choose an image to upload.'));
			return;
		}

		next();
	});
}
