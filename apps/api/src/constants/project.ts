/** Field limits for projects — docs/requirements/projects-crud.md#fields. */
export const projectLimits = {
	name: 80,
	client: 140,
	summary: 200,
	resultField: 80,
	resultsMin: 1,
	resultsMax: 6,
	duration: 80,
	team: 80,
	storyItem: 1000,
	storyItemsMin: 1,
	storyItemsMax: 10,
	stackChip: 40,
	stackMax: 20,
	quoteText: 500,
	quoteAttribution: 120,
	firstYear: 2000,
	displayOrderMax: 10_000
} as const;

/**
 * Slugs a project can't take — they'd collide with fixed public routes
 * (`GET /api/public/projects/home`).
 */
export const reservedProjectSlugs: readonly string[] = ['home'];
