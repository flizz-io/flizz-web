import type { NextFunction, Request, RequestHandler, Response } from 'express';
import multer from 'multer';

import { HttpError } from '../utils/http-error.js';

const UPLOAD_FIELD = 'file';
const KB = 1024;

/** "500 KB" / "2 MB" — how the limit reads in an error message. */
function formatLimit(maxKb: number) {
	return maxKb >= KB && maxKb % KB === 0 ? `${maxKb / KB} MB` : `${maxKb} KB`;
}

/**
 * Reads one `multipart/form-data` file field named `file` into memory, up to
 * `maxKb` (see `uploadLimitsKb`). Only size and count are checked here;
 * whether it's really an image is decided by decoding it (`processImage`),
 * not by its name or claimed type.
 */
export function uploadImage(maxKb: number): RequestHandler {
	const upload = multer({
		storage: multer.memoryStorage(),
		limits: { fileSize: maxKb * KB, files: 1 }
	}).single(UPLOAD_FIELD);

	return (req: Request, res: Response, next: NextFunction) => {
		upload(req, res, (error: unknown) => {
			if (error instanceof multer.MulterError) {
				next(
					HttpError.badRequest(
						error.code === 'LIMIT_FILE_SIZE'
							? `Images can be up to ${formatLimit(maxKb)}.`
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
	};
}
