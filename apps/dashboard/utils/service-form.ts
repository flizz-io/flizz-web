import type { ServiceFormValues } from '@/types/service-form';
import { fromKeyed, toKeyed } from '@/utils/list-items';
import {
	PublishStatus,
	ServiceCategory,
	type CreateServicePayload,
	type ServiceRecord,
	type UpdateServicePayload
} from '@workspace/api-services';
import {
	SERVICE_VISUAL_KINDS,
	type ServiceVisualKind
} from '@workspace/service-visuals';

const DEFAULT_VISUAL: ServiceVisualKind = 'pulse-orb';

/** A stored kind the picker no longer knows falls back to the default. */
function toVisualKind(kind: string): ServiceVisualKind {
	return (
		SERVICE_VISUAL_KINDS.find((known) => known === kind) ?? DEFAULT_VISUAL
	);
}

/** A new service's starting values — one empty entry where one is required. */
export function emptyServiceValues(): ServiceFormValues {
	return {
		title: '',
		slug: '',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary: '',
		visualKind: DEFAULT_VISUAL,
		intro: '',
		problem: '',
		deliverables: toKeyed(['']),
		outcomes: toKeyed(['']),
		engagement: '',
		faqs: [],
		seoTitle: '',
		seoDescription: '',
		status: PublishStatus.DRAFT
	};
}

export function serviceToValues(service: ServiceRecord): ServiceFormValues {
	return {
		title: service.title,
		slug: service.slug,
		category: service.category,
		summary: service.summary,
		visualKind: toVisualKind(service.visualKind),
		intro: service.intro,
		problem: service.problem,
		deliverables: toKeyed(service.deliverables),
		outcomes: toKeyed(service.outcomes),
		engagement: service.engagement ?? '',
		faqs: toKeyed(service.faqs),
		seoTitle: service.seoTitle ?? '',
		seoDescription: service.seoDescription ?? '',
		status: service.status
	};
}

const filled = (items: string[]) => items.filter((item) => item.trim());

/** Blank entries are dropped; a half-filled FAQ is sent so the API flags it. */
function contentPayload(values: ServiceFormValues) {
	return {
		title: values.title,
		category: values.category,
		summary: values.summary,
		visualKind: values.visualKind,
		intro: values.intro,
		problem: values.problem,
		deliverables: filled(fromKeyed(values.deliverables)),
		outcomes: filled(fromKeyed(values.outcomes)),
		engagement: values.engagement.trim() || null,
		faqs: fromKeyed(values.faqs).filter(
			(faq) => faq.question.trim() || faq.answer.trim()
		),
		seoTitle: values.seoTitle.trim() || null,
		seoDescription: values.seoDescription.trim() || null
	};
}

/** A new service — always a Draft; a blank slug lets the API make one. */
export function toCreateServicePayload(
	values: ServiceFormValues
): CreateServicePayload {
	const slug = values.slug.trim();

	return { ...contentPayload(values), ...(slug ? { slug } : {}) };
}

/** Every field — the form always saves the whole service. */
export function toUpdateServicePayload(
	values: ServiceFormValues
): UpdateServicePayload {
	return {
		...contentPayload(values),
		slug: values.slug,
		status: values.status
	};
}
