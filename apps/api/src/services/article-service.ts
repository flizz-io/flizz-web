import { bodyImagesByUuid, toImageResponse } from './article-media-service.js';
import { revalidateSite } from './site-revalidation-service.js';
import { isRedirectSlug, recordSlugChange } from './slug-redirect-service.js';
import { prisma } from '../configs/database.js';
import { ArticleVisibility } from '../enums/article-visibility.js';
import { RevalidationTag } from '../enums/revalidation-tag.js';
import type { Prisma } from '../generated/prisma/client.js';
import {
	PublishStatus,
	SlugEntityType,
	UserStatus
} from '../generated/prisma/enums.js';
import {
	articleBodySchema,
	type ArticleBlock,
	type CreateArticleInput,
	type ListArticlesFilters,
	type UpdateArticleInput
} from '../schemas/article-schema.js';
import type {
	ArticleAuthorOptionResponse,
	ArticleBlockResponse,
	ArticleListItemResponse,
	ArticleResponse,
	ArticleTagResponse
} from '../types/article.js';
import type { CurrentUser } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { mediaUrl } from '../utils/media-url.js';
import { slugify, uniqueSlug } from '../utils/slug.js';
import { displayName, toUserReference } from '../utils/user-display.js';

const referenceFields = {
	select: { uuid: true, email: true, firstName: true, lastName: true }
} as const;

const listInclude = {
	coverImage: true,
	author: referenceFields,
	updatedBy: referenceFields
} satisfies Prisma.ArticleInclude;

const articleInclude = {
	...listInclude,
	ogImage: true,
	createdBy: referenceFields
} satisfies Prisma.ArticleInclude;

type ArticleListRow = Prisma.ArticleGetPayload<{
	include: typeof listInclude;
}>;
type ArticleRow = Prisma.ArticleGetPayload<{ include: typeof articleInclude }>;

/** Who may be bylined: shown on the About page, active, not removed. */
export const authorWhere = {
	showOnWebsite: true,
	status: UserStatus.ACTIVE,
	deletedAt: null
} satisfies Prisma.UserWhereInput;

/** What the website may show: live, Published, publish date empty or past. */
export function publicArticleWhere(now = new Date()) {
	return {
		deletedAt: null,
		status: PublishStatus.PUBLISHED,
		OR: [{ publishAt: null }, { publishAt: { lte: now } }]
	} satisfies Prisma.ArticleWhereInput;
}

export function visibilityOf(
	article: { status: PublishStatus; publishAt: Date | null },
	now = new Date()
) {
	if (article.status === PublishStatus.DRAFT) return ArticleVisibility.DRAFT;

	return article.publishAt && article.publishAt > now
		? ArticleVisibility.SCHEDULED
		: ArticleVisibility.LIVE;
}

function visibilityWhere(
	visibility: ArticleVisibility,
	now: Date
): Prisma.ArticleWhereInput {
	switch (visibility) {
		case ArticleVisibility.DRAFT:
			return { status: PublishStatus.DRAFT };
		case ArticleVisibility.SCHEDULED:
			return { status: PublishStatus.PUBLISHED, publishAt: { gt: now } };
		case ArticleVisibility.LIVE:
			return publicArticleWhere(now);
	}
}

/** The date the site shows: the publish date, else when it first went live. */
export function publicDateOf(article: {
	publishAt: Date | null;
	firstPublishedAt: Date | null;
}) {
	return article.publishAt ?? article.firstPublishedAt;
}

/** `body` is JSONB — read it back through the same shape it was saved as. */
export function blocksOf(json: Prisma.JsonValue): ArticleBlock[] {
	const parsed = articleBodySchema.safeParse(json);

	return parsed.success ? parsed.data : [];
}

function imageUuidsOf(blocks: ArticleBlock[]) {
	return blocks.flatMap((block) =>
		block.type === 'image' && block.mediaUuid ? [block.mediaUuid] : []
	);
}

