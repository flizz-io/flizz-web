import 'server-only';

import { CacheTag, contentRevalidate } from '@/constants/cache';
import { ArticleCategory } from '@/enums/articles';
import type { Article, ArticleDetail } from '@/types/articles';
import {
	ApiError,
	getArticleRedirectService,
	getPublicArticleService,
	getPublicArticlesService,
	type ApiContext,
	type PublicArticle,
	type PublicArticleDetail
} from '@workspace/api-services';

const NOT_FOUND_STATUS = 404;

/**
 * Cached and tagged; refetched on an interval only if that's enabled. Also
 * tagged `team`, so a byline follows its author's profile and visibility.
 */
const articlesContext: ApiContext = {
	baseUrl: process.env.API_URL,
	init: {
		next: {
			revalidate: contentRevalidate,
			tags: [CacheTag.ARTICLES, CacheTag.TEAM]
		}
	}
};

/** `null` for a 404 — the caller decides what "not there" means. */
async function orNull<T>(call: Promise<T>): Promise<T | null> {
	try {
		return await call;
	} catch (error) {
		if (error instanceof ApiError && error.status === NOT_FOUND_STATUS) {
			return null;
		}
		throw error;
	}
}

/** The API sends the category key (`ENGINEERING`); the site's enum carries labels. */
function toArticle(article: PublicArticle): Article {
	return { ...article, category: ArticleCategory[article.category] };
}

function toArticleDetail(article: PublicArticleDetail): ArticleDetail {
	return { ...article, ...toArticle(article) };
}

/** Every visible article, newest first. */
export async function getPublishedArticles(): Promise<Article[]> {
	return (await getPublicArticlesService({}, articlesContext)).map(toArticle);
}

/** One visible article with its body, or `null`. */
export async function getPublishedArticle(
	slug: string
): Promise<ArticleDetail | null> {
	const article = await orNull(
		getPublicArticleService(slug, articlesContext)
	);

	return article ? toArticleDetail(article) : null;
}

/** The current slug of the article an old slug belonged to, or `null`. */
export async function getArticleRedirect(slug: string) {
	const redirect = await orNull(
		getArticleRedirectService(slug, articlesContext)
	);

	return redirect?.slug ?? null;
}
