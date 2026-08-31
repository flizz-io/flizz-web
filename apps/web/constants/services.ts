import { ServiceCategory } from '@/enums/services';
import type { Service } from '@/types/services';

/**
 * The canonical roster. The list page renders all of it, the home teaser
 * renders a subset, and the Services CRUD replaces it at Stage 13 — so this is
 * the single source of truth for what Flizz offers until then.
 *
 * TODO: PM to confirm the four services added on 2026-08-31 are actually
 * offered — Legacy Modernisation, API Development, Intelligent Automation and
 * App Modernisation were candidates in the sheet, not a confirmed roster.
 */
export const services: Service[] = [
	{
		slug: 'mvp-development',
		title: 'MVP Development',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary: 'Validate fast with a lean, production-grade first build.',
		visualKind: 'mvp-ascent'
	},
	{
		slug: 'saas-application-development',
		title: 'SaaS Application Development',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary:
			'Multi-tenant platforms built to scale with your customer base.',
		visualKind: 'tenant-column'
	},
	{
		slug: 'legacy-modernisation',
		title: 'Legacy Modernisation',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary:
			'Move off a system you can no longer hire for, in stages rather than one risky rewrite.',
		visualKind: 'layered-stack'
	},
	{
		slug: 'api-development',
		title: 'API Development',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary:
			'Interfaces other teams can build against without booking a meeting first.',
		visualKind: 'grid-lattice'
	},
	{
		slug: 'ai-integration',
		title: 'AI Integration',
		category: ServiceCategory.AI_AUTOMATION,
		summary:
			'Embed AI where it removes real work, not where it looks good in a demo.',
		visualKind: 'neural-layers'
	},
	{
		slug: 'chatbots-conversational-ai',
		title: 'Chatbots & Conversational AI',
		category: ServiceCategory.AI_AUTOMATION,
		summary:
			'Support and sales conversations that actually resolve things.',
		visualKind: 'dialogue-bubbles'
	},
	{
		slug: 'intelligent-automation',
		title: 'Intelligent Automation',
		category: ServiceCategory.AI_AUTOMATION,
		summary: 'Take repetitive work off people, and keep the audit trail.',
		visualKind: 'particle-swarm'
	},
	{
		slug: 'online-store-development',
		title: 'Online Store Development',
		category: ServiceCategory.ECOMMERCE,
		summary: 'Storefronts tuned for conversion, not just checked boxes.',
		visualKind: 'catalog-checkout'
	},
	{
		slug: 'shopify-app-development',
		title: 'Shopify App Development',
		category: ServiceCategory.ECOMMERCE,
		summary: 'Extend Shopify beyond its limits with custom apps.',
		visualKind: 'plugin-socket'
	},
	{
		slug: 'payment-integration',
		title: 'Payment Integration',
		category: ServiceCategory.ECOMMERCE,
		summary: 'Accept payments securely, globally, your way.',
		visualKind: 'secure-rail'
	},
	{
		slug: 'native-mobile-app-development',
		title: 'Native Mobile App Development',
		category: ServiceCategory.MOBILE,
		summary: 'iOS and Android apps that feel native because they are.',
		visualKind: 'dual-handset'
	},
	{
		slug: 'app-modernisation',
		title: 'App Modernisation',
		category: ServiceCategory.MOBILE,
		summary:
			'Bring an app that still works onto a platform that still ships.',
		visualKind: 'device-frame'
	}
];

/** Which of the roster the home page teaser carries, in the order it shows them. */
const homeTeaserSlugs = [
	'mvp-development',
	'saas-application-development',
	'ai-integration',
	'chatbots-conversational-ai',
	'online-store-development',
	'native-mobile-app-development',
	'shopify-app-development',
	'payment-integration'
];

/**
 * Derived rather than duplicated — the teaser is a strict subset of the roster,
 * so the two pages can never disagree about a title, summary or visual.
 */
export const homeTeaserServices: Service[] = homeTeaserSlugs.flatMap(
	(slug) => services.find((service) => service.slug === slug) ?? []
);

export const servicesHeroLead =
	'Twelve services across four areas. If an off-the-shelf tool would do the job we will say so — this list is where custom actually earns its cost.';

export const servicesCtaHeading = 'Not sure which of these you need?';
export const servicesCtaLead =
	'Describe the problem instead of the solution. A free discovery call will tell you which of these applies, or whether none of them do.';
