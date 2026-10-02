import { z } from 'zod';

import { imageSizeLimits } from '@workspace/media-library';

/** Multipart fields arrive as strings; blank means "use the default". */
const sizeField = z
	.string()
	.trim()
	.optional()
	.transform((value) => (value ? Number(value) : undefined))
	.pipe(
		z
			.number()
			.int('Use a whole number of pixels.')
			.min(imageSizeLimits.min)
			.max(imageSizeLimits.max)
			.optional()
	);

/**
 * Optional output size sent with an image upload — the dashboard uploader's
 * `width` / `height` / `fit` props. Anything left out falls back to the
 * upload's preset (512×512 cover for profile photos).
 */
export const imageSizeSchema = z.object({
	width: sizeField,
	height: sizeField,
	fit: z.enum(['cover', 'inside']).optional()
});
