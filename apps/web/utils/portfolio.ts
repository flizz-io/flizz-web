import { services } from '@/constants/services';
import { projectSectorOrder } from '@/enums/portfolio';
import type { Project } from '@/types/portfolio';
import type { ServiceDetail } from '@/types/services';

/**
 * The service a project is evidence for. Matched by slug, so a service removed
 * from the catalogue drops the cross-link rather than erroring — check both
 * together when either changes.
 */
export function getProjectService(project: Project): ServiceDetail | undefined {
	return services.find((service) => service.slug === project.serviceSlug);
}

/**
 * What the reel plays: featured projects sector by sector, so it runs as
 * chapters rather than unrelated frames. Inside a chapter the dashboard's
 * featured order holds — the API returns featured work in that order.
 */
export function reelOf(projects: Project[]): Project[] {
	return projectSectorOrder.flatMap((sector) =>
		projects.filter(
			(project) => project.featured && project.sector === sector
		)
	);
}

/** Where each chapter of the reel opens, for the scrubber's grouping. */
export function reelChapters(reel: Project[]) {
	return projectSectorOrder
		.map((sector) => ({
			sector,
			start: reel.findIndex((project) => project.sector === sector),
			items: reel
				.map((project, index) => ({ project, index }))
				.filter((entry) => entry.project.sector === sector)
		}))
		.filter((chapter) => chapter.items.length > 0);
}

/** Everything the reel does not carry, newest first. */
export function archiveOf(projects: Project[]): Project[] {
	return projects
		.filter((project) => !project.featured)
		.sort((a, b) => b.year.localeCompare(a.year));
}

/** The earliest year in the portfolio, or '' when it's empty. */
export function sinceYearOf(projects: Project[]) {
	return projects.reduce(
		(earliest, project) =>
			project.year < earliest ? project.year : earliest,
		projects[0]?.year ?? ''
	);
}

/**
 * How the index describes its own remit — "10 projects · 2021 to 2025".
 * Derived so the count and the span can't drift from the portfolio.
 */
export function portfolioMetaOf(projects: Project[]) {
	const latest = projects.reduce(
		(year, project) => (project.year > year ? project.year : year),
		projects[0]?.year ?? ''
	);

	return `${projects.length} projects · ${sinceYearOf(projects)} to ${latest}`;
}

/** Sectors with work in them, in display order, with their counts. */
export function sectorCountsOf(projects: Project[]) {
	return projectSectorOrder
		.map((sector) => ({
			sector,
			count: projects.filter((project) => project.sector === sector)
				.length
		}))
		.filter(({ count }) => count > 0);
}
