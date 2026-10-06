import { apiService } from './api-service';
import { HttpMethod } from '../enums/api';
import type { ApiContext } from '../models/api';
import type {
	CreateTestimonialPayload,
	PublicTestimonial,
	ReorderTestimonialsPayload,
	TestimonialListItem,
	TestimonialListQuery,
	TestimonialProject,
	TestimonialRecord,
	UpdateTestimonialPayload
} from '../models/testimonials';

const testimonialPath = (uuid: string) =>
	`/testimonials/${encodeURIComponent(uuid)}`;

// Dashboard — need a session with the TESTIMONIALS grant.

export function getTestimonialsService(
	query: TestimonialListQuery = {},
	context?: ApiContext
) {
	return apiService<TestimonialListItem[]>('/testimonials', {
		query: { ...query },
		context
	});
}

/** The form's Project dropdown — every non-deleted project. */
export function getTestimonialProjectOptionsService(context?: ApiContext) {
	return apiService<TestimonialProject[]>('/testimonials/project-options', {
		context
	});
}

export function getTestimonialService(uuid: string, context?: ApiContext) {
	return apiService<TestimonialRecord>(testimonialPath(uuid), { context });
}

export function createTestimonialService(
	payload: CreateTestimonialPayload,
	context?: ApiContext
) {
	return apiService<TestimonialRecord>('/testimonials', {
		method: HttpMethod.POST,
		body: payload,
		context
	});
}

/** A 400 when a highlight isn't a phrase of the quote being saved. */
export function updateTestimonialService(
	uuid: string,
	payload: UpdateTestimonialPayload,
	context?: ApiContext
) {
	return apiService<TestimonialRecord>(testimonialPath(uuid), {
		method: HttpMethod.PATCH,
		body: payload,
		context
	});
}

/** Soft delete — never blocked. */
export function deleteTestimonialService(uuid: string, context?: ApiContext) {
	return apiService<void>(testimonialPath(uuid), {
		method: HttpMethod.DELETE,
		context
	});
}

/** Returns every testimonial in its new order; a stale list gets a 409. */
export function reorderTestimonialsService(
	payload: ReorderTestimonialsPayload,
	context?: ApiContext
) {
	return apiService<TestimonialListItem[]>('/testimonials/order', {
		method: HttpMethod.PUT,
		body: payload,
		context
	});
}

// Public — the website; no session.

export function getPublicTestimonialsService(context?: ApiContext) {
	return apiService<PublicTestimonial[]>('/public/testimonials', {
		context
	});
}
