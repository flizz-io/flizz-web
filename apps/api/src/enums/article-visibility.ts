/**
 * Whether an article shows on the website — derived at read time, not stored:
 * Draft, Scheduled (Published with a future publish date) or Live. See
 * docs/requirements/articles-crud.md#visibility.
 */
export enum ArticleVisibility {
	DRAFT = 'DRAFT',
	SCHEDULED = 'SCHEDULED',
	LIVE = 'LIVE'
}
