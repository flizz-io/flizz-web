import type { ServiceCategory } from '@/enums/services';
import type { ServiceVisualKind } from '@workspace/service-visuals';

/**
 * What the list page, the home teaser, and the detail hero all need. The
 * Services CRUD will eventually supply these same fields, so the shape here is
 * the contract that page code is written against.
 */
export interface Service {
	/** Also the detail route segment: /services/[slug]. */
	slug: string;
	title: string;
	category: ServiceCategory;
	/** One line. Carries the service on the list page and the home teaser. */
	summary: string;
	/**
	 * Which specimen from `@workspace/service-visuals` represents this service.
	 * Id only — the palette lives in that package, not here.
	 */
	visualKind: ServiceVisualKind;
}

/**
 * The extra content a detail page needs. Kept separate from `Service` so the
 * list page and teaser are not forced to carry copy they never render.
 */
export interface ServiceDetail extends Service {
	intro: string;
	problem: string;
	deliverables: string[];
	outcomes: string[];
	/** Typical shape of the engagement. Omitted where none is confirmed. */
	engagement?: string;
}
