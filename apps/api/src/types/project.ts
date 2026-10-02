import type { UserReference } from './team.js';
import type { ProjectVisibility } from '../enums/project-visibility.js';
import type {
	ProjectSector,
	ProjectStatus,
	ServiceCategory
} from '../generated/prisma/enums.js';

/** An image as the dashboard sees it — URL resolved, with its size. */
export interface ImageResponse {
	/** The media file's public id. */
	uuid: string;
	url: string;
	width: number | null;
	height: number | null;
}

/** One gallery entry. `uuid` is the gallery entry's own id. */
export interface GalleryImageResponse extends ImageResponse {
	mediaUuid: string;
	caption: string | null;
	position: number;
}

/** A project's images, returned by every image endpoint. */
export interface ProjectImagesResponse {
	cover: ImageResponse | null;
	gallery: GalleryImageResponse[];
}

/** One measured change — `from` → `to`. The first is the headline. */
export interface ProjectResult {
	label: string;
	from: string;
	to: string;
}

export interface ProjectQuote {
	text: string;
	attribution: string;
}

/** A row on the dashboard Projects list. */
export interface ProjectListItemResponse {
	uuid: string;
	slug: string;
	name: string;
	sector: ProjectSector;
	serviceCategory: ServiceCategory;
	year: number;
	status: ProjectStatus;
	visibility: ProjectVisibility;
	publishAt: string | null;
	featured: boolean;
	featuredOrder: number;
	showOnHome: boolean;
	homeOrder: number;
	coverUrl: string | null;
	updatedAt: string;
	updatedBy: UserReference | null;
}

/** One project with every field, as the dashboard form edits it. */
export interface ProjectResponse
	extends ProjectListItemResponse, ProjectImagesResponse {
	client: string;
	serviceSlug: string;
	summary: string;
	results: ProjectResult[];
	duration: string;
	team: string;
	brief: string[];
	constraints: string[];
	approach: string[];
	built: string[];
	stack: string[];
	quote: ProjectQuote | null;
	firstPublishedAt: string | null;
	createdAt: string;
	createdBy: UserReference | null;
}

/**
 * A visible project as the website sees it — the web app's `Project`
 * contract. Optional keys are left out rather than sent as `null`.
 */
export interface PublicProjectResponse {
	slug: string;
	name: string;
	client: string;
	sector: ProjectSector;
	service: ServiceCategory;
	serviceSlug: string;
	/** A string, as the pages expect — nothing does arithmetic on it. */
	year: string;
	summary: string;
	results: ProjectResult[];
	featured?: boolean;
	image?: string;
}

export interface PublicGalleryImageResponse {
	url: string;
	width: number | null;
	height: number | null;
	caption: string | null;
}

/** The detail page — the web app's `ProjectDetail` plus the gallery. */
export interface PublicProjectDetailResponse extends PublicProjectResponse {
	duration: string;
	team: string;
	brief: string[];
	constraints: string[];
	approach: string[];
	built: string[];
	stack: string[];
	quote?: ProjectQuote;
	gallery: PublicGalleryImageResponse[];
}
