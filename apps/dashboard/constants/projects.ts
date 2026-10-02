import {
	ProjectSector,
	ProjectVisibility,
	ServiceCategory
} from '@workspace/api-services';

export const projectsPath = '/projects';
export const newProjectPath = `${projectsPath}/new`;
export const projectPath = (uuid: string) => `${projectsPath}/${uuid}`;

/** Same wording as the website's index. */
export const sectorLabels: Record<ProjectSector, string> = {
	[ProjectSector.OPERATIONS]: 'Operations & Logistics',
	[ProjectSector.RETAIL]: 'Retail & Commerce',
	[ProjectSector.FIELD]: 'Field & Frontline',
	[ProjectSector.FINANCE]: 'Financial Services',
	[ProjectSector.PROFESSIONAL]: 'Professional Services'
};

export const serviceCategoryLabels: Record<ServiceCategory, string> = {
	[ServiceCategory.CUSTOM_SOFTWARE]: 'Custom Software',
	[ServiceCategory.AI_AUTOMATION]: 'AI & Automation',
	[ServiceCategory.ECOMMERCE]: 'E-commerce',
	[ServiceCategory.MOBILE]: 'Mobile'
};

export const visibilityLabels: Record<ProjectVisibility, string> = {
	[ProjectVisibility.DRAFT]: 'Draft',
	[ProjectVisibility.SCHEDULED]: 'Scheduled',
	[ProjectVisibility.LIVE]: 'Live'
};

export const projectsMessages = {
	title: 'Projects',
	lead: 'The portfolio on the website. A project shows there once it’s Published and its publish date (if any) has passed.',
	newProject: 'New project',
	searchPlaceholder: 'Search name or slug',
	anySector: 'All sectors',
	anyStatus: 'All statuses',
	noProjects: 'No projects yet.',
	noResults: 'No projects match these filters.',
	noCover: 'No cover',
	scheduledFor: (when: string) => `Goes live ${when}`,
	featured: 'Featured',
	onHome: 'On home',
	feature: (name: string) => `Feature ${name} in the portfolio reel`,
	unfeature: (name: string) => `Take ${name} out of the portfolio reel`,
	featuredOn: (name: string) => `${name} is now featured.`,
	featuredOff: (name: string) => `${name} is no longer featured.`,
	updatedBy: (name: string, when: string) => `${name} · ${when}`,
	columns: {
		project: 'Project',
		sector: 'Sector',
		year: 'Year',
		status: 'Status',
		placement: 'Placement',
		updated: 'Last updated'
	}
} as const;
