/** What an article is about. Values are the display labels. */
export enum ArticleCategory {
	ENGINEERING = 'Engineering',
	PRODUCT = 'Product',
	AI = 'AI',
	PRACTICE = 'Practice'
}

/**
 * How an article is attributed. Both of the first two are built; the choice is
 * deferred to the PM, so this picks which renders rather than which exists.
 */
export enum ArticleByline {
	/** Named person from the About roster. */
	AUTHOR = 'author',
	/** Published by Flizz, nobody named. */
	COMPANY = 'company',
	/** Date and reading time only. */
	NONE = 'none'
}

/** Ordering options on the articles index. Values double as URL parameters. */
export enum ArticleSort {
	NEWEST = 'newest',
	OLDEST = 'oldest',
	LONGEST = 'longest',
	SHORTEST = 'shortest'
}

export const articleSortLabels: Record<ArticleSort, string> = {
	[ArticleSort.NEWEST]: 'Newest first',
	[ArticleSort.OLDEST]: 'Oldest first',
	[ArticleSort.LONGEST]: 'Longest read',
	[ArticleSort.SHORTEST]: 'Shortest read'
};

/** Query-string keys, so the hook and any link building agree on them. */
export enum ArticleFilterParam {
	QUERY = 'q',
	CATEGORY = 'category',
	TAG = 'tag',
	SORT = 'sort'
}