/** Image blocks gain the URL their upload resolves to. */
export async function resolveBlocks(
	blocks: ArticleBlock[]
): Promise<ArticleBlockResponse[]> {
	const images = await bodyImagesByUuid(imageUuidsOf(blocks));

	return blocks.map((block) => {
		if (block.type !== 'image' || !block.mediaUuid) return block;
		const image = images.get(block.mediaUuid);

		return image ? { ...block, src: image.url } : block;
	});
}

/** Refuses a body that points at an image that isn't a live body upload. */
async function assertBodyImages(blocks: ArticleBlock[]) {
	const uuids = imageUuidsOf(blocks);
	const images = await bodyImagesByUuid(uuids);
	const missing = uuids.findIndex((uuid) => !images.has(uuid));
	if (missing !== -1) {
		throw HttpError.badRequest(
			'An image block points at an upload that no longer exists — upload it again.'
		);
	}
}

function toListItem(
	article: ArticleListRow,
	now = new Date()
): ArticleListItemResponse {
	return {
		uuid: article.uuid,
		slug: article.slug,
		title: article.title,
		category: article.category,
		tags: article.tags,
		status: article.status,
		visibility: visibilityOf(article, now),
		publishAt: article.publishAt?.toISOString() ?? null,
		publishedAt: publicDateOf(article)?.toISOString() ?? null,
		coverUrl: mediaUrl(article.coverImage),
		author: toUserReference(article.author),
		updatedAt: article.updatedAt.toISOString(),
		updatedBy: toUserReference(article.updatedBy)
	};
}

async function toArticleResponse(
	article: ArticleRow
): Promise<ArticleResponse> {
	return {
		...toListItem(article),
		excerpt: article.excerpt,
		body: await resolveBlocks(blocksOf(article.body)),
		cover: toImageResponse(article.coverImage),
		ogImage: toImageResponse(article.ogImage),
		seoTitle: article.seoTitle,
		seoDescription: article.seoDescription,
		noindex: article.noindex,
		firstPublishedAt: article.firstPublishedAt?.toISOString() ?? null,
		createdAt: article.createdAt.toISOString(),
		createdBy: toUserReference(article.createdBy)
	};
}

/** A live (not deleted) article by public id, or 404. */
async function findArticle(uuid: string) {
	const article = await prisma.article.findFirst({
		where: { uuid, deletedAt: null },
		include: articleInclude
	});
	if (!article) throw HttpError.notFound('No such article.');

	return article;
}

/** Deleted articles and old slugs keep theirs, so both count as taken. */
async function isSlugTaken(slug: string, exceptId?: number) {
	const owner = await prisma.article.findUnique({
		where: { slug },
		select: { id: true }
	});
	if (owner && owner.id !== exceptId) return true;

	return isRedirectSlug(SlugEntityType.ARTICLE, slug, exceptId);
}

async function assertSlugFree(slug: string, exceptId?: number) {
	if (await isSlugTaken(slug, exceptId)) {
		throw HttpError.conflict(
			'That slug is taken — by another article, a deleted one, or an old link.'
		);
	}
}

/** `undefined` leaves the author as is; `null` clears it. */
async function authorIdOf(authorUuid: string | null | undefined) {
	if (authorUuid === undefined) return undefined;
	if (authorUuid === null) return null;

	const author = await prisma.user.findFirst({
		where: { ...authorWhere, uuid: authorUuid },
		select: { id: true }
	});
	if (!author) {
		throw HttpError.badRequest(
			'The author must be someone shown on the website (Team → Show on website).'
		);
	}

	return author.id;
}

