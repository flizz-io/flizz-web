import type { UserReference } from './team.js';
import type { ProjectVisibility } from '../enums/project-visibility.js';
import type { PublishStatus } from '../generated/prisma/enums.js';

/** A project as the testimonial form shows it — dropdown and linked project. */
export interface TestimonialProjectReference {
	uuid: string;
	name: string;
	slug: string;
	visibility: ProjectVisibility;
}

/** A row on the dashboard Testimonials list. */
export interface TestimonialListItemResponse {
	uuid: string;
	quote: string;
	highlights: string[];
	authorName: string;
	authorRole: string;
	project: TestimonialProjectReference | null;
	displayOrder: number;
	status: PublishStatus;
	updatedAt: string;
	updatedBy: UserReference | null;
}

/** One testimonial with authorship, as the dashboard form edits it. */
export interface TestimonialResponse extends TestimonialListItemResponse {
	createdAt: string;
	createdBy: UserReference | null;
}

/**
 * A visible testimonial as the website sees it — the web app's
 * `Testimonial`, plus its project while that project is visible.
 */
export interface PublicTestimonialResponse {
	quote: string;
	highlights: string[];
	author: string;
	role: string;
	project?: { slug: string; name: string };
}
