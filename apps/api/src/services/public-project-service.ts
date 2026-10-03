import { publicProjectWhere, resultsOf } from './project-service.js';
import { isPublicService } from './service-service.js';
import { prisma } from '../configs/database.js';
import type { Prisma } from '../generated/prisma/client.js';
import type {
	PublicGalleryImageResponse,
	PublicProjectDetailResponse,
	PublicProjectResponse
} from '../types/project.js';
import { HttpError } from '../utils/http-error.js';
import { mediaUrl } from '../utils/media-url.js';

const cardInclude = {
	coverImage: true,
	service: {
		select: { slug: true, category: true, status: true, deletedAt: true }
	}
} satisfies Prisma.ProjectInclude;

const publicInclude = {
	...cardInclude,
	images: {
		where: { deletedAt: null },
		include: { media: true },
		orderBy: [{ position: 'asc' }, { id: 'asc' }]
	}
} satisfies Prisma.ProjectInclude;

type PublicCardRow = Prisma.ProjectGetPayload<{
	include: typeof cardInclude;
}>;

type PublicProjectRow = Prisma.ProjectGetPayload<{
	include: typeof publicInclude;
}>;

/** The `Project` contract — optional keys left out, never `null`. */
function toPublicProject(project: PublicCardRow): PublicProjectResponse {
	const image = mediaUrl(project.coverImage);

	return {
		slug: project.slug,
		name: project.name,
		client: project.client,
		sector: project.sector,
		service: project.service?.category ?? project.serviceCategory,
		// No link to a service page the website doesn't show.
		...(project.service && isPublicService(project.service)
			? { serviceSlug: project.service.slug }
			: {}),
		year: String(project.year),
		summary: project.summary,
		results: resultsOf(project.results),
		...(project.featured ? { featured: true } : {}),
		...(image ? { image } : {})
	};
}

function toPublicDetail(
	project: PublicProjectRow
): PublicProjectDetailResponse {
	return {
		...toPublicProject(project),
		duration: project.duration,
		team: project.team,
		brief: project.brief,
		constraints: project.constraints,
		approach: project.approach,
		built: project.built,
		stack: project.stack,
		...(project.quoteText && project.quoteAttribution
			? {
					quote: {
						text: project.quoteText,
						attribution: project.quoteAttribution
					}
				}
			: {}),
		gallery: project.images.flatMap(
			(entry): PublicGalleryImageResponse[] => {
				const url = mediaUrl(entry.media);
				return url
					? [
							{
								url,
								width: entry.media.width,
								height: entry.media.height,
								caption: entry.caption
							}
						]
					: [];
			}
		)
	};
}

/**
 * Every visible project — the index and the reel (and the slugs to build
 * detail pages for). Featured first in reel order, then newest first.
 */
export async function listPublicProjects() {
	const projects = await prisma.project.findMany({
		where: publicProjectWhere(),
		include: cardInclude,
		orderBy: [
			{ featured: 'desc' },
			{ featuredOrder: 'asc' },
			{ year: 'desc' },
			{ id: 'asc' }
		]
	});

	return projects.map(toPublicProject);
}

/** The home strip, in home order — card fields only. */
export async function listHomeProjects() {
	const projects = await prisma.project.findMany({
		where: { ...publicProjectWhere(), showOnHome: true },
		include: cardInclude,
		orderBy: [{ homeOrder: 'asc' }, { id: 'asc' }]
	});

	return projects.map(toPublicProject);
}

/** One visible project — drafts, scheduled and deleted ones are a 404. */
export async function getPublicProject(slug: string) {
	const project = await prisma.project.findFirst({
		where: { ...publicProjectWhere(), slug },
		include: publicInclude
	});
	if (!project) throw HttpError.notFound('No such project.');

	return toPublicDetail(project);
}
