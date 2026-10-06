import {
	authorWhere,
	blocksOf,
	publicArticleWhere,
	publicDateOf,
	resolveBlocks
} from './article-service.js';
import { findRedirectTarget } from './slug-redirect-service.js';
import { prisma } from '../configs/database.js';
import { ArticleSort } from '../enums/article-sort.js';
import type { Prisma } from '../generated/prisma/client.js';
import { SlugEntityType } from '../generated/prisma/enums.js';
import type { ListPublicArticlesFilters } from '../schemas/article-schema.js';
import type {
	PublicArticleAuthorResponse,
	PublicArticleBlockResponse,
	PublicArticleDetailResponse,
	PublicArticleResponse
} from '../types/article.js';
import type { PublicSlugRedirectResponse } from '../types/service.js';
import { HttpError } from '../utils/http-error.js';
import { avatarUrlOf, mediaUrl } from '../utils/media-url.js';
import { readingMinutesOf } from '../utils/reading-time.js';

const cardInclude = {
	coverImage: true,
	author: { include: { photo: true } }
} satisfies Prisma.ArticleInclude;

const detailInclude = {
	...cardInclude,
	ogImage: true
} satisfies Prisma.ArticleInclude;

type PublicCardRow = Prisma.ArticleGetPayload<{ include: typeof cardInclude }>;
type PublicDetailRow = Prisma.ArticleGetPayload<{
	include: typeof detailInclude;
}>;
type AuthorRow = NonNullable<PublicCardRow['author']>;

/**
 * The byline — only while the author is still on the About page and has a
 * name; otherwise the site falls back to the company byline.
 */
function toPublicAuthor(
	author: AuthorRow | null
): PublicArticleAuthorResponse | null {
	if (
		!author ||
		!author.showOnWebsite ||
		author.status !== authorWhere.status ||
		author.deletedAt
	) {
		return null;
	}
	const name = [author.firstName, author.lastName].filter(Boolean).join(' ');
	if (!name) return null;
	const photo = avatarUrlOf(author);
	const links = Object.fromEntries(
		Object.entries({
			linkedin: author.linkedinUrl,
			x: author.xUrl,
			portfolio: author.portfolioUrl
		}).filter(([, href]) => Boolean(href))
	);

	return {
		name,
		role: author.designation ?? '',
		...(photo ? { photo } : {}),
		links
	};
}

/** The `Article` contract — optional keys left out, never `null`. */
function toPublicArticle(article: PublicCardRow): PublicArticleResponse {
	const author = toPublicAuthor(article.author);
	const cover = mediaUrl(article.coverImage);
	// Visible articles are published, so one of the two is always set.
	const publishedAt = publicDateOf(article) ?? article.createdAt;

	return {
		slug: article.slug,
		title: article.title,
		excerpt: article.excerpt,
		category: article.category,
		tags: article.tags,
		publishedAt: publishedAt.toISOString(),
		updatedAt: article.updatedAt.toISOString(),
		...(author ? { author } : {}),
		...(cover ? { coverImage: cover } : {}),
		readingMinutes: readingMinutesOf(blocksOf(article.body))
	};
}

/** Public blocks carry the image URL, never the media id. */
function toPublicBlocks(
	blocks: Awaited<ReturnType<typeof resolveBlocks>>
): PublicArticleBlockResponse[] {
	return blocks.map((block) => {
		if (block.type !== 'image') return block;

		return {
			type: block.type,
			alt: block.alt,
			...(block.caption ? { caption: block.caption } : {}),
			...(block.aspect ? { aspect: block.aspect } : {}),
			...(block.src ? { src: block.src } : {})
		};
	});
}

async function toPublicDetail(
	article: PublicDetailRow
): Promise<PublicArticleDetailResponse> {
	const ogImage = mediaUrl(article.ogImage);

	return {
		...toPublicArticle(article),
		body: toPublicBlocks(await resolveBlocks(blocksOf(article.body))),
		...(article.seoTitle ? { seoTitle: article.seoTitle } : {}),
		...(article.seoDescription
			? { seoDescription: article.seoDescription }
			: {}),
		...(ogImage ? { ogImage } : {}),
		...(article.noindex ? { noindex: true as const } : {})
	};
}

function matchesFilters(
	article: PublicArticleResponse,
	filters: ListPublicArticlesFilters
) {
	const tag = filters.tag?.toLowerCase();
	const search = filters.search?.toLowerCase();

	return (
		(!filters.category || article.category === filters.category) &&
		(!tag || article.tags.some((entry) => entry.toLowerCase() === tag)) &&
		(!search ||
			[article.title, article.excerpt, ...article.tags].some((text) =>
				text.toLowerCase().includes(search)
			))
	);
}

/**
 * Every visible article, newest first unless asked otherwise. Ordered and
 * filtered here rather than in SQL: the public date is `publish_at ??
 * first_published_at`, and the roster is small.
 */
export async function listPublicArticles(
	filters: ListPublicArticlesFilters = {}
): Promise<PublicArticleResponse[]> {
	const articles = await prisma.article.findMany({
		where: publicArticleWhere(),
		include: cardInclude
	});
	const direction = filters.sort === ArticleSort.OLDEST ? 1 : -1;

	return articles
		.map(toPublicArticle)
		.filter((article) => matchesFilters(article, filters))
		.sort((a, b) => direction * a.publishedAt.localeCompare(b.publishedAt));
}

/** One visible article with its body — 404 otherwise. */
export async function getPublicArticle(
	slug: string
): Promise<PublicArticleDetailResponse> {
	const article = await prisma.article.findFirst({
		where: { ...publicArticleWhere(), slug },
		include: detailInclude
	});
	if (!article) throw HttpError.notFound('No such article.');

	return toPublicDetail(article);
}

/** Where an old slug went — only to an article the site shows. */
export async function getArticleRedirect(
	oldSlug: string
): Promise<PublicSlugRedirectResponse> {
	const id = await findRedirectTarget(SlugEntityType.ARTICLE, oldSlug);
	const article =
		id === null
			? null
			: await prisma.article.findFirst({
					where: { ...publicArticleWhere(), id },
					select: { slug: true }
				});
	if (!article) throw HttpError.notFound('No such article.');

	return { slug: article.slug };
}
