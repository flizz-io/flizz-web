/** The API's upload cap (apps/api upload-image middleware) — checked here first. */
export const maxUploadKb = 500;

/** Output size an upload gets unless the uploader is told otherwise. */
export const defaultImageSize = {
	width: 512,
	height: 512,
	fit: 'cover'
} as const;

/** What the file picker offers — the API decodes the bytes to be sure. */
export const acceptedImageTypes =
	'image/jpeg,image/png,image/webp,image/avif,image/gif';

export const uploaderMessages = {
	choose: 'Upload photo',
	replace: 'Replace photo',
	remove: 'Remove photo',
	uploading: 'Uploading…',
	tooLarge: (kb: number) =>
		`That image is ${kb} KB — the limit is ${maxUploadKb} KB. Try a smaller or more compressed one.`,
	hint: (width: number, height: number) =>
		`JPEG, PNG, WebP, AVIF or GIF, up to ${maxUploadKb} KB. Saved as ${width}×${height}.`
} as const;
