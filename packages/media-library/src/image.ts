import sharp from 'sharp';

/** `cover` crops to fill the box; `inside` keeps the whole image within it. */
export type ImageFit = 'cover' | 'inside';

/** What an image is processed into. Add a preset per use, not per call. */
export interface ImagePreset {
	width: number;
	height: number;
	fit: ImageFit;
	quality: number;
}

export const imagePresets = {
	/** Profile photos — square by default, as avatars and the About page show them. */
	avatar: { width: 512, height: 512, fit: 'cover', quality: 82 }
} as const satisfies Record<string, ImagePreset>;

/**
 * The output sizes a caller may ask for. Bounded so a request can't make the
 * server produce (or a storage plan pay for) an enormous image.
 */
export const imageSizeLimits = { min: 64, max: 2048 } as const;

/** Per-upload overrides — e.g. an uploader's `width` / `height` / `fit` props. */
export interface ImageSizeOverrides {
	width?: number;
	height?: number;
	fit?: ImageFit;
}

/** A preset with the caller's overrides applied (each one optional). */
export function withImageSize(
	preset: ImagePreset,
	overrides: ImageSizeOverrides = {}
): ImagePreset {
	return {
		...preset,
		width: overrides.width ?? preset.width,
		height: overrides.height ?? preset.height,
		fit: overrides.fit ?? preset.fit
	};
}

/** Formats accepted as input. Everything is re-encoded to WebP. */
const ACCEPTED_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif', 'gif']);
/** Refuse images that decode to more than this — guards against pixel floods. */
const MAX_INPUT_PIXELS = 40_000_000;

export class InvalidImageError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidImageError';
	}
}

export interface ProcessedImage {
	data: Buffer;
	contentType: 'image/webp';
	extension: 'webp';
	width: number;
	height: number;
	sizeBytes: number;
}

/**
 * Validates an upload by decoding it — the bytes, not the file name or the
 * browser's claimed type, decide what it is — then resizes it to the preset
 * and re-encodes it as WebP. Re-encoding also strips metadata (EXIF location
 * included) and anything smuggled inside a "picture".
 */
export async function processImage(
	input: Buffer,
	preset: ImagePreset
): Promise<ProcessedImage> {
	const image = sharp(input, {
		limitInputPixels: MAX_INPUT_PIXELS,
		animated: false
	});

	const metadata = await image.metadata().catch(() => null);
	if (!metadata?.format || !ACCEPTED_FORMATS.has(metadata.format)) {
		throw new InvalidImageError(
			'That file is not a supported image (JPEG, PNG, WebP, AVIF or GIF).'
		);
	}

	const { data, info } = await image
		.rotate()
		.resize(preset.width, preset.height, {
			fit: preset.fit,
			withoutEnlargement: preset.fit === 'inside'
		})
		.webp({ quality: preset.quality })
		.toBuffer({ resolveWithObject: true });

	return {
		data,
		contentType: 'image/webp',
		extension: 'webp',
		width: info.width,
		height: info.height,
		sizeBytes: info.size
	};
}
