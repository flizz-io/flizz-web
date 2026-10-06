/** Field limits for testimonials — docs/requirements/testimonials-crud.md#fields. */
export const testimonialLimits = {
	quote: 320,
	highlight: 60,
	highlightsMax: 3,
	authorName: 80,
	authorRole: 120
} as const;
