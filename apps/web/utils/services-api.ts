import 'server-only';

import { CacheTag, contentRevalidate } from '@/constants/cache';
import { ServiceCategory } from '@/enums/services';
import type { Service, ServiceDetail } from '@/types/services';
import {
	ApiError,
	getPublicServiceService,
	getPublicServicesService,
	getServiceRedirectService,
	type ApiContext,
	type PublicService,
	type PublicServiceDetail
} from '@workspace/api-services';
import {
	SERVICE_VISUAL_KINDS,
	type ServiceVisualKind
} from '@workspace/service-visuals';

const NOT_FOUND_STATUS = 404;

/** The scene a service shows when its stored one isn't known here. */
const FALLBACK_VISUAL: ServiceVisualKind = 'pulse-orb';

/** Cached and tagged; refetched on an interval only if that's enabled. */
const servicesContext: ApiContext = {
	baseUrl: process.env.API_URL,
	init: {
		next: {
			revalidate: contentRevalidate,
			tags: [CacheTag.SERVICES]
		}
	}
};

/** `null` for a 404 — the caller decides what "not there" means. */
async function orNull<T>(call: Promise<T>): Promise<T | null> {
	try {
		return await call;
	} catch (error) {
		if (error instanceof ApiError && error.status === NOT_FOUND_STATUS) {
			return null;
		}
		throw error;
	}
}

/**
 * The API sends the category key (`CUSTOM_SOFTWARE`) and the scene as text;
 * the site's enum carries display labels, and an unknown scene falls back
 * rather than breaking the page.
 */
function toService(service: PublicService): Service {
	return {
		...service,
		category: ServiceCategory[service.category],
		visualKind:
			SERVICE_VISUAL_KINDS.find((kind) => kind === service.visualKind) ??
			FALLBACK_VISUAL
	};
}

function toServiceDetail(service: PublicServiceDetail): ServiceDetail {
	return { ...service, ...toService(service) };
}

/** Every published service, by category then the dashboard's order. */
export async function getCatalogueServices(): Promise<Service[]> {
	return (await getPublicServicesService(servicesContext)).map(toService);
}

/** One published service, or `null`. */
export async function getCatalogueService(
	slug: string
): Promise<ServiceDetail | null> {
	const service = await orNull(
		getPublicServiceService(slug, servicesContext)
	);

	return service ? toServiceDetail(service) : null;
}

/** The current slug of the service an old slug belonged to, or `null`. */
export async function getServiceRedirect(slug: string) {
	const redirect = await orNull(
		getServiceRedirectService(slug, servicesContext)
	);

	return redirect?.slug ?? null;
}
