import type { ArticleCategory } from '@/enums/articles';

/**
 * One unit of article body. A discriminated union rather than HTML, matching
 * the project convention that rich text is persisted as JSON — so the renderer
 * written against this keeps working when the CRUD supplies the same shape.
 */
export type ArticleBlock =
	| { type: 'paragraph'; text: string }
	| { type: 'heading'; level: 2 | 3; text: string }
	| { type: 'list'; ordered?: boolean; items: string[] }
	| { type: 'quote'; text: string; attribution?: string }
	| { type: 'code'; language: string; code: string }
	| {
			type: 'image';
			/** Absent until real artwork lands; the slot renders as reserved. */
			src?: string;
			/** Always required — diagrams and GIFs carry meaning, not decoration. */
			alt: string;
			caption?: string;
			/** Frame shape. Diagrams are usually wider than they are tall. */
			aspect?: '16/9' | '4/3' | '1/1';
	  };

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
	/** ISO date. The list is ordered by this. */
	publishedAt: string;
	/** Matched by name against `aboutTeam`; unused when the byline is COMPANY. */
	author: string;
	body: ArticleBlock[];
	/**
	 * Path to a real cover image. Unfilled slots render the registration marks
	 * used elsewhere on the site rather than invented art.
	 */
	coverImage?: string;
}
