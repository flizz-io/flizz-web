import { visibilityOf } from './project-service.js';
import { revalidateSite } from './site-revalidation-service.js';
import { prisma } from '../configs/database.js';
import { RevalidationTag } from '../enums/revalidation-tag.js';
import type { Prisma } from '../generated/prisma/client.js';
import { PublishStatus } from '../generated/prisma/enums.js';
import type {
	CreateTestimonialInput,
	ListTestimonialsFilters,
	ReorderTestimonialsInput,
	UpdateTestimonialInput
} from '../schemas/testimonial-schema.js';
import type {
	TestimonialListItemResponse,
	TestimonialProjectReference,
	TestimonialResponse
} from '../types/testimonial.js';
import type { CurrentUser } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { toUserReference } from '../utils/user-display.js';

const referenceFields = {
	select: { uuid: true, email: true, firstName: true, lastName: true }
} as const;

export const projectFields = {
	select: {
		uuid: true,
		name: true,
		slug: true,
		status: true,
		publishAt: true,
		deletedAt: true
	}
} as const;

const listInclude = {
	updatedBy: referenceFields,
	project: projectFields
} satisfies Prisma.TestimonialInclude;

const testimonialInclude = {
	...listInclude,
	createdBy: referenceFields
} satisfies Prisma.TestimonialInclude;

type TestimonialListRow = Prisma.TestimonialGetPayload<{
	include: typeof listInclude;
}>;
type TestimonialRow = Prisma.TestimonialGetPayload<{
	include: typeof testimonialInclude;
}>;
type ProjectRow = NonNullable<TestimonialListRow['project']>;

/** Dashboard and public order. */
export const testimonialOrderBy = [
	{ displayOrder: 'asc' },
	{ id: 'asc' }
] satisfies Prisma.TestimonialOrderByWithRelationInput[];

/** What the website may show: not deleted, Published. */
export const publicTestimonialWhere = {
	deletedAt: null,
	status: PublishStatus.PUBLISHED
} satisfies Prisma.TestimonialWhereInput;

/** A deleted project reads as unlinked — its link can never show again. */
function toProjectReference(
	project: ProjectRow | null,
	now: Date
): TestimonialProjectReference | null {
	if (!project || project.deletedAt) return null;

	return {
		uuid: project.uuid,
		name: project.name,
		slug: project.slug,
		visibility: visibilityOf(project, now)
	};
}

function toListItem(
	testimonial: TestimonialListRow,
	now = new Date()
): TestimonialListItemResponse {
	return {
		uuid: testimonial.uuid,
		quote: testimonial.quote,
		highlights: testimonial.highlights,
		authorName: testimonial.authorName,
		authorRole: testimonial.authorRole,
		project: toProjectReference(testimonial.project, now),
		displayOrder: testimonial.displayOrder,
		status: testimonial.status,
		updatedAt: testimonial.updatedAt.toISOString(),
		updatedBy: toUserReference(testimonial.updatedBy)
	};
}

function toTestimonialResponse(
	testimonial: TestimonialRow
): TestimonialResponse {
	return {
		...toListItem(testimonial),
		createdAt: testimonial.createdAt.toISOString(),
		createdBy: toUserReference(testimonial.createdBy)
	};
}

/** A live (not deleted) testimonial by public id, or 404. */
async function findTestimonial(uuid: string) {
	const testimonial = await prisma.testimonial.findFirst({
		where: { uuid, deletedAt: null },
		include: testimonialInclude
	});
	if (!testimonial) throw HttpError.notFound('No such testimonial.');

	return testimonial;
}

/**
 * Every highlight must be a phrase of the quote — matched ignoring case, as
 * the site lights it. Checked against what's being saved, so editing only
 * the quote can't strand a phrase.
 */
function assertHighlightsInQuote(quote: string, highlights: string[]) {
	const text = quote.toLowerCase();
	const missing = highlights.filter(
		(phrase) => !text.includes(phrase.toLowerCase())
	);
	if (missing.length) {
		throw HttpError.badRequest(
			'Highlights must be phrases from the quote.',
			missing.map((phrase) => ({
				field: 'highlights',
				message: `"${phrase}" isn't in the quote.`
			}))
		);
	}
}

/** `undefined` → leave as is; `null` → unlink; a uuid → that live project. */
async function projectIdOf(projectUuid: string | null | undefined) {
	if (projectUuid === undefined || projectUuid === null) return projectUuid;

	const project = await prisma.project.findFirst({
		where: { uuid: projectUuid, deletedAt: null },
		select: { id: true }
	});
	if (!project) {
		throw HttpError.badRequest('That project no longer exists.', [
			{ field: 'projectUuid', message: 'Choose another project.' }
		]);
	}

	return project.id;
}

