import { sectionQueryParam } from '@/constants/scroll';

/**
 * An in-site link to a section of a page — `/services?section=mobile`. The
 * page shell lands on it after navigating (`settleNavigation`). Server-safe,
 * so server components can build these links too.
 */
export function sectionHref(path: string, sectionId: string) {
	return `${path}?${sectionQueryParam}=${encodeURIComponent(sectionId)}`;
}
