/**
 * Tags on the API data the pages are built from. The API asks
 * `POST /api/revalidate` to expire one after a change, so the pages rebuild
 * within seconds instead of on the next deploy. Same values as the API's
 * `revalidationTags`.
 */
export enum CacheTag {
	PROJECTS = 'projects',
	SERVICES = 'services',
	TEAM = 'team'
}

/** How often pages refetch on their own, when periodic refresh is on. */
const periodicRevalidateSeconds = 300;

/**
 * Whether pages also refetch every five minutes without being asked —
 * `ENABLE_PERIODIC_REVALIDATION=true`. Off by default: pages then change only
 * when the API asks (`POST /api/revalidate`) or on the next deploy. Turn it
 * on if a project scheduled for later must go live without anyone saving it.
 * Read at build time — rebuild after changing it.
 */
export const contentRevalidate: number | false =
	process.env.ENABLE_PERIODIC_REVALIDATION === 'true'
		? periodicRevalidateSeconds
		: false;
