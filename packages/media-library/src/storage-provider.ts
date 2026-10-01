/**
 * Where files live. Calling code depends only on this, so local disk can be
 * swapped for S3 or a CDN without touching a feature. Keys are opaque,
 * provider-relative paths (`2026/10/<uuid>.webp`); the database stores keys,
 * never URLs, so moving storage only changes how URLs are built.
 */
export interface StorageProvider {
	/** Stable name stored with each file, e.g. `local`. */
	readonly name: string;
	/** Store bytes under a key. Overwrites nothing — keys are unique. */
	put(key: string, data: Buffer, contentType: string): Promise<void>;
	/** The public URL a browser loads the file from. */
	publicUrl(key: string): string;
}
