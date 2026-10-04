import { apiService, toUploadForm } from './api-service';
import { HttpMethod } from '../enums/api';
import type { ApiContext, ImageSizeOptions } from '../models/api';
import type {
	CreateServicePayload,
	PublicService,
	PublicServiceDetail,
	PublicSlugRedirect,
	ReorderServicesPayload,
	ServiceListItem,
	ServiceListQuery,
	ServiceOption,
	ServiceRecord,
	UpdateServicePayload
} from '../models/services';

const servicePath = (uuid: string) => `/services/${encodeURIComponent(uuid)}`;

// Dashboard — need a session with the SERVICES grant.

export function getServicesService(
	query: ServiceListQuery = {},
	context?: ApiContext
) {
	return apiService<ServiceListItem[]>('/services', {
		query: { ...query },
		context
	});
}

/** Needs the PROJECTS grant, not SERVICES — the project form's dropdown. */
export function getServiceOptionsService(context?: ApiContext) {
	return apiService<ServiceOption[]>('/services/options', { context });
}

export function getServiceService(uuid: string, context?: ApiContext) {
	return apiService<ServiceRecord>(servicePath(uuid), { context });
}

export function createServiceService(
	payload: CreateServicePayload,
	context?: ApiContext
) {
	return apiService<ServiceRecord>('/services', {
		method: HttpMethod.POST,
		body: payload,
		context
	});
}

export function updateServiceService(
	uuid: string,
	payload: UpdateServicePayload,
	context?: ApiContext
) {
	return apiService<ServiceRecord>(servicePath(uuid), {
		method: HttpMethod.PATCH,
		body: payload,
		context
	});
}

/** Soft delete — a 409 while projects link to the service. */
export function deleteServiceService(uuid: string, context?: ApiContext) {
	return apiService<void>(servicePath(uuid), {
		method: HttpMethod.DELETE,
		context
	});
}

/** Returns the category's services in their new order; a stale list gets a 409. */
export function reorderServicesService(
	payload: ReorderServicesPayload,
	context?: ApiContext
) {
	return apiService<ServiceListItem[]>('/services/order', {
		method: HttpMethod.PUT,
		body: payload,
		context
	});
}

// Share image — each returns the service as it now stands.

export function uploadServiceOgImageService(
	uuid: string,
	file: Blob,
	size: ImageSizeOptions = {},
	context?: ApiContext
) {
	return apiService<ServiceRecord>(`${servicePath(uuid)}/og-image`, {
		method: HttpMethod.POST,
		form: toUploadForm(file, { ...size }),
		context
	});
}

export function clearServiceOgImageService(uuid: string, context?: ApiContext) {
	return apiService<ServiceRecord>(`${servicePath(uuid)}/og-image`, {
		method: HttpMethod.DELETE,
		context
	});
}

// Public — the website; no session.

export function getPublicServicesService(context?: ApiContext) {
	return apiService<PublicService[]>('/public/services', { context });
}

export function getPublicServiceService(slug: string, context?: ApiContext) {
	return apiService<PublicServiceDetail>(
		`/public/services/${encodeURIComponent(slug)}`,
		{ context }
	);
}

/** Where an old slug went — 404 when it never redirected anywhere visible. */
export function getServiceRedirectService(slug: string, context?: ApiContext) {
	return apiService<PublicSlugRedirect>(
		`/public/services/redirects/${encodeURIComponent(slug)}`,
		{ context }
	);
}
