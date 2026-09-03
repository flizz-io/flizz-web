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
 * Anchor targets for each sector group, so the masthead rail and a project's
 * own detail page can land on its group rather than the top of the index.
 * Written out rather than slugified so the ids cannot drift if a label changes.
 */
export const projectSectorAnchors: Record<ProjectSector, string> = {
	[ProjectSector.OPERATIONS]: 'operations-logistics',
	[ProjectSector.RETAIL]: 'retail-commerce',
	[ProjectSector.FIELD]: 'field-frontline',
	[ProjectSector.FINANCE]: 'financial-services',
	[ProjectSector.PROFESSIONAL]: 'professional-services'
};
