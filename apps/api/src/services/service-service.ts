import {
	imagePresets,
	withImageSize,
	type ImageSizeOverrides
} from '@workspace/media-library';

import { recordImage, retireMedia, storeImage } from './media-service.js';
import { visibilityOf } from './project-service.js';
import { revalidateSite } from './site-revalidation-service.js';
import { isRedirectSlug, recordSlugChange } from './slug-redirect-service.js';
import { prisma } from '../configs/database.js';
import { RevalidationTag } from '../enums/revalidation-tag.js';
import type { Prisma } from '../generated/prisma/client.js';
import {
	MediaPurpose,
	PublishStatus,
	SlugEntityType,
	type ServiceCategory
} from '../generated/prisma/enums.js';
import {
	serviceFaqSchema,
	type CreateServiceInput,
	type ListServicesFilters,
	type ReorderServicesInput,
	type ServiceFaq,
	type UpdateServiceInput
} from '../schemas/service-schema.js';
import type {
	ServiceListItemResponse,
	ServiceOptionResponse,
	ServiceResponse
} from '../types/service.js';
import type { CurrentUser } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { mediaUrl } from '../utils/media-url.js';
import { slugify, uniqueSlug } from '../utils/slug.js';
import { toUserReference } from '../utils/user-display.js';

interface UploadedFile {
	buffer: Buffer;
	originalname: string;
}

const referenceFields = {
	select: { uuid: true, email: true, firstName: true, lastName: true }
} as const;

const liveProjects = { where: { deletedAt: null } } as const;

const listInclude = {
	updatedBy: referenceFields,
	_count: { select: { projects: liveProjects } }
} satisfies Prisma.ServiceInclude;

const serviceInclude = {
	...listInclude,
	createdBy: referenceFields,
	ogImage: true,
	projects: {
		...liveProjects,
		select: {
			uuid: true,
			name: true,
			slug: true,
			status: true,
			publishAt: true
		},
		orderBy: [{ name: 'asc' }]
	}
} satisfies Prisma.ServiceInclude;

type ServiceListRow = Prisma.ServiceGetPayload<{
	include: typeof listInclude;
}>;
type ServiceRow = Prisma.ServiceGetPayload<{
	include: typeof serviceInclude;
}>;

/** Dashboard and public order: category (enum order), then position. */
export const serviceOrderBy = [
	{ category: 'asc' },
	{ displayOrder: 'asc' },
	{ id: 'asc' }
] satisfies Prisma.ServiceOrderByWithRelationInput[];

/** What the website may show: not deleted, Published. */
export const publicServiceWhere = {
	deletedAt: null,
	status: PublishStatus.PUBLISHED
} satisfies Prisma.ServiceWhereInput;

/** Whether the website shows this service — `publicServiceWhere` in code. */
export function isPublicService(service: {
	status: PublishStatus;
	deletedAt: Date | null;
}) {
	return (
		service.deletedAt === null && service.status === PublishStatus.PUBLISHED
	);
}

/** `faqs` is JSONB — read it back through the same shape it was saved as. */
export function faqsOf(json: Prisma.JsonValue): ServiceFaq[] {
	const parsed = serviceFaqSchema.array().safeParse(json);

	return parsed.success ? parsed.data : [];
}

function toListItem(service: ServiceListRow): ServiceListItemResponse {
	return {
		uuid: service.uuid,
		slug: service.slug,
		title: service.title,
		category: service.category,
		summary: service.summary,
		visualKind: service.visualKind,
		displayOrder: service.displayOrder,
		status: service.status,
		projectCount: service._count.projects,
		updatedAt: service.updatedAt.toISOString(),
		updatedBy: toUserReference(service.updatedBy)
	};
}

