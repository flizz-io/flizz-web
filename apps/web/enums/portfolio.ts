/**
 * Who the work was built for. Projects are grouped by this on the index rather
 * than by the service that delivered them: a visitor arrives recognising their
 * own business, not the shape of our catalogue. The service is carried on every
 * project too, as the cross-link to what we sell.
 *
 * Values are the display labels, so a sector renders straight from the enum.
 */
export enum ProjectSector {
	OPERATIONS = 'Operations & Logistics',
	RETAIL = 'Retail & Commerce',
	FIELD = 'Field & Frontline',
	FINANCE = 'Financial Services',
	PROFESSIONAL = 'Professional Services'
}

/** Display order on the index — busiest sector first. */
export const projectSectorOrder: ProjectSector[] = [
	ProjectSector.OPERATIONS,
	ProjectSector.RETAIL,
	ProjectSector.FIELD,
	ProjectSector.FINANCE,
	ProjectSector.PROFESSIONAL
];

/**
 * How the highlighted work is presented on the index page. Both are built; this
 * picks which renders, so the two can be compared in place rather than one
 * being rewritten into the other.
 */
export enum PortfolioReelVariant {
	/** A pinned stage advanced by scrolling, with the chapter's specimen behind. */
	SCROLL = 'scroll',
	/** A carousel of project plates, advanced by the visitor. */
	CAROUSEL = 'carousel',
	/**
	 * A letterboxed stage: kinetic title behind a plate in perspective, scene
	 * wipes, a running timecode, and the reel playing on by itself.
	 */
	PREMIERE = 'premiere'
}
