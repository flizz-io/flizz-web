/**
 * Tags on the API data the pages are built from. The API asks
 * `POST /api/revalidate` to expire one after a change, so the pages rebuild
 * within seconds instead of on the next deploy. Same values as the API's
 * `revalidationTags`.
 */
export enum CacheTag {
	PROJECTS = 'projects',
	TEAM = 'team'
}

/**
 * The backstop: pages refetch at most this often even without a nudge — so a
 * project scheduled for later goes live without anyone saving it.
 */
export const contentRevalidateSeconds = 300;