function toServiceResponse(service: ServiceRow): ServiceResponse {
	const ogImageUrl = service.ogImage ? mediaUrl(service.ogImage) : null;
	const now = new Date();

	return {
		...toListItem(service),
		intro: service.intro,
		problem: service.problem,
		deliverables: service.deliverables,
		outcomes: service.outcomes,
		engagement: service.engagement,
		faqs: faqsOf(service.faqs),
		seoTitle: service.seoTitle,
		seoDescription: service.seoDescription,
		ogImage:
			service.ogImage && ogImageUrl
				? {
						uuid: service.ogImage.uuid,
						url: ogImageUrl,
						width: service.ogImage.width,
						height: service.ogImage.height
					}
				: null,
		projects: service.projects.map((project) => ({
			uuid: project.uuid,
			name: project.name,
			slug: project.slug,
			visibility: visibilityOf(project, now)
		})),
		createdAt: service.createdAt.toISOString(),
		createdBy: toUserReference(service.createdBy)
	};
}

/** A live (not deleted) service by public id, or 404. */
async function findService(uuid: string) {
	const service = await prisma.service.findFirst({
		where: { uuid, deletedAt: null },
		include: serviceInclude
	});
	if (!service) throw HttpError.notFound('No such service.');

	return service;
}

/** Deleted services and old slugs keep theirs, so both count as taken. */
async function isSlugTaken(slug: string, exceptId?: number) {
	const owner = await prisma.service.findUnique({
		where: { slug },
		select: { id: true }
	});
	if (owner && owner.id !== exceptId) return true;

	return isRedirectSlug(SlugEntityType.SERVICE, slug, exceptId);
}

async function assertSlugFree(slug: string, exceptId?: number) {
	if (await isSlugTaken(slug, exceptId)) {
		throw HttpError.conflict(
			'That slug is taken — by another service, a deleted one, or an old link.'
		);
	}
}

/** One past the last position in a category. */
async function nextDisplayOrder(category: ServiceCategory) {
	const last = await prisma.service.aggregate({
		where: { category, deletedAt: null },
		_max: { displayOrder: true }
	});

	return (last._max.displayOrder ?? -1) + 1;
}

/** Project pages link to services — they refresh when a link could change. */
function revalidateFor(input: UpdateServiceInput | null) {
	const affectsProjects =
		!input ||
		['slug', 'status', 'title', 'category'].some((key) => key in input);

	if (affectsProjects) {
		revalidateSite(RevalidationTag.SERVICES, RevalidationTag.PROJECTS);
	} else {
		revalidateSite(RevalidationTag.SERVICES);
	}
}

export async function listDashboardServices(filters: ListServicesFilters) {
	const search: Prisma.ServiceWhereInput = filters.search
		? {
				OR: (['title', 'slug', 'summary'] as const).map((field) => ({
					[field]: {
						contains: filters.search,
						mode: 'insensitive' as const
					}
				}))
			}
		: {};

	const services = await prisma.service.findMany({
		where: {
			AND: [
				{ deletedAt: null },
				filters.category ? { category: filters.category } : {},
				filters.status ? { status: filters.status } : {},
				search
			]
		},
		include: listInclude,
		orderBy: serviceOrderBy
	});

	return services.map(toListItem);
}

/** The project form's dropdown. */
export async function listServiceOptions(): Promise<ServiceOptionResponse[]> {
	return prisma.service.findMany({
		where: { deletedAt: null },
		select: {
			uuid: true,
			title: true,
			slug: true,
			category: true,
			status: true
		},
		orderBy: serviceOrderBy
	});
}

export async function getDashboardService(uuid: string) {
	return toServiceResponse(await findService(uuid));
}

/** A new Draft, last in its category. The share image is added once it exists. */
export async function addService(
	actor: CurrentUser,
	input: CreateServiceInput
) {
	const { slug: requested, ...fields } = input;
	if (requested) await assertSlugFree(requested);
	const slug =
		requested ??
		(await uniqueSlug(slugify(fields.title, 'service'), (candidate) =>
			isSlugTaken(candidate)
		));

	const service = await prisma.service.create({
		data: {
			...fields,
			slug,
			displayOrder: await nextDisplayOrder(fields.category),
			status: PublishStatus.DRAFT,
			createdById: actor.id,
			updatedById: actor.id
		},
		include: serviceInclude
	});

	return toServiceResponse(service);
}

/**
 * Any fields and status. A new slug leaves the old one redirecting; a new
 * category puts the service last in it.
 */
