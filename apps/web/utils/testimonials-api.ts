import 'server-only';

import { CacheTag, contentRevalidate } from '@/constants/cache';
import type { Testimonial } from '@/types/home';
import {
	getPublicTestimonialsService,
	type ApiContext
} from '@workspace/api-services';

/**
 * Cached and tagged; refetched on an interval only if that's enabled. Also
 * tagged `projects`, so a linked project going offline drops its link.
 */
const testimonialsContext: ApiContext = {
	baseUrl: process.env.API_URL,
	init: {
		next: {
			revalidate: contentRevalidate,
			tags: [CacheTag.TESTIMONIALS, CacheTag.PROJECTS]
		}
	}
};

/** Every published testimonial, in the dashboard's order. */
export async function getHomeTestimonials(): Promise<Testimonial[]> {
	return getPublicTestimonialsService(testimonialsContext);
}
