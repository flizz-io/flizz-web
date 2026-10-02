/** Where uploaded files are stored — `MEDIA_PROVIDER` in the API's env. */
export enum MediaProvider {
	/** Cloudinary (free tier) — the default; served from its CDN. */
	CLOUDINARY = 'cloudinary',
	/** The API server's own disk, served at /api/media — offline development. */
	LOCAL = 'local'
}
