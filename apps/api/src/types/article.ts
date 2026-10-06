import type { ImageResponse } from './project.js';
import type { UserReference } from './team.js';
import type { ArticleVisibility } from '../enums/article-visibility.js';
import type {
	ArticleCategory,
	PublishStatus
} from '../generated/prisma/enums.js';
import type { ArticleBlock } from '../schemas/article-schema.js';

/**
 * A body block as responses carry it: image blocks gain the `src` their
 * `mediaUuid` resolves to (left out while the upload is missing).
 */
export type ArticleBlockResponse =
	| Exclude<ArticleBlock, { type: 'image' }>
	| (Extract<ArticleBlock, { type: 'image' }> & { src?: string });

/** Public blocks never expose the media id. */
export type PublicArticleBlockResponse =
	| Exclude<ArticleBlock, { type: 'image' }>
	| (Omit<Extract<ArticleBlock, { type: 'image' }>, 'mediaUuid'> & {
			src?: string;
	  });

/** A body image as the editor gets it back from an upload. */
export type ArticleBodyImageResponse = ImageResponse;

/** An article's cover and share image, as the media endpoints return them. */
export interface ArticleMediaResponse {
	cover: ImageResponse | null;
	ogImage: ImageResponse | null;
}

/** A row on the dashboard Articles list. */
export interface ArticleListItemResponse {
	uuid: string;
	slug: string;
	title: string;
	category: ArticleCategory;
	tags: string[];
	status: PublishStatus;
	visibility: ArticleVisibility;
	publishAt: string | null;
	/** The public date — `publishAt ?? firstPublishedAt`; null until published. */
	publishedAt: string | null;
	coverUrl: string | null;
	author: UserReference | null;
	updatedAt: string;
	updatedBy: UserReference | null;
}

export interface ArticleResponse
	extends ArticleListItemResponse, ArticleMediaResponse {
	excerpt: string;
	body: ArticleBlockResponse[];
	seoTitle: string | null;
	seoDescription: string | null;
	noindex: boolean;
	firstPublishedAt: string | null;
	createdAt: string;
	createdBy: UserReference | null;
}

/** Someone who can be an article's author — a user shown on the website. */
export interface ArticleAuthorOptionResponse {
	uuid: string;
	name: string;
	designation: string | null;
}

/** A tag in use, for the form's suggestions. */
export interface ArticleTagResponse {
	tag: string;
	count: number;
}

/** The byline on the website. Links left out when unset. */
export interface PublicArticleAuthorResponse {
	name: string;
	role: string;
	photo?: string;
	links: { linkedin?: string; x?: string; portfolio?: string };
}

/** A card on the list page, related rows and static params. */
export interface PublicArticleResponse {
	slug: string;
	title: string;
	excerpt: string;
	category: ArticleCategory;
	tags: string[];
	/** ISO date-time. The list is ordered by it. */
	publishedAt: string;
	/** ISO date-time — `dateModified` and the sitemap. */
	updatedAt: string;
	author?: PublicArticleAuthorResponse;
	coverImage?: string;
	/** Computed from the body on every read, never stored. */
	readingMinutes: number;
}

export interface PublicArticleDetailResponse extends PublicArticleResponse {
	body: PublicArticleBlockResponse[];
	seoTitle?: string;
	seoDescription?: string;
	ogImage?: string;
	noindex?: true;
}
