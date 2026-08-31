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
