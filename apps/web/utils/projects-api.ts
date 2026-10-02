import 'server-only';

import { CacheTag, contentRevalidateSeconds } from '@/constants/cache';
import { ProjectSector } from '@/enums/portfolio';
import { ServiceCategory } from '@/enums/services';
import type { Project, ProjectDetail } from '@/types/portfolio';
import {
	ApiError,
	getHomeProjectsService,
	getPublicProjectService,
	getPublicProjectsService,
	type ApiContext,
	type PublicProject,
	type PublicProjectDetail
} from '@workspace/api-services';

const NOT_FOUND_STATUS = 404;

/** Cached, tagged, and refreshed on the backstop interval. */
const projectsContext: ApiContext = {
	baseUrl: process.env.API_URL,
	init: {
		next: {
			revalidate: contentRevalidateSeconds,
			tags: [CacheTag.PROJECTS]
		}
	}
};

/**
 * The API sends enum keys (`OPERATIONS`); the site's enums share those keys
 * but carry display labels as values, so the label is one lookup away.
 */
function toProject(project: PublicProject): Project {
	return {
		...project,
		sector: ProjectSector[project.sector],
		service: ServiceCategory[project.service]
	};
}

function toProjectDetail(project: PublicProjectDetail): ProjectDetail {
	return { ...project, ...toProject(project) };
}

/** Every visible project — the index, the reel and the related rows. */
export async function getPortfolioProjects(): Promise<Project[]> {
	return (await getPublicProjectsService(projectsContext)).map(toProject);
}

/** The home strip, in the dashboard's home order. */
export async function getHomeProjects(): Promise<Project[]> {
	return (await getHomeProjectsService(projectsContext)).map(toProject);
}

/** One visible project, or `null` — drafts, scheduled and deleted included. */
export async function getPortfolioProject(
	slug: string
): Promise<ProjectDetail | null> {
	try {
		return toProjectDetail(
			await getPublicProjectService(slug, projectsContext)
		);
	} catch (error) {
		if (error instanceof ApiError && error.status === NOT_FOUND_STATUS) {
			return null;
		}
		throw error;
	}
}
