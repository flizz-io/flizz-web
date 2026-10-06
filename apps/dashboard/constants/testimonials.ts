import { PublishStatus } from '@workspace/api-services';

export const testimonialsPath = '/testimonials';
export const newTestimonialPath = `${testimonialsPath}/new`;
export const testimonialPath = (uuid: string) => `${testimonialsPath}/${uuid}`;

/** The Project select's "no project" option — Radix needs a non-empty value. */
export const noProjectValue = 'NONE';

/** A testimonial has no schedule, so Published is simply Live. */
export const testimonialStatusLabels: Record<PublishStatus, string> = {
	[PublishStatus.DRAFT]: 'Draft',
	[PublishStatus.PUBLISHED]: 'Live'
};

/** Field limits — the API's (apps/api `testimonialLimits`); inputs stop here. */
export const testimonialFieldLimits = {
	quote: 320,
	highlight: 60,
	highlightsMax: 3,
	authorName: 80,
	authorRole: 120
} as const;

export const testimonialsMessages = {
	title: 'Testimonials',
	lead: 'Client quotes for the home page carousel. A quote shows there once it’s Published; the order here is the order in the carousel.',
	newTestimonial: 'New testimonial',
	searchPlaceholder: 'Search quote or author',
	anyStatus: 'All statuses',
	noTestimonials: 'No testimonials yet.',
	noResults: 'No testimonials match these filters.',
	reorderPaused: 'Clear the search and filter to reorder.',
	reordered: 'Order saved.',
	moveUp: (author: string) => `Move ${author}’s quote up`,
	moveDown: (author: string) => `Move ${author}’s quote down`,
	updatedBy: (name: string, when: string) => `${name} · ${when}`,
	columns: {
		order: '#',
		quote: 'Quote',
		author: 'Author',
		project: 'Project',
		status: 'Status',
		updated: 'Last updated',
		move: 'Order'
	}
} as const;

export const testimonialFormMessages = {
	newTitle: 'New testimonial',
	newLead:
		'It starts as a Draft, last in the carousel. Publish it when it’s ready.',
	backToList: 'All testimonials',
	readOnly: 'You can view this testimonial but not change it.',
	create: 'Create draft',
	save: 'Save changes',
	saving: 'Saving…',
	created: (author: string) => `${author}’s quote created as a draft.`,
	saved: (author: string) => `${author}’s quote saved.`,
	fixErrors: 'Some fields need attention — see the messages below.',
	fixHighlights: 'Remove the highlights that are no longer in the quote.',
	sections: {
		quote: 'Quote',
		quoteLead:
			'In the client’s words. The home page sets it large, so under about 200 characters reads best.',
		highlights: 'Highlights',
		highlightsLead:
			'Up to three phrases set in the accent colour. Select words in the preview, then press Highlight.',
		author: 'Author',
		authorLead: 'Who said it. The carousel shows their initials.',
		project: 'Project',
		projectLead:
			'Optional. The work it came from — the home page links to it while the project is live.',
		publishing: 'Publishing',
		publishingLead: 'Public when Published.'
	},
	fields: {
		quote: 'Quote',
		quoteHint: 'One paragraph, no line breaks.',
		preview: 'Preview',
		emptyPreview: 'Write the quote first.',
		highlight: (phrase: string) => `Highlight “${phrase}”`,
		highlightIdle: 'Highlight selection',
		removeHighlight: (phrase: string) => `Remove highlight “${phrase}”`,
		noHighlights: 'No highlights.',
		missing: 'Not in the quote any more — remove it.',
		authorName: 'Name',
		authorRole: 'Role',
		authorRoleHint: 'Title and company, e.g. “COO, Northwind”.',
		project: 'Project',
		noProject: 'None',
		status: 'Status'
	},
	/** Why a selection can't become a highlight. */
	highlightErrors: {
		outside: 'Select words inside the quote preview.',
		tooLong: (max: number) =>
			`Keep each highlight under ${max} characters.`,
		full: (max: number) => `Up to ${max} highlights.`,
		duplicate: 'That phrase is already highlighted.'
	},
	delete: {
		button: 'Delete testimonial',
		title: (author: string) => `Delete ${author}’s quote?`,
		body: 'It leaves the dashboard and the home page.',
		confirm: 'Delete',
		deleted: (author: string) => `${author}’s quote was deleted.`
	}
} as const;
