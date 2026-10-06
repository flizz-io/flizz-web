import { ImageFit } from '@workspace/api-services';

/**
 * The API's upload caps per kind of image (apps/api `uploadLimitsKb`) —
 * checked here first.
 */
export const uploadLimitsKb = {
	profilePhoto: 500,
	projectImage: 2048,
	shareImage: 2048,
	/** Article covers and body images. */
	articleImage: 2048
} as const;

/** Output size an upload gets unless the uploader is told otherwise. */
export const defaultImageSize = {
	width: 512,
	height: 512,
	fit: ImageFit.COVER
} as const;

/** What the file picker offers — the API decodes the bytes to be sure. */
export const acceptedImageTypes =
	'image/jpeg,image/png,image/webp,image/avif,image/gif';

const KB_PER_MB = 1024;

/** "500 KB", "2 MB". */
export function formatKb(kb: number) {
	return kb >= KB_PER_MB && kb % KB_PER_MB === 0
		? `${kb / KB_PER_MB} MB`
		: `${kb} KB`;
}

/** The buttons' wording — overridable per uploader. */
export interface UploaderLabels {
	choose: string;
	replace: string;
	remove: string;
}

export const photoUploaderLabels: UploaderLabels = {
	choose: 'Upload photo',
	replace: 'Replace photo',
	remove: 'Remove photo'
};

export const uploaderMessages = {
	uploading: 'Uploading…',
	tooLarge: (kb: number, maxKb: number) =>
		`That image is ${formatKb(kb)} — the limit is ${formatKb(maxKb)}. Try a smaller or more compressed one.`,
	hint: (width: number, height: number, maxKb: number) =>
		`JPEG, PNG, WebP, AVIF or GIF, up to ${formatKb(maxKb)}. Saved within ${width}×${height}.`
} as const;
