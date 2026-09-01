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
