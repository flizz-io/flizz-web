import {
	ProjectSector,
	ProjectStatus,
	ProjectVisibility
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

export const visibilityLabels: Record<ProjectVisibility, string> = {
	[ProjectVisibility.DRAFT]: 'Draft',
	[ProjectVisibility.SCHEDULED]: 'Scheduled',
	[ProjectVisibility.LIVE]: 'Live'
};

export const statusLabels: Record<ProjectStatus, string> = {
	[ProjectStatus.DRAFT]: 'Draft',
	[ProjectStatus.PUBLISHED]: 'Published'
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

/** Field limits — the API's (apps/api `projectLimits`); inputs stop here. */
export const projectFieldLimits = {
	name: 80,
	slug: 100,
	client: 140,
	summary: 200,
	resultField: 80,
	resultsMax: 6,
	duration: 80,
	team: 80,
	storyItem: 1000,
	storyItemsMax: 10,
	stackChip: 40,
	stackMax: 20,
	quoteText: 500,
	quoteAttribution: 120,
	caption: 160,
	galleryMax: 12,
	firstYear: 2000
} as const;

/** Output sizes for project images — docs/requirements/projects-crud.md#images. */
export const projectImageSizes = {
	cover: { width: 1600, height: 1000 },
	gallery: { width: 1600, height: 1200 }
} as const;

export const projectFormMessages = {
	newTitle: 'New project',
	newLead:
		'It starts as a Draft. Add the cover and gallery once it’s saved, then publish when it’s ready.',
	editLead: (slug: string) => `/portfolio/${slug}`,
	backToList: 'All projects',
	readOnly: 'You can view this project but not change it.',
	create: 'Create draft',
	save: 'Save changes',
	saving: 'Saving…',
	created: (name: string) => `${name} created as a draft.`,
	saved: (name: string) => `${name} saved.`,
	fixErrors: 'Some fields need attention — see the messages below.',
	sections: {
		basics: 'Basics',
		basicsLead: 'What the project is and where it sits on the site.',
		results: 'Results',
		resultsLead:
			'Measured changes, as before → after. The first is the headline on the index and the home card.',
		story: 'Case study',
		storyLead:
			'Each section is a list of paragraphs, shown in this order on the detail page.',
		stack: 'Stack',
		stackLead: 'Tools and languages, shown as chips.',
		quote: 'Quote',
		quoteLead: 'Optional. Fill in both parts, or leave both empty.',
		images: 'Images',
		imagesLead:
			'The cover is used everywhere the project appears; the gallery shows on its detail page.',
		imagesAfterCreate:
			'Save the project first — images are added to a saved project.',
		publishing: 'Publishing',
		publishingLead:
			'Public when Published and the publish date (if any) has passed.'
	},
	fields: {
		name: 'Name',
		slug: 'Slug',
		slugHint: 'The detail URL. Left empty, it’s made from the name.',
		slugPlaceholder: 'e.g. northwind-ops-platform',
		slugLiveWarning:
			'Changing the slug of a published project breaks links to the old URL — there are no redirects.',
		client: 'Client',
		clientHint:
			'An anonymised descriptor — “A 40-person operations team…”.',
		sector: 'Sector',
		serviceCategory: 'Service category',
		serviceCategoryHint: 'Narrows the services to choose from.',
		service: 'Service',
		serviceHint:
			'The service this project is evidence for — its page links here, and the project takes its category.',
		servicePlaceholder: 'Choose a service',
		serviceDraft: (title: string) => `${title} (draft)`,
		noServicesInCategory: 'No services in this category yet.',
		year: 'Year',
		summary: 'Summary',
		summaryHint: 'One line — the index row and the home card.',
		duration: 'Duration',
		durationPlaceholder: 'e.g. 14 weeks',
		team: 'Team',
		teamPlaceholder: 'e.g. Two engineers, one designer',
		resultLabel: 'Measure',
		resultFrom: 'Before',
		resultTo: 'After',
		addResult: 'Add result',
		brief: 'Brief',
		constraints: 'Constraints',
		approach: 'Approach',
		built: 'What we built',
		addParagraph: 'Add paragraph',
		stackInput: 'Add a tool',
		stackPlaceholder: 'Type and press Enter',
		addChip: 'Add',
		removeChip: (chip: string) => `Remove ${chip}`,
		quoteText: 'Quote',
		quoteAttribution: 'Attribution',
		quoteAttributionPlaceholder: 'Name, role',
		cover: 'Cover',
		coverHint: 'Without one, the site shows registration marks.',
		gallery: 'Gallery',
		galleryHint: (max: number) =>
			`Up to ${max} images, shown in this order with optional captions.`,
		galleryEmpty: 'No gallery images yet.',
		galleryFull: (max: number) => `The gallery is full (${max} images).`,
		caption: 'Caption',
		captionPlaceholder: 'Optional caption',
		status: 'Status',
		publishAt: 'Publish date',
		publishAtHint:
			'Optional, in your time zone. In the future, the project stays hidden until then.',
		clearDate: 'Clear',
		featured: 'Featured',
		featuredHint: 'Plays in the reel at the top of /portfolio.',
		featuredOrder: 'Reel order',
		showOnHome: 'Show on home',
		showOnHomeHint: 'Appears in the home page strip.',
		homeOrder: 'Home order',
		orderHint: 'Lower numbers come first.'
	},
	images: {
		coverSaved: 'Cover updated.',
		coverRemoved: 'Cover removed.',
		galleryAdded: 'Image added to the gallery.',
		galleryRemoved: 'Image removed from the gallery.',
		captionSaved: 'Caption saved.',
		reordered: 'Gallery order saved.',
		coverLabels: {
			choose: 'Upload cover',
			replace: 'Replace cover',
			remove: 'Remove cover'
		},
		galleryLabels: {
			choose: 'Add image',
			replace: 'Add image',
			remove: 'Remove'
		}
	},
	delete: {
		button: 'Delete project',
		title: (name: string) => `Delete ${name}?`,
		body: 'It leaves the dashboard and the website. Its slug stays reserved, so no other project can take its URL.',
		confirm: 'Delete',
		deleted: (name: string) => `${name} was deleted.`
	}
} as const;
