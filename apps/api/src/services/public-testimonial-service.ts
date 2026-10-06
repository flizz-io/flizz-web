import { visibilityOf } from './project-service.js';
import {
	projectFields,
	publicTestimonialWhere,
	testimonialOrderBy
} from './testimonial-service.js';
import { prisma } from '../configs/database.js';
import { ProjectVisibility } from '../enums/project-visibility.js';
import type { PublicTestimonialResponse } from '../types/testimonial.js';

/**
 * Every visible testimonial, in order — the home section. A linked project
 * is named only while the website shows it, so the link is never dead.
 */
export async function listPublicTestimonials(): Promise<
	PublicTestimonialResponse[]
> {
	const testimonials = await prisma.testimonial.findMany({
		where: publicTestimonialWhere,
		include: { project: projectFields },
		orderBy: testimonialOrderBy
	});
	const now = new Date();

	return testimonials.map(
		({ quote, highlights, authorName, authorRole, project }) => {
			const visible =
				project &&
				!project.deletedAt &&
				visibilityOf(project, now) === ProjectVisibility.LIVE;

			return {
				quote,
				highlights,
				author: authorName,
				role: authorRole,
				...(visible
					? { project: { slug: project.slug, name: project.name } }
					: {})
			};
		}
	);
}
