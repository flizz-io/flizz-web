import { apiService, toUploadForm } from './api-service';
import { HttpMethod } from '../enums/api';
import type { ApiContext, ImageSizeOptions } from '../models/api';
import type {
	CreateProjectPayload,
	ProjectImages,
	ProjectListItem,
	ProjectListQuery,
	ProjectRecord,
	PublicProject,
	PublicProjectDetail,
	UpdateProjectPayload
} from '../models/projects';

const projectPath = (uuid: string) => `/projects/${encodeURIComponent(uuid)}`;

const galleryImagePath = (uuid: string, imageUuid: string) =>
	`${projectPath(uuid)}/gallery/${encodeURIComponent(imageUuid)}`;

// Dashboard — need a session with the PROJECTS grant.

export function getProjectsService(
	query: ProjectListQuery = {},
	context?: ApiContext
) {
	return apiService<ProjectListItem[]>('/projects', {
		query: { ...query },
		context
	});
}

export function getProjectService(uuid: string, context?: ApiContext) {
	return apiService<ProjectRecord>(projectPath(uuid), { context });
}

export function createProjectService(
	payload: CreateProjectPayload,
	context?: ApiContext
) {
	return apiService<ProjectRecord>('/projects', {
		method: HttpMethod.POST,
		body: payload,
		context
	});
}

export function updateProjectService(
	uuid: string,
	payload: UpdateProjectPayload,
	context?: ApiContext
) {
	return apiService<ProjectRecord>(projectPath(uuid), {
		method: HttpMethod.PATCH,
		body: payload,
		context
	});
}

/** Soft delete. */
export function deleteProjectService(uuid: string, context?: ApiContext) {
	return apiService<void>(projectPath(uuid), {
		method: HttpMethod.DELETE,
		context
	});
}

// Images — each returns the project's cover and gallery as they now stand.

export function uploadProjectCoverService(
	uuid: string,
	file: Blob,
	size: ImageSizeOptions = {},
	context?: ApiContext
) {
	return apiService<ProjectImages>(`${projectPath(uuid)}/cover`, {
		method: HttpMethod.POST,
		form: toUploadForm(file, { ...size }),
		context
	});
}

export function clearProjectCoverService(uuid: string, context?: ApiContext) {
	return apiService<ProjectImages>(`${projectPath(uuid)}/cover`, {
		method: HttpMethod.DELETE,
		context
	});
}

export function addGalleryImageService(
	uuid: string,
	file: Blob,
	options: ImageSizeOptions & { caption?: string | null } = {},
	context?: ApiContext
) {
	return apiService<ProjectImages>(`${projectPath(uuid)}/gallery`, {
		method: HttpMethod.POST,
		form: toUploadForm(file, { ...options }),
		context
	});
}

export function updateGalleryCaptionService(
	uuid: string,
	imageUuid: string,
	caption: string | null,
	context?: ApiContext
) {
	return apiService<ProjectImages>(galleryImagePath(uuid, imageUuid), {
		method: HttpMethod.PATCH,
		body: { caption },
		context
	});
}

export function retireGalleryImageService(
	uuid: string,
	imageUuid: string,
	context?: ApiContext
) {
	return apiService<ProjectImages>(galleryImagePath(uuid, imageUuid), {
		method: HttpMethod.DELETE,
		context
	});
}

/** Must list every live gallery image once; a stale list gets a 409. */
export function reorderGalleryService(
	uuid: string,
	imageUuids: string[],
	context?: ApiContext
) {
	return apiService<ProjectImages>(`${projectPath(uuid)}/gallery/order`, {
		method: HttpMethod.PUT,
		body: { imageUuids },
		context
	});
}

// Public — the website; no session.

export function getPublicProjectsService(context?: ApiContext) {
	return apiService<PublicProject[]>('/public/projects', { context });
}

export function getHomeProjectsService(context?: ApiContext) {
	return apiService<PublicProject[]>('/public/projects/home', { context });
}

export function getPublicProjectService(slug: string, context?: ApiContext) {
	return apiService<PublicProjectDetail>(
		`/public/projects/${encodeURIComponent(slug)}`,
		{ context }
	);
}
