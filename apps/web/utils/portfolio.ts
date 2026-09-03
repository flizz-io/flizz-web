import { services } from '@/constants/services';
import type { Project } from '@/types/portfolio';
import type { ServiceDetail } from '@/types/services';

/**
 * The service a project is evidence for. Matched by slug, so a service removed
 * from the catalogue drops the cross-link rather than erroring — check both
 * files together when either changes.
 */
export function getProjectService(project: Project): ServiceDetail | undefined {
	return services.find((service) => service.slug === project.serviceSlug);
}
