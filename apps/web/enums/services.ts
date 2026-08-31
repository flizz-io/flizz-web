/**
 * The four areas every service belongs to. Values are the display labels, so a
 * category renders straight from the enum without a lookup table.
 */
export enum ServiceCategory {
	CUSTOM_SOFTWARE = 'Custom Software',
	AI_AUTOMATION = 'AI & Automation',
	ECOMMERCE = 'E-commerce',
	MOBILE = 'Mobile'
}

/** Display order on the list page — broadest capability first. */
export const serviceCategoryOrder: ServiceCategory[] = [
	ServiceCategory.CUSTOM_SOFTWARE,
	ServiceCategory.AI_AUTOMATION,
	ServiceCategory.ECOMMERCE,
	ServiceCategory.MOBILE
];

/**
 * Anchor targets for each category group on the list page, so a detail page can
 * link back to where its own category sits rather than the top of the list.
 * Written out rather than slugified so the ids cannot drift if a label changes.
 */
export const serviceCategoryAnchors: Record<ServiceCategory, string> = {
	[ServiceCategory.CUSTOM_SOFTWARE]: 'custom-software',
	[ServiceCategory.AI_AUTOMATION]: 'ai-automation',
	[ServiceCategory.ECOMMERCE]: 'e-commerce',
	[ServiceCategory.MOBILE]: 'mobile'
};

/**
 * Which way back to the catalogue a service detail hero offers. Both routes are
 * built; this picks what actually renders, so the choice can be compared in
 * place rather than rewritten.
 */
export enum ServiceBackNav {
	/** "All services" above the title — an explicit step up. */
	LINK = 'link',
	/** The category eyebrow becomes a link to its group on the list page. */
	CATEGORY = 'category',
	BOTH = 'both',
	NONE = 'none'
}
