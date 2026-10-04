import type { UserReference } from './auth';
import type {
	ProjectSector,
	ProjectStatus,
	ProjectVisibility
} from '../enums/projects';
import type { ServiceCategory } from '../enums/services';

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

/** An image with its URL resolved. `uuid` is the media file's id. */
export interface ProjectImage {
	uuid: string;
	url: string;
	width: number | null;
	height: number | null;
}

/** One gallery entry. `uuid` is the entry's own id. */
export interface ProjectGalleryImage extends ProjectImage {
	mediaUuid: string;
	caption: string | null;
	position: number;
}

/** What every image endpoint returns. */
export interface ProjectImages {
	cover: ProjectImage | null;
	gallery: ProjectGalleryImage[];
}

/** A row on the dashboard list — `GET /api/projects`. */
export interface ProjectListItem {
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

/** The service a project links to. */
export interface ProjectServiceReference {
	uuid: string;
	title: string;
	slug: string;
	category: ServiceCategory;
}

/** One project with every field — `GET /api/projects/:uuid`. */
export interface ProjectRecord extends ProjectListItem, ProjectImages {
	client: string;
	/** `null` only for a project the seed couldn't link yet. */
	service: ProjectServiceReference | null;
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

/** `GET /api/projects` filters. */
export interface ProjectListQuery {
	search?: string;
	sector?: ProjectSector;
	visibility?: ProjectVisibility;
}

/** The case-study content — every field required on create. */
export interface ProjectContentPayload {
	name: string;
	client: string;
	sector: ProjectSector;
	/** The service it's evidence for — its category and page come from it. */
	serviceUuid: string;
	year: number;
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
}

/** Publishing and placement. `publishAt` is ISO with an offset, or `null`. */
export interface ProjectPlacementPayload {
	status: ProjectStatus;
	publishAt: string | null;
	featured: boolean;
	featuredOrder: number;
	showOnHome: boolean;
	homeOrder: number;
}

/** `POST /api/projects` — always a Draft; slug defaults to the name's. */
export type CreateProjectPayload = ProjectContentPayload &
	Partial<Omit<ProjectPlacementPayload, 'status'>> & { slug?: string };

/** `PATCH /api/projects/:uuid` — any subset. */
export type UpdateProjectPayload = Partial<
	ProjectContentPayload & ProjectPlacementPayload & { slug: string }
>;

/** A visible project on the website — the web app's `Project` contract. */
export interface PublicProject {
	slug: string;
	name: string;
	client: string;
	sector: ProjectSector;
	service: ServiceCategory;
	/** Left out while the service isn't on the website. */
	serviceSlug?: string;
	year: string;
	summary: string;
	results: ProjectResult[];
	featured?: boolean;
	image?: string;
}

export interface PublicGalleryImage {
	url: string;
	width: number | null;
	height: number | null;
	caption: string | null;
}

/** The detail page — the web app's `ProjectDetail` plus the gallery. */
export interface PublicProjectDetail extends PublicProject {
	duration: string;
	team: string;
	brief: string[];
	constraints: string[];
	approach: string[];
	built: string[];
	stack: string[];
	quote?: ProjectQuote;
	gallery: PublicGalleryImage[];
}
