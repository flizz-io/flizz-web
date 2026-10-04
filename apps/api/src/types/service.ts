import type { ImageResponse } from './project.js';
import type { UserReference } from './team.js';
import type { ProjectVisibility } from '../enums/project-visibility.js';
import type {
	PublishStatus,
	ServiceCategory
} from '../generated/prisma/enums.js';

export interface ServiceFaq {
	question: string;
	answer: string;
}

/** A row on the dashboard Services list. */
export interface ServiceListItemResponse {
	uuid: string;
	slug: string;
	title: string;
	category: ServiceCategory;
	summary: string;
	visualKind: string;
	displayOrder: number;
	status: PublishStatus;
	/** Non-deleted projects linked to it — while above 0 it can't be deleted. */
	projectCount: number;
	updatedAt: string;
	updatedBy: UserReference | null;
}

/** A project linked to a service, as the service form lists it. */
export interface ServiceProjectReference {
	uuid: string;
	name: string;
	slug: string;
	visibility: ProjectVisibility;
}

/** One service with every field, as the dashboard form edits it. */
export interface ServiceResponse extends ServiceListItemResponse {
	intro: string;
	problem: string;
	deliverables: string[];
	outcomes: string[];
	engagement: string | null;
	faqs: ServiceFaq[];
	seoTitle: string | null;
	seoDescription: string | null;
	ogImage: ImageResponse | null;
	projects: ServiceProjectReference[];
	createdAt: string;
	createdBy: UserReference | null;
}

/** The project form's dropdown — every non-deleted service. */
export interface ServiceOptionResponse {
	uuid: string;
	title: string;
	slug: string;
	category: ServiceCategory;
	status: PublishStatus;
}

/** A visible service as the website sees it — the web app's `Service`. */
export interface PublicServiceResponse {
	slug: string;
	title: string;
	category: ServiceCategory;
	summary: string;
	visualKind: string;
}

/**
 * The detail page — the web app's `ServiceDetail` plus FAQs and the SEO
 * fields. Optional keys are left out rather than sent as `null`.
 */
export interface PublicServiceDetailResponse extends PublicServiceResponse {
	intro: string;
	problem: string;
	deliverables: string[];
	outcomes: string[];
	engagement?: string;
	faqs: ServiceFaq[];
	seoTitle?: string;
	seoDescription?: string;
	ogImage?: string;
}

/** Where an old slug points now. */
export interface PublicSlugRedirectResponse {
	slug: string;
}
