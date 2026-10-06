import type { UserReference } from './auth';
import type { ProjectVisibility } from '../enums/projects';
import type { PublishStatus } from '../enums/services';

/** A project as the testimonial form shows it — the dropdown and the link. */
export interface TestimonialProject {
	uuid: string;
	name: string;
	slug: string;
	visibility: ProjectVisibility;
}

/** A row on the dashboard list — `GET /api/testimonials`. */
export interface TestimonialListItem {
	uuid: string;
	quote: string;
	/** Exact phrases of the quote, set in the accent colour. */
	highlights: string[];
	authorName: string;
	authorRole: string;
	project: TestimonialProject | null;
	displayOrder: number;
	status: PublishStatus;
	updatedAt: string;
	updatedBy: UserReference | null;
}

/** One testimonial with authorship — `GET /api/testimonials/:uuid`. */
export interface TestimonialRecord extends TestimonialListItem {
	createdAt: string;
	createdBy: UserReference | null;
}

/** `GET /api/testimonials` filters. */
export interface TestimonialListQuery {
	search?: string;
	status?: PublishStatus;
}

/** Everything the section shows — required on create (bar the optional ones). */
export interface TestimonialContentPayload {
	quote: string;
	highlights: string[];
	authorName: string;
	authorRole: string;
	/** `null` unlinks. */
	projectUuid: string | null;
}

/** `POST /api/testimonials` — always a Draft, last in the list. */
export type CreateTestimonialPayload = Omit<
	TestimonialContentPayload,
	'highlights' | 'projectUuid'
> &
	Partial<Pick<TestimonialContentPayload, 'highlights' | 'projectUuid'>>;

/** `PATCH /api/testimonials/:uuid` — any subset. */
export type UpdateTestimonialPayload = Partial<
	TestimonialContentPayload & { status: PublishStatus }
>;

/** `PUT /api/testimonials/order` — every live testimonial, once. */
export interface ReorderTestimonialsPayload {
	testimonialUuids: string[];
}

/**
 * A visible testimonial on the website — the web app's `Testimonial`, plus
 * its project while that project is visible.
 */
export interface PublicTestimonial {
	quote: string;
	highlights: string[];
	author: string;
	role: string;
	project?: { slug: string; name: string };
}
