import { getProjectImages } from './project-image-service.js';
import { revalidateSite } from './site-revalidation-service.js';
import { prisma } from '../configs/database.js';
import { reservedProjectSlugs } from '../constants/project.js';
import { ProjectVisibility } from '../enums/project-visibility.js';
import { RevalidationTag } from '../enums/revalidation-tag.js';
import type { Prisma } from '../generated/prisma/client.js';
import { ProjectStatus } from '../generated/prisma/enums.js';
import {
	projectResultSchema,
	type CreateProjectInput,
	type ListProjectsFilters,
	type UpdateProjectInput
} from '../schemas/project-schema.js';
import type {
	ProjectListItemResponse,
	ProjectResponse,
	ProjectResult
} from '../types/project.js';
import type { CurrentUser } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { mediaUrl } from '../utils/media-url.js';
import { slugify, uniqueSlug } from '../utils/slug.js';
import { toUserReference } from '../utils/user-display.js';

const referenceFields = {
	select: { uuid: true, email: true, firstName: true, lastName: true }
} as const;

const projectInclude = {
	coverImage: true,
	createdBy: referenceFields,
	updatedBy: referenceFields
} satisfies Prisma.ProjectInclude;

type ProjectRow = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

/** `results` is JSONB — read it back through the same shape it was saved as. */
export function resultsOf(json: Prisma.JsonValue): ProjectResult[] {
	const parsed = projectResultSchema.array().safeParse(json);

	return parsed.success ? parsed.data : [];
}

export function visibilityOf(
	project: { status: ProjectStatus; publishAt: Date | null },
	now = new Date()
) {
	if (project.status === ProjectStatus.DRAFT) return ProjectVisibility.DRAFT;

	return project.publishAt && project.publishAt > now
		? ProjectVisibility.SCHEDULED
		: ProjectVisibility.LIVE;
}

/** What the website may show: live, Published, publish date empty or past. */
export function publicProjectWhere(now = new Date()) {
	return {
		deletedAt: null,
		status: ProjectStatus.PUBLISHED,
		OR: [{ publishAt: null }, { publishAt: { lte: now } }]
	} satisfies Prisma.ProjectWhereInput;
}

function visibilityWhere(
	visibility: ProjectVisibility,
	now: Date
): Prisma.ProjectWhereInput {
	switch (visibility) {
		case ProjectVisibility.DRAFT:
			return { status: ProjectStatus.DRAFT };
		case ProjectVisibility.SCHEDULED:
			return { status: ProjectStatus.PUBLISHED, publishAt: { gt: now } };
		case ProjectVisibility.LIVE:
			return publicProjectWhere(now);
	}
}

function toListItem(
	project: ProjectRow,
	now = new Date()
): ProjectListItemResponse {
	return {
		uuid: project.uuid,
		slug: project.slug,
		name: project.name,
		sector: project.sector,
		serviceCategory: project.serviceCategory,
		year: project.year,
		status: project.status,
		visibility: visibilityOf(project, now),
		publishAt: project.publishAt?.toISOString() ?? null,
		featured: project.featured,
		featuredOrder: project.featuredOrder,
		showOnHome: project.showOnHome,
		homeOrder: project.homeOrder,
		coverUrl: mediaUrl(project.coverImage),
		updatedAt: project.updatedAt.toISOString(),
		updatedBy: toUserReference(project.updatedBy)
	};
}

async function toProjectResponse(
	project: ProjectRow
): Promise<ProjectResponse> {
	const images = await getProjectImages(project.id);

	return {
		...toListItem(project),
		...images,
		client: project.client,
		serviceSlug: project.serviceSlug,
		summary: project.summary,
		results: resultsOf(project.results),
		duration: project.duration,
		team: project.team,
		brief: project.brief,
		constraints: project.constraints,
		approach: project.approach,
		built: project.built,
		stack: project.stack,
		quote:
			project.quoteText && project.quoteAttribution
				? {
						text: project.quoteText,
						attribution: project.quoteAttribution
					}
				: null,
		firstPublishedAt: project.firstPublishedAt?.toISOString() ?? null,
		createdAt: project.createdAt.toISOString(),
		createdBy: toUserReference(project.createdBy)
	};
}

