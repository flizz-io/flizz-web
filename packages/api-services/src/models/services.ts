import type { UserReference } from './auth';
import type { ProjectImage } from './projects';
import type { ProjectVisibility } from '../enums/projects';
import type { PublishStatus, ServiceCategory } from '../enums/services';

/** One question on the detail page (and in its FAQPage JSON-LD). */
export interface ServiceFaq {
	question: string;
	answer: string;
}

/** A row on the dashboard list — `GET /api/services`. */
export interface ServiceListItem {
	uuid: string;
	slug: string;
	title: string;
	category: ServiceCategory;
	summary: string;
	/** A key of `SERVICE_VISUAL_KINDS` in `@workspace/service-visuals`. */
	visualKind: string;
	displayOrder: number;
	status: PublishStatus;
	/** Non-deleted projects linked to it — while above 0 it can't be deleted. */
	projectCount: number;
	updatedAt: string;
	updatedBy: UserReference | null;
}

/** A project linked to the service, as the form lists it. */
export interface ServiceProject {
	uuid: string;
	name: string;
	slug: string;
	visibility: ProjectVisibility;
}

/** One service with every field — `GET /api/services/:uuid`. */
export interface ServiceRecord extends ServiceListItem {
	intro: string;
	problem: string;
	deliverables: string[];
	outcomes: string[];
	engagement: string | null;
	faqs: ServiceFaq[];
	seoTitle: string | null;
	seoDescription: string | null;
	ogImage: ProjectImage | null;
	projects: ServiceProject[];
	createdAt: string;
	createdBy: UserReference | null;
}

/** The project form's dropdown — `GET /api/services/options`. */
export interface ServiceOption {
	uuid: string;
	title: string;
	slug: string;
	category: ServiceCategory;
	status: PublishStatus;
}

/** `GET /api/services` filters. */
export interface ServiceListQuery {
	search?: string;
	category?: ServiceCategory;
	status?: PublishStatus;
}

/** Everything the pages say — required on create (optional ones may be `null`). */
export interface ServiceContentPayload {
	title: string;
	category: ServiceCategory;
	summary: string;
	visualKind: string;
	intro: string;
	problem: string;
	deliverables: string[];
	outcomes: string[];
	engagement: string | null;
	faqs: ServiceFaq[];
	seoTitle: string | null;
	seoDescription: string | null;
}

/** `POST /api/services` — always a Draft; slug defaults to the title's. */
export type CreateServicePayload = Omit<
	ServiceContentPayload,
	'engagement' | 'faqs' | 'seoTitle' | 'seoDescription'
> &
	Partial<
		Pick<
			ServiceContentPayload,
			'engagement' | 'faqs' | 'seoTitle' | 'seoDescription'
		>
	> & { slug?: string };

/** `PATCH /api/services/:uuid` — any subset. */
export type UpdateServicePayload = Partial<
	ServiceContentPayload & { slug: string; status: PublishStatus }
>;

/** `PUT /api/services/order` — every live service in the category, once. */
export interface ReorderServicesPayload {
	category: ServiceCategory;
	serviceUuids: string[];
}

/** A visible service on the website — the web app's `Service` contract. */
export interface PublicService {
	slug: string;
	title: string;
	category: ServiceCategory;
	summary: string;
	visualKind: string;
}

/** The detail page — `ServiceDetail` plus FAQs and the SEO fields. */
export interface PublicServiceDetail extends PublicService {
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

/** `GET /api/public/services/redirects/:slug` — where an old slug went. */
export interface PublicSlugRedirect {
	slug: string;
}
