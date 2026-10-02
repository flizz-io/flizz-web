/** Mirrors the API's `ProjectSector` — keys, not display labels. */
export enum ProjectSector {
	OPERATIONS = 'OPERATIONS',
	RETAIL = 'RETAIL',
	FIELD = 'FIELD',
	FINANCE = 'FINANCE',
	PROFESSIONAL = 'PROFESSIONAL'
}

/** Mirrors the API's `ServiceCategory`. */
export enum ServiceCategory {
	CUSTOM_SOFTWARE = 'CUSTOM_SOFTWARE',
	AI_AUTOMATION = 'AI_AUTOMATION',
	ECOMMERCE = 'ECOMMERCE',
	MOBILE = 'MOBILE'
}

/** Mirrors the API's `ProjectStatus`. */
export enum ProjectStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED'
}

/**
 * Whether a project shows on the website, derived by the API: Draft,
 * Scheduled (Published, publish date ahead) or Live.
 */
export enum ProjectVisibility {
	DRAFT = 'DRAFT',
	SCHEDULED = 'SCHEDULED',
	LIVE = 'LIVE'
}

/** How an uploaded image is fitted to its output size. */
export enum ImageFit {
	COVER = 'cover',
	INSIDE = 'inside'
}