/** A live (not deleted) project by public id, or 404. */
async function findProject(uuid: string) {
	const project = await prisma.project.findFirst({
		where: { uuid, deletedAt: null },
		include: projectInclude
	});
	if (!project) throw HttpError.notFound('No such project.');

	return project;
}

/** Slugs stay reserved after a delete, so deleted projects count too. */
async function isSlugTaken(slug: string, exceptId?: number) {
	if (reservedProjectSlugs.includes(slug)) return true;

	const owner = await prisma.project.findUnique({
		where: { slug },
		select: { id: true }
	});

	return Boolean(owner && owner.id !== exceptId);
}

async function assertSlugFree(slug: string, exceptId?: number) {
	if (await isSlugTaken(slug, exceptId)) {
		throw HttpError.conflict(
			'That slug is taken — by another project, a deleted one, or a site route.'
		);
	}
}

type QuoteInput = CreateProjectInput['quote'];

function quoteColumns(quote: QuoteInput) {
	return quote === undefined
		? {}
		: {
				quoteText: quote?.text ?? null,
				quoteAttribution: quote?.attribution ?? null
			};
}

export async function listDashboardProjects(filters: ListProjectsFilters) {
	const now = new Date();
	const search: Prisma.ProjectWhereInput = filters.search
		? {
				OR: (['name', 'client', 'slug', 'summary'] as const).map(
					(field) => ({
						[field]: {
							contains: filters.search,
							mode: 'insensitive' as const
						}
					})
				)
			}
		: {};

	const projects = await prisma.project.findMany({
		where: {
			AND: [
				{ deletedAt: null },
				filters.sector ? { sector: filters.sector } : {},
				filters.visibility
					? visibilityWhere(filters.visibility, now)
					: {},
				search
			]
		},
		include: projectInclude,
		orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }]
	});

	return projects.map((project) => toListItem(project, now));
}

export async function getDashboardProject(uuid: string) {
	return toProjectResponse(await findProject(uuid));
}

/** A new Draft. Images are added once it exists. */
export async function addProject(
	actor: CurrentUser,
	input: CreateProjectInput
) {
	const { slug: requested, quote, ...fields } = input;
	if (requested) await assertSlugFree(requested);
	const slug =
		requested ??
		(await uniqueSlug(slugify(fields.name, 'project'), (candidate) =>
			isSlugTaken(candidate)
		));

	const project = await prisma.project.create({
		data: {
			...fields,
			slug,
			...quoteColumns(quote),
			status: ProjectStatus.DRAFT,
			createdById: actor.id,
			updatedById: actor.id
		},
		include: projectInclude
	});

	return toProjectResponse(project);
}

/**
 * Any fields, status and publish date. The first time a project is
 * published, `firstPublishedAt` is stamped and kept from then on.
 */
export async function editProject(
	actor: CurrentUser,
	uuid: string,
	input: UpdateProjectInput
) {
	const current = await findProject(uuid);
	const { quote, ...fields } = input;
	if (fields.slug !== undefined && fields.slug !== current.slug) {
		await assertSlugFree(fields.slug, current.id);
	}

	const firstPublish =
		fields.status === ProjectStatus.PUBLISHED && !current.firstPublishedAt;

	const project = await prisma.project.update({
		where: { id: current.id },
		data: {
			...fields,
			...quoteColumns(quote),
			...(firstPublish ? { firstPublishedAt: new Date() } : {}),
			updatedById: actor.id
		},
		include: projectInclude
	});
	revalidateSite(RevalidationTag.PROJECTS);

	return toProjectResponse(project);
}

/**
 * Soft delete — it leaves the dashboard and the website. Its slug stays
 * reserved and its images stay on record.
 */
export async function removeProject(actor: CurrentUser, uuid: string) {
	const current = await findProject(uuid);

	await prisma.project.update({
		where: { id: current.id },
		data: {
			deletedAt: new Date(),
			deletedById: actor.id,
			updatedById: actor.id
		}
	});
	revalidateSite(RevalidationTag.PROJECTS);
}
