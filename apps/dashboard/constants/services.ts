import { PublishStatus, ServiceCategory } from '@workspace/api-services';

export const servicesPath = '/services';
export const newServicePath = `${servicesPath}/new`;
export const servicePath = (uuid: string) => `${servicesPath}/${uuid}`;

/** Same wording as the website's list page. */
export const serviceCategoryLabels: Record<ServiceCategory, string> = {
	[ServiceCategory.CUSTOM_SOFTWARE]: 'Custom Software',
	[ServiceCategory.AI_AUTOMATION]: 'AI & Automation',
	[ServiceCategory.ECOMMERCE]: 'E-commerce',
	[ServiceCategory.MOBILE]: 'Mobile'
};

/** A service has no schedule, so Published is simply Live. */
export const serviceStatusLabels: Record<PublishStatus, string> = {
	[PublishStatus.DRAFT]: 'Draft',
	[PublishStatus.PUBLISHED]: 'Live'
};

export const servicesMessages = {
	title: 'Services',
	lead: 'The catalogue on the website, grouped by category. A service shows there once it’s Published; the order here is the order on /services.',
	newService: 'New service',
	searchPlaceholder: 'Search title or slug',
	anyStatus: 'All statuses',
	noServices: 'No services yet.',
	noResults: 'No services match these filters.',
	emptyCategory: 'No services in this category.',
	reorderPaused: 'Clear the search and filter to reorder.',
	reordered: (category: string) => `${category} order saved.`,
	moveUp: (title: string) => `Move ${title} up`,
	moveDown: (title: string) => `Move ${title} down`,
	projects: (count: number) =>
		count === 1 ? '1 project' : `${count} projects`,
	updatedBy: (name: string, when: string) => `${name} · ${when}`,
	columns: {
		order: '#',
		service: 'Service',
		status: 'Status',
		projects: 'Projects',
		updated: 'Last updated',
		move: 'Order'
	}
} as const;
