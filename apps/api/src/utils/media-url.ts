import { storage } from '../configs/media.js';

interface StoredFile {
	storageKey: string;
	deletedAt: Date | null;
}

/** The public URL for a stored file, or `null` if there isn't a live one. */
export function mediaUrl(file: StoredFile | null | undefined) {
	return file && !file.deletedAt ? storage.publicUrl(file.storageKey) : null;
}

/** A user's picture: their uploaded photo, else their Google avatar. */
export function avatarUrlOf(user: {
	photo: StoredFile | null;
	googleAvatarUrl: string | null;
}) {
	return mediaUrl(user.photo) ?? user.googleAvatarUrl;
}
