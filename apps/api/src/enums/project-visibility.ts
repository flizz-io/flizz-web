/**
 * Whether a project shows on the website — derived at read time, not stored:
 * Draft, Scheduled (Published with a future publish date) or Live. See
 * docs/requirements/projects-crud.md#visibility.
 */
export enum ProjectVisibility {
	DRAFT = 'DRAFT',
	SCHEDULED = 'SCHEDULED',
	LIVE = 'LIVE'
}