export async function listDashboardTestimonials(
	filters: ListTestimonialsFilters
) {
	const search: Prisma.TestimonialWhereInput = filters.search
		? {
				OR: (['quote', 'authorName', 'authorRole'] as const).map(
					(field) => ({
						[field]: {
							contains: filters.search,
							mode: 'insensitive' as const
						}
					})
				)
			}
		: {};

	const testimonials = await prisma.testimonial.findMany({
		where: {
			AND: [
				{ deletedAt: null },
				filters.status ? { status: filters.status } : {},
				search
			]
		},
		include: listInclude,
		orderBy: testimonialOrderBy
	});
	const now = new Date();

	return testimonials.map((testimonial) => toListItem(testimonial, now));
}

/** The form's Project dropdown — every non-deleted project. */
export async function listTestimonialProjectOptions(): Promise<
	TestimonialProjectReference[]
> {
	const projects = await prisma.project.findMany({
		where: { deletedAt: null },
		select: projectFields.select,
		orderBy: [{ name: 'asc' }]
	});
	const now = new Date();

	return projects.flatMap((project) => {
		const reference = toProjectReference(project, now);

		return reference ? [reference] : [];
	});
}

export async function getDashboardTestimonial(uuid: string) {
	return toTestimonialResponse(await findTestimonial(uuid));
}

/** A new Draft, last in the list. */
export async function addTestimonial(
	actor: CurrentUser,
	input: CreateTestimonialInput
) {
	const { projectUuid, highlights = [], ...fields } = input;
	assertHighlightsInQuote(fields.quote, highlights);
	const projectId = await projectIdOf(projectUuid);
	const last = await prisma.testimonial.aggregate({
		where: { deletedAt: null },
		_max: { displayOrder: true }
	});

	const testimonial = await prisma.testimonial.create({
		data: {
			...fields,
			highlights,
			projectId: projectId ?? null,
			displayOrder: (last._max.displayOrder ?? -1) + 1,
			status: PublishStatus.DRAFT,
			createdById: actor.id,
			updatedById: actor.id
		},
		include: testimonialInclude
	});
	revalidateSite(RevalidationTag.TESTIMONIALS);

	return toTestimonialResponse(testimonial);
}

/** Any fields and status. */
export async function editTestimonial(
	actor: CurrentUser,
	uuid: string,
	input: UpdateTestimonialInput
) {
	const current = await findTestimonial(uuid);
	const { projectUuid, ...fields } = input;
	assertHighlightsInQuote(
		fields.quote ?? current.quote,
		fields.highlights ?? current.highlights
	);
	const projectId = await projectIdOf(projectUuid);

	const testimonial = await prisma.testimonial.update({
		where: { id: current.id },
		data: { ...fields, projectId, updatedById: actor.id },
		include: testimonialInclude
	});
	revalidateSite(RevalidationTag.TESTIMONIALS);

	return toTestimonialResponse(testimonial);
}

/** Soft delete — nothing links to a testimonial, so it's never blocked. */
export async function removeTestimonial(actor: CurrentUser, uuid: string) {
	const current = await findTestimonial(uuid);

	await prisma.testimonial.update({
		where: { id: current.id },
		data: {
			deletedAt: new Date(),
			deletedById: actor.id,
			updatedById: actor.id
		}
	});
	revalidateSite(RevalidationTag.TESTIMONIALS);
}

/** The list's new order. A list that's out of date gets 409. */
export async function reorderTestimonials(
	actor: CurrentUser,
	input: ReorderTestimonialsInput
) {
	const testimonials = await prisma.testimonial.findMany({
		where: { deletedAt: null },
		select: { id: true, uuid: true }
	});
	const idByUuid = new Map(testimonials.map((row) => [row.uuid, row.id]));
	const complete =
		input.testimonialUuids.length === testimonials.length &&
		new Set(input.testimonialUuids).size === testimonials.length &&
		input.testimonialUuids.every((uuid) => idByUuid.has(uuid));
	if (!complete) {
		throw HttpError.conflict(
			'The testimonials have changed — reload and try again.'
		);
	}

	await prisma.$transaction(
		input.testimonialUuids.map((uuid, position) =>
			prisma.testimonial.update({
				where: { id: idByUuid.get(uuid) },
				data: { displayOrder: position, updatedById: actor.id }
			})
		)
	);
	revalidateSite(RevalidationTag.TESTIMONIALS);

	return listDashboardTestimonials({});
}
