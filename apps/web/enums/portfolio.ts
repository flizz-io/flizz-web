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
