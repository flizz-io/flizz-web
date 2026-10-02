/** Upload caps per kind of image (decided 2026-10-02). */
export const uploadLimitsKb = {
	/** Profile photos. */
	profilePhoto: 500,
	/** Project covers and gallery images — full-page screenshots run large. */
	projectImage: 2048
} as const;

/** Most gallery images one project may carry. */
export const maxGalleryImages = 12;
