import { ServiceBackNav } from '@/enums/services';

export const servicesHeroLead =
	'Digital products, intelligent systems, and scalable software that solve real business challenges and evolve with your business.';

export const servicesCtaHeading = 'Not sure what you need?';
export const servicesCtaLead =
	"Start with the problem, not the solution. Tell us what you're trying to achieve, and we'll help you figure out the right way forward.";

/**
 * Which way back to the catalogue the service detail hero offers. Change this
 * one value to compare the options:
 *
 * - `LINK`     — "All services" above the title. An explicit step up.
 * - `CATEGORY` — the category eyebrow links to its group on the list page.
 * - `BOTH`     — both, the up move and the lateral one.
 * - `NONE`     — neither; the header nav and the "Nearby" section carry it.
 */
export const serviceDetailBackNav = ServiceBackNav.BOTH;
