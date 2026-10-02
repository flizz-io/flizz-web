import { z } from 'zod';

import { imageSizeSchema } from './media-schema.js';

const CAPTION_MAX = 160;

/** Blank clears it. */
const caption = z
	.string()
	.trim()
	.max(CAPTION_MAX)
	.transform((value) => value || null)
	.nullable();

export const projectUuidParamSchema = z.object({ uuid: z.uuid() });

export const galleryImageParamsSchema = z.object({
	uuid: z.uuid(),
	imageUuid: z.uuid()
});

/** Multipart fields with a gallery upload: optional caption + output size. */
export const galleryUploadSchema = imageSizeSchema.extend({
	caption: caption.optional()
});

export const updateGalleryImageSchema = z.object({ caption });

/** Every live gallery image, once each, in the new order. */
export const reorderGallerySchema = z.object({
	imageUuids: z.array(z.uuid()).max(100)
});