export async function editService(
	actor: CurrentUser,
	uuid: string,
	input: UpdateServiceInput
) {
	const current = await findService(uuid);
	const newSlug =
		input.slug !== undefined && input.slug !== current.slug
			? input.slug
			: null;
	if (newSlug) await assertSlugFree(newSlug, current.id);
	const newCategory =
		input.category !== undefined && input.category !== current.category
			? input.category
			: null;
	const displayOrder = newCategory
		? await nextDisplayOrder(newCategory)
		: undefined;

	const service = await prisma.$transaction(async (tx) => {
		if (newSlug) {
			await recordSlugChange(
				tx,
				actor,
				SlugEntityType.SERVICE,
				current.id,
				current.slug,
				newSlug
			);
		}

		return tx.service.update({
			where: { id: current.id },
			data: { ...input, displayOrder, updatedById: actor.id },
			include: serviceInclude
		});
	});
	revalidateFor(input);

	return toServiceResponse(service);
}

/**
 * Soft delete — refused while any non-deleted project links to it, since
 * every project needs a service. Its slugs stay reserved.
 */
export async function removeService(actor: CurrentUser, uuid: string) {
	const current = await findService(uuid);
	const linked = current._count.projects;
	if (linked > 0) {
		throw HttpError.conflict(
			`${linked} ${linked === 1 ? 'project links' : 'projects link'} to this service. Move ${linked === 1 ? 'it' : 'them'} to another service or delete ${linked === 1 ? 'it' : 'them'} first.`
		);
	}

	await prisma.service.update({
		where: { id: current.id },
		data: {
			deletedAt: new Date(),
			deletedById: actor.id,
			updatedById: actor.id
		}
	});
	revalidateFor(null);
}

/** A category's new order. A list that's out of date gets 409. */
export async function reorderServices(
	actor: CurrentUser,
	input: ReorderServicesInput
) {
	const services = await prisma.service.findMany({
		where: { category: input.category, deletedAt: null },
		select: { id: true, uuid: true }
	});
	const idByUuid = new Map(services.map((row) => [row.uuid, row.id]));
	const complete =
		input.serviceUuids.length === services.length &&
		new Set(input.serviceUuids).size === services.length &&
		input.serviceUuids.every((uuid) => idByUuid.has(uuid));
	if (!complete) {
		throw HttpError.conflict(
			'The services in this category have changed — reload and try again.'
		);
	}

	await prisma.$transaction(
		input.serviceUuids.map((uuid, position) =>
			prisma.service.update({
				where: { id: idByUuid.get(uuid) },
				data: { displayOrder: position, updatedById: actor.id }
			})
		)
	);
	revalidateSite(RevalidationTag.SERVICES);

	return listDashboardServices({ category: input.category });
}

/** Replaces the share image; the previous one is retired, not deleted. */
export async function setServiceOgImage(
	actor: CurrentUser,
	uuid: string,
	file: UploadedFile,
	size: ImageSizeOverrides
) {
	const { id } = await findService(uuid);
	// Upload outside the transaction — it can be slow (see `storeImage`).
	const image = await storeImage({
		buffer: file.buffer,
		originalName: file.originalname,
		purpose: MediaPurpose.SERVICE_OG_IMAGE,
		preset: withImageSize(imagePresets.shareImage, size)
	});

	await prisma.$transaction(async (tx) => {
		const current = await tx.service.findUniqueOrThrow({
			where: { id },
			select: { ogImageId: true }
		});
		const media = await recordImage(tx, actor, image);
		if (current.ogImageId) {
			await retireMedia(tx, actor, current.ogImageId);
		}
		await tx.service.update({
			where: { id },
			data: { ogImageId: media.id, updatedById: actor.id }
		});
	});
	revalidateSite(RevalidationTag.SERVICES);

	return getDashboardService(uuid);
}

/** Clears the share image — the page falls back to the generated card. */
export async function clearServiceOgImage(actor: CurrentUser, uuid: string) {
	const current = await findService(uuid);

	if (current.ogImageId) {
		const ogImageId = current.ogImageId;
		await prisma.$transaction(async (tx) => {
			await retireMedia(tx, actor, ogImageId);
			await tx.service.update({
				where: { id: current.id },
				data: { ogImageId: null, updatedById: actor.id }
			});
		});
		revalidateSite(RevalidationTag.SERVICES);
	}

	return getDashboardService(uuid);
}