export async function listDashboardArticles(filters: ListArticlesFilters) {
	const now = new Date();
	const search: Prisma.ArticleWhereInput = filters.search
		? {
				OR: [
					...(['title', 'slug', 'excerpt'] as const).map((field) => ({
						[field]: {
							contains: filters.search,
							mode: 'insensitive' as const
						}
					})),
					{ tags: { has: filters.search } }
				]
			}
		: {};

	const articles = await prisma.article.findMany({
		where: {
			AND: [
				{ deletedAt: null },
				filters.category ? { category: filters.category } : {},
				filters.visibility
					? visibilityWhere(filters.visibility, now)
					: {},
				search
			]
		},
		include: listInclude,
		orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
	});

	// Newest public date first; unpublished ones (no date) lead, newest created first.
	return articles
		.map((article) => toListItem(article, now))
		.sort(
			(a, b) =>
				Number(Boolean(a.publishedAt)) -
					Number(Boolean(b.publishedAt)) ||
				(b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
		);
}

/** Every tag in use on a non-deleted article, most used first. */
export async function listArticleTags(): Promise<ArticleTagResponse[]> {
	const rows = await prisma.article.findMany({
		where: { deletedAt: null },
		select: { tags: true }
	});
	const counts = new Map<string, number>();
	for (const tag of rows.flatMap((row) => row.tags)) {
		counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}

	return [...counts]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** The author dropdown — people shown on the website, in About page order. */
export async function listArticleAuthors(): Promise<
	ArticleAuthorOptionResponse[]
> {
	const users = await prisma.user.findMany({
		where: authorWhere,
		select: {
			uuid: true,
			email: true,
			firstName: true,
			lastName: true,
			designation: true
		},
		orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }]
	});

	return users.map((user) => ({
		uuid: user.uuid,
		name: displayName(user),
		designation: user.designation
	}));
}

export async function getDashboardArticle(uuid: string) {
	return toArticleResponse(await findArticle(uuid));
}

/** A new Draft. The cover and share image are added once it exists. */
export async function addArticle(
	actor: CurrentUser,
	input: CreateArticleInput
) {
	const { slug: requested, authorUuid, ...fields } = input;
	if (requested) await assertSlugFree(requested);
	await assertBodyImages(fields.body);
	const authorId = await authorIdOf(authorUuid);
	const slug =
		requested ??
		(await uniqueSlug(slugify(fields.title, 'article'), (candidate) =>
			isSlugTaken(candidate)
		));

	const article = await prisma.article.create({
		data: {
			...fields,
			slug,
			authorId,
			status: PublishStatus.DRAFT,
			createdById: actor.id,
			updatedById: actor.id
		},
		include: articleInclude
	});

	return toArticleResponse(article);
}

/**
 * Any fields, status and publish date. A new slug leaves the old one
 * redirecting; the first publish stamps `firstPublishedAt` for good.
 */
export async function editArticle(
	actor: CurrentUser,
	uuid: string,
	input: UpdateArticleInput
) {
	const current = await findArticle(uuid);
	const { authorUuid, ...fields } = input;
	const newSlug =
		fields.slug !== undefined && fields.slug !== current.slug
			? fields.slug
			: null;
	if (newSlug) await assertSlugFree(newSlug, current.id);
	if (fields.body) await assertBodyImages(fields.body);
	const authorId = await authorIdOf(authorUuid);
	const firstPublish =
		fields.status === PublishStatus.PUBLISHED && !current.firstPublishedAt;

	const article = await prisma.$transaction(async (tx) => {
		if (newSlug) {
			await recordSlugChange(
				tx,
				actor,
				SlugEntityType.ARTICLE,
				current.id,
				current.slug,
				newSlug
			);
		}

		return tx.article.update({
			where: { id: current.id },
			data: {
				...fields,
				authorId,
				...(firstPublish ? { firstPublishedAt: new Date() } : {}),
				updatedById: actor.id
			},
			include: articleInclude
		});
	});
	revalidateSite(RevalidationTag.ARTICLES);

	return toArticleResponse(article);
}

/**
 * Soft delete — it leaves the dashboard and the website. Its slugs stay
 * reserved and its images stay on record.
 */
export async function removeArticle(actor: CurrentUser, uuid: string) {
	const current = await findArticle(uuid);

	await prisma.article.update({
		where: { id: current.id },
		data: {
			deletedAt: new Date(),
			deletedById: actor.id,
			updatedById: actor.id
		}
	});
	revalidateSite(RevalidationTag.ARTICLES);
}
