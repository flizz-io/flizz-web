import { ProjectVisibility } from './projects';

/** Mirrors the API's `ArticleCategory` — keys; display labels live in the apps. */
export enum ArticleCategory {
	ENGINEERING = 'ENGINEERING',
	PRODUCT = 'PRODUCT',
	AI = 'AI',
	PRACTICE = 'PRACTICE'
}

/**
 * Whether an article shows on the website, derived by the API: Draft,
 * Scheduled (Published, publish date ahead) or Live. The same three values as
 * projects, so it *is* that enum — one badge and one set of labels serve both.
 */
export const ArticleVisibility = ProjectVisibility;
export type ArticleVisibility = ProjectVisibility;

/** Order of the public list — by public date. */
export enum ArticleSortOrder {
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

/** The body block types — the `type` of each `ArticleBlock`. */
export enum ArticleBlockType {
	PARAGRAPH = 'paragraph',
	HEADING = 'heading',
	LIST = 'list',
	QUOTE = 'quote',
	CODE = 'code',
	IMAGE = 'image'
}

/** Frame shapes an image block may ask for. */
export enum ArticleImageAspect {
	WIDE = '16/9',
	STANDARD = '4/3',
	SQUARE = '1/1'
}
