import type { ProjectFormValues, StoryField } from '@/types/project-form';
import { fromKeyed, toKeyed } from '@/utils/list-items';
import {
	ProjectSector,
	ProjectStatus,
	ServiceCategory,
	type CreateProjectPayload,
	type ProjectRecord,
	type UpdateProjectPayload
} from '@workspace/api-services';

/** A new project's starting values — one empty entry where one is required. */
export function emptyProjectValues(): ProjectFormValues {
	return {
		name: '',
		slug: '',
		client: '',
		sector: ProjectSector.OPERATIONS,
		serviceCategory: ServiceCategory.CUSTOM_SOFTWARE,
		serviceUuid: '',
		year: String(new Date().getFullYear()),
		summary: '',
		results: toKeyed([{ label: '', from: '', to: '' }]),
		duration: '',
		team: '',
		brief: toKeyed(['']),
		constraints: toKeyed(['']),
		approach: toKeyed(['']),
		built: toKeyed(['']),
		stack: [],
		quoteText: '',
		quoteAttribution: '',
		status: ProjectStatus.DRAFT,
		publishAt: '',
		featured: false,
		featuredOrder: '0',
		showOnHome: false,
		homeOrder: '0'
	};
}

export function projectToValues(project: ProjectRecord): ProjectFormValues {
	return {
		name: project.name,
		slug: project.slug,
		client: project.client,
		sector: project.sector,
		serviceCategory: project.service.category,
		serviceUuid: project.service.uuid,
		year: String(project.year),
		summary: project.summary,
		results: toKeyed(project.results),
		duration: project.duration,
		team: project.team,
		brief: toKeyed(project.brief),
		constraints: toKeyed(project.constraints),
		approach: toKeyed(project.approach),
		built: toKeyed(project.built),
		stack: project.stack,
		quoteText: project.quote?.text ?? '',
		quoteAttribution: project.quote?.attribution ?? '',
		status: project.status,
		publishAt: project.publishAt ?? '',
		featured: project.featured,
		featuredOrder: String(project.featuredOrder),
		showOnHome: project.showOnHome,
		homeOrder: String(project.homeOrder)
	};
}

/** `Number('')` is 0 — keep an empty number empty so the API flags it. */
const toNumber = (value: string) => (value.trim() === '' ? NaN : Number(value));

/**
 * The content fields as the API takes them. Blank list entries are dropped
 * (an empty trailing row isn't an error); a half-filled quote is sent as-is
 * so the API can say which part is missing.
 */
function contentPayload(values: ProjectFormValues) {
	const quoteText = values.quoteText.trim();
	const quoteAttribution = values.quoteAttribution.trim();
	const story = (field: StoryField) =>
		fromKeyed(values[field]).filter((item) => item.trim());

	return {
		name: values.name,
		client: values.client,
		sector: values.sector,
		serviceUuid: values.serviceUuid,
		year: toNumber(values.year),
		summary: values.summary,
		results: fromKeyed(values.results).filter(
			(result) =>
				result.label.trim() || result.from.trim() || result.to.trim()
		),
		duration: values.duration,
		team: values.team,
		brief: story('brief'),
		constraints: story('constraints'),
		approach: story('approach'),
		built: story('built'),
		stack: values.stack,
		quote:
			quoteText || quoteAttribution
				? { text: quoteText, attribution: quoteAttribution }
				: null
	};
}

function placementPayload(values: ProjectFormValues) {
	return {
		publishAt: values.publishAt || null,
		featured: values.featured,
		featuredOrder: toNumber(values.featuredOrder),
		showOnHome: values.showOnHome,
		homeOrder: toNumber(values.homeOrder)
	};
}

/** A new project — always a Draft; a blank slug lets the API make one. */
export function toCreatePayload(
	values: ProjectFormValues
): CreateProjectPayload {
	const slug = values.slug.trim();

	return {
		...contentPayload(values),
		...placementPayload(values),
		...(slug ? { slug } : {})
	};
}

/** Every field — the form always saves the whole project. */
export function toUpdatePayload(
	values: ProjectFormValues
): UpdateProjectPayload {
	return {
		...contentPayload(values),
		...placementPayload(values),
		slug: values.slug,
		status: values.status
	};
}
