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

/** The status select's options. */
export const publishStatusLabels: Record<PublishStatus, string> = {
	[PublishStatus.DRAFT]: 'Draft',
	[PublishStatus.PUBLISHED]: 'Published'
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

/** Field limits — the API's (apps/api `serviceLimits`); inputs stop here. */
export const serviceFieldLimits = {
	title: 80,
	slug: 100,
	summary: 200,
	intro: 600,
	problem: 1500,
	listItem: 200,
	deliverablesMax: 8,
	outcomesMax: 6,
	engagement: 120,
	faqQuestion: 200,
	faqAnswer: 1000,
	faqsMax: 10,
	seoTitle: 70,
	seoDescription: 200
} as const;

/** Where search engines start cutting — the counters warn past these. */
export const searchSnippetTargets = {
	titleMax: 60,
	descriptionMin: 140,
	descriptionMax: 160
} as const;

/** The share image — docs/requirements/services-crud.md#fields. */
export const shareImageSize = { width: 1200, height: 630 } as const;

/** The public page a service lives at, for the search preview. */
export const serviceSiteUrl = (slug: string) =>
	`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/services/${slug}`;

export const serviceFormMessages = {
	newTitle: 'New service',
	newLead:
		'It starts as a Draft, last in its category. Add a share image once it’s saved, then publish when it’s ready.',
	editLead: (slug: string) => `/services/${slug}`,
	backToList: 'All services',
	readOnly: 'You can view this service but not change it.',
	create: 'Create draft',
	save: 'Save changes',
	saving: 'Saving…',
	created: (title: string) => `${title} created as a draft.`,
	saved: (title: string) => `${title} saved.`,
	fixErrors: 'Some fields need attention — see the messages below.',
	sections: {
		basics: 'Basics',
		basicsLead: 'What the service is and where it sits on the list page.',
		visual: 'Visual',
		visualLead:
			'The scene that stands for this service on the list page, the home teaser and its detail page.',
		copy: 'Page copy',
		copyLead: 'The detail page, top to bottom.',
		faqs: 'FAQs',
		faqsLead:
			'Optional. Shown on the detail page with every answer visible, and given to search engines and AI assistants as structured data.',
		seo: 'Search & social',
		seoLead:
			'Optional. How the page appears in search results and when shared. Empty fields fall back to the title and summary.',
		publishing: 'Publishing',
		publishingLead: 'Public when Published.',
		projects: 'Projects',
		projectsLead:
			'Portfolio projects linked to this service. A service with projects can’t be deleted.',
		noProjects: 'No projects link to this service yet.'
	},
	fields: {
		title: 'Title',
		titleHint: 'Keep capitals as written — MVP, AI, SaaS.',
		slug: 'Slug',
		slugHint:
			'The detail URL. Left empty, it’s made from the title. Changing it later keeps the old URL working — it redirects here.',
		slugPlaceholder: 'e.g. mvp-development',
		category: 'Category',
		categoryHint:
			'Moving a service to another category puts it last there.',
		summary: 'Summary',
		summaryHint: 'One line — the list page and the home teaser.',
		visualKind: 'Scene',
		visualPreview: 'Preview',
		intro: 'Intro',
		introHint: 'Two or three sentences under the detail page’s title.',
		problem: 'The problem',
		problemHint: 'What this service is for, in the client’s terms.',
		deliverables: 'What’s included',
		deliverablesHint: 'Concrete deliverables — three to six read best.',
		outcomes: 'What you get',
		outcomesHint:
			'Business outcomes, not technical ones — three read best.',
		addItem: 'Add item',
		engagement: 'Typical engagement',
		engagementHint:
			'Optional — duration and cadence. Leave empty rather than guess; the section is then left out.',
		engagementPlaceholder: 'e.g. 6–10 weeks, weekly demos',
		faqQuestion: 'Question',
		faqAnswer: 'Answer',
		addFaq: 'Add question',
		noFaqs: 'No questions yet.',
		seoTitle: 'SEO title',
		seoTitleHint: (target: number) =>
			`Up to about ${target} characters show in search results.`,
		seoDescription: 'SEO description',
		seoDescriptionHint: (min: number, max: number) =>
			`${min}–${max} characters read best.`,
		searchPreview: 'Search result preview',
		shareImage: 'Share image',
		shareImageHint:
			'Shown when the page is shared on LinkedIn, X, Slack… Without one, a card is generated from the title.',
		shareImageAfterCreate:
			'Save the service first — the share image is added to a saved service.',
		status: 'Status'
	},
	images: {
		saved: 'Share image updated.',
		removed: 'Share image removed.',
		labels: {
			choose: 'Upload share image',
			replace: 'Replace share image',
			remove: 'Remove share image'
		}
	},
	delete: {
		button: 'Delete service',
		title: (title: string) => `Delete ${title}?`,
		body: 'It leaves the dashboard and the website. Its slugs stay reserved, so no other service can take its URL.',
		blockedTitle: (title: string) => `${title} can’t be deleted yet`,
		blockedBody: (count: number) =>
			`${count === 1 ? 'A project links' : `${count} projects link`} to this service. Move ${count === 1 ? 'it' : 'them'} to another service or delete ${count === 1 ? 'it' : 'them'} first.`,
		close: 'Close',
		confirm: 'Delete',
		deleted: (title: string) => `${title} was deleted.`
	}
} as const;
