import {
	faqsOf,
	publicServiceWhere,
	serviceOrderBy
} from './service-service.js';
import { findRedirectTarget } from './slug-redirect-service.js';
import { prisma } from '../configs/database.js';
import type { Prisma } from '../generated/prisma/client.js';
import { SlugEntityType } from '../generated/prisma/enums.js';
import type {
	PublicServiceDetailResponse,
	PublicServiceResponse,
	PublicSlugRedirectResponse
} from '../types/service.js';
import { HttpError } from '../utils/http-error.js';
import { mediaUrl } from '../utils/media-url.js';

const detailInclude = { ogImage: true } satisfies Prisma.ServiceInclude;

type PublicServiceRow = Prisma.ServiceGetPayload<object>;
type PublicServiceDetailRow = Prisma.ServiceGetPayload<{
	include: typeof detailInclude;
}>;

/** The `Service` contract — card fields only. */
function toPublicService(service: PublicServiceRow): PublicServiceResponse {
	return {
		slug: service.slug,
		title: service.title,
		category: service.category,
		summary: service.summary,
		visualKind: service.visualKind
	};
}

/** The `ServiceDetail` contract — optional keys left out, never `null`. */
function toPublicDetail(
	service: PublicServiceDetailRow
): PublicServiceDetailResponse {
	const ogImage = service.ogImage ? mediaUrl(service.ogImage) : null;

	return {
		...toPublicService(service),
		intro: service.intro,
		problem: service.problem,
		deliverables: service.deliverables,
		outcomes: service.outcomes,
		...(service.engagement ? { engagement: service.engagement } : {}),
		faqs: faqsOf(service.faqs),
		...(service.seoTitle ? { seoTitle: service.seoTitle } : {}),
		...(service.seoDescription
			? { seoDescription: service.seoDescription }
			: {}),
		...(ogImage ? { ogImage } : {})
	};
}

/**
 * Every visible service, by category then position — the list page, the
 * home teaser and the slugs to build detail pages for.
 */
export async function listPublicServices() {
	const services = await prisma.service.findMany({
		where: publicServiceWhere,
		orderBy: serviceOrderBy
	});

	return services.map(toPublicService);
}

/** One visible service — drafts and deleted ones are a 404. */
export async function getPublicService(slug: string) {
	const service = await prisma.service.findFirst({
		where: { ...publicServiceWhere, slug },
		include: detailInclude
	});
	if (!service) throw HttpError.notFound('No such service.');

	return toPublicDetail(service);
}

/** The current slug of the visible service an old slug belonged to. */
export async function getServiceRedirect(
	oldSlug: string
): Promise<PublicSlugRedirectResponse> {
	const id = await findRedirectTarget(SlugEntityType.SERVICE, oldSlug);
	const service =
		id === null
			? null
			: await prisma.service.findFirst({
					where: { ...publicServiceWhere, id },
					select: { slug: true }
				});
	if (!service) throw HttpError.notFound('No such service.');

	return { slug: service.slug };
}
