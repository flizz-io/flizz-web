import type { ArticleCategory } from '@/enums/articles';
import type { TeamMemberLinks } from '@/types/about';
import type { PublicArticleBlock } from '@workspace/api-services';

/**
 * One unit of article body — the API's JSON, as stored. A discriminated union
 * rather than HTML, so the renderer's switch is exhaustive over it.
 */
export type ArticleBlock = PublicArticleBlock;

/** The named byline — someone from the About page roster. */
export interface ArticleAuthor {
	name: string;
	role: string;
	photo?: string;
	links: TeamMemberLinks;
}

/** A list row, related row or static param — everything but the body. */
export interface Article {
	/** Route segment: /articles/[slug]. */
	slug: string;
	title: string;
	/** One or two lines. Carries the list entry and the meta description. */
	excerpt: string;
	category: ArticleCategory;
	/**
	 * Open vocabulary, unlike `category`. Categories are a fixed taxonomy the
	 * site is organised by; tags describe an individual piece and can be added
	 * freely without a schema change.
	 */
	tags: string[];
	/** ISO date-time. The list is ordered by this. */
	publishedAt: string;
	/** ISO date-time — `article:modified_time` and `dateModified`. */
	updatedAt: string;
	/** Absent → the company byline. */
	author?: ArticleAuthor;
	/**
	 * Path to a real cover image. Unfilled slots render the registration marks
	 * used elsewhere on the site rather than invented art.
	 */
	coverImage?: string;
	/** Computed by the API from the body on every read, never stored. */
	readingMinutes: number;
}

/** The detail page — the body plus its search and share overrides. */
export interface ArticleDetail extends Article {
	body: ArticleBlock[];
	seoTitle?: string;
	seoDescription?: string;
	/** An uploaded share image, used before the cover and the generated card. */
	ogImage?: string;
	noindex?: boolean;
}
