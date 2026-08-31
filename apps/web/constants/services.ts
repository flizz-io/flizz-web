import { ServiceBackNav, ServiceCategory } from '@/enums/services';
import type { ServiceDetail } from '@/types/services';

/**
 * The canonical roster. The list page renders all of it, the home teaser
 * renders a subset, and the Services CRUD replaces it at Stage 13 — so this is
 * the single source of truth for what Flizz offers until then.
 *
 * TODO: PM to replace all detail copy — `intro`, `problem`, `deliverables`,
 * `outcomes` and `engagement` are placeholder, written to the site's voice
 * rather than taken from the sheet. The engagement durations in particular are
 * plausible guesses, not quoted ranges, and should not be published as-is.
 */
export const services: ServiceDetail[] = [
	{
		slug: 'mvp-development',
		title: 'MVP Development',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary: 'Validate fast with a lean, production-grade first build.',
		visualKind: 'mvp-ascent',
		intro: 'A first build real users can actually use, shipped in weeks rather than quarters. Enough product to learn from, and none of the scaffolding you would throw away.',
		problem:
			'Most first builds fail one of two ways: they take so long the market moves, or they are demos that collapse the moment someone real touches them. We build the smallest thing that stands up in production, then let evidence decide what comes next.',
		deliverables: [
			'A working product in production, not a prototype',
			'The core journey built end to end',
			'Analytics wired in from the first release',
			'A prioritised list of what to build next, and why'
		],
		outcomes: [
			'Evidence from real users instead of opinions',
			'A codebase the next phase can build on',
			'A continue-or-stop decision made cheaply'
		],
		engagement: '6–10 weeks, weekly demos'
	},
	{
		slug: 'saas-application-development',
		title: 'SaaS Application Development',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary:
			'Multi-tenant platforms built to scale with your customer base.',
		visualKind: 'tenant-column',
		intro: 'Multi-tenant platforms where the tenth customer costs less to serve than the first. Built around the billing, permissions and isolation problems that only appear once you have real accounts.',
		problem:
			"Single-tenant software rewritten as SaaS tends to leak — one customer's data in another's report, billing that cannot handle a mid-month upgrade, permissions bolted on after launch. Those are architecture decisions, and they are cheap now and expensive later.",
		deliverables: [
			'Tenant isolation designed in, not retrofitted',
			'Roles and permissions that survive real org charts',
			'Subscription billing, upgrades and downgrades',
			'An admin surface your own team can operate'
		],
		outcomes: [
			'Cost per customer that falls as you grow',
			'Onboarding that does not need an engineer',
			'A platform that passes a security review'
		],
		engagement: '3–6 months, working software every two weeks'
	},
	{
		slug: 'legacy-modernisation',
		title: 'Legacy Modernisation',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary:
			'Move off a system you can no longer hire for, in stages rather than one risky rewrite.',
		visualKind: 'layered-stack',
		intro: 'Move off a system nobody left can maintain, without betting the company on a rewrite. In stages, with the old system running until the new one has earned the traffic.',
		problem:
			'Full rewrites are the most reliable way to lose two years. The system you have works — it is just expensive, fragile and unhireable. The job is to replace it piece by piece while it keeps serving customers.',
		deliverables: [
			'A map of what the current system actually does',
			'A staged migration plan with rollback at every step',
			'The highest-risk component replaced first',
			'Documentation the old system never had'
		],
		outcomes: [
			'Hiring from a normal talent pool again',
			'Changes that take days instead of quarters',
			'No single migration that can take you offline'
		],
		engagement: 'Staged, 4–12 months depending on surface area'
	},
	{
		slug: 'api-development',
		title: 'API Development',
		category: ServiceCategory.CUSTOM_SOFTWARE,
		summary:
			'Interfaces other teams can build against without booking a meeting first.',
		visualKind: 'grid-lattice',
		intro: "Interfaces other teams can build against without asking anyone for help — yours, your customers', your partners'. Documented, versioned, and stable enough to depend on.",
		problem:
			'An undocumented API is a support queue. Every consumer guesses, every change breaks somebody, and the team that owns it becomes the bottleneck for everyone else.',
		deliverables: [
			'A designed contract, agreed before implementation',
			'Generated documentation that cannot drift from the code',
			'A versioning and deprecation policy',
			'Authentication, rate limiting and audit logging'
		],
		outcomes: [
			'Integrations that ship without your involvement',
			'Breaking changes that are deliberate, not accidental',
			'A product surface partners can build on'
		],
		engagement: '4–8 weeks for a first surface'
	},
	{
		slug: 'ai-integration',
		title: 'AI Integration',
		category: ServiceCategory.AI_AUTOMATION,
		summary:
			'Embed AI where it removes real work, not where it looks good in a demo.',
		visualKind: 'neural-layers',
		intro: 'AI placed where it removes measurable work, with the unglamorous parts built in — evaluation, fallbacks, cost ceilings. Often a smaller model is the right answer, and we will say so.',
		problem:
			'Most AI projects demo well and fail in production, because nobody defined what correct means or what happens when the model is wrong. The interesting work is not the prompt, it is everything around it.',
		deliverables: [
			'A defined task with a measurable success bar',
			'Retrieval over your own data where it earns its place',
			'An evaluation harness and regression checks',
			'Fallback behaviour and a cost ceiling'
		],
		outcomes: [
			'Hours removed from a named process',
			'Output you can audit rather than trust',
			'A running cost you can forecast'
		],
		engagement: '6–12 weeks, starting with one process'
	},
	{
		slug: 'chatbots-conversational-ai',
		title: 'Chatbots & Conversational AI',
		category: ServiceCategory.AI_AUTOMATION,
		summary:
			'Support and sales conversations that actually resolve things.',
		visualKind: 'dialogue-bubbles',
		intro: 'Assistants that resolve the request or hand over cleanly, with a transcript your team can read. Scoped to what they can actually do, so they stop guessing.',
		problem:
			'A chatbot that cannot resolve anything is a worse phone tree. The failure is almost never the language model — it is being connected to nothing, so it can answer questions but not do anything about them.',
		deliverables: [
			'Intents scoped to actions the assistant can complete',
			'Connections into the systems that hold the answers',
			'Human handover with the full context attached',
			'Transcript review, and a way to improve from it'
		],
		outcomes: [
			'A measurable share of contacts resolved without a person',
			'Faster answers outside working hours',
			'A record of what customers keep asking for'
		],
		engagement: '6–10 weeks'
	},
	{
		slug: 'intelligent-automation',
		title: 'Intelligent Automation',
		category: ServiceCategory.AI_AUTOMATION,
		summary: 'Take repetitive work off people, and keep the audit trail.',
		visualKind: 'particle-swarm',
		intro: 'Take repetitive work off people who cost more than the software, and keep a record of every decision it made on their behalf.',
		problem:
			"The work worth automating is usually the work nobody wrote down — a spreadsheet, a set of rules in someone's head, and a monthly scramble. Automating it starts by documenting it.",
		deliverables: [
			'The current process documented as it actually runs',
			'Automation for the repeatable path',
			'Exception handling that escalates to a person',
			'An audit trail of every automated decision'
		],
		outcomes: [
			'Hours per week returned to the team',
			'Fewer errors on the high-volume, boring path',
			'A process that survives someone leaving'
		],
		engagement: '4–10 weeks per process'
	},
	{
		slug: 'online-store-development',
		title: 'Online Store Development',
		category: ServiceCategory.ECOMMERCE,
		summary: 'Storefronts tuned for conversion, not just checked boxes.',
		visualKind: 'catalog-checkout',
		intro: 'Storefronts built around the paths that actually convert, and the operational reality behind them — stock, fulfilment, returns, and reporting that tells you what worked.',
		problem:
			'Most store projects optimise the homepage and ignore checkout, search, and the fact that fulfilment runs on a spreadsheet. Revenue is lost in the parts nobody screenshots.',
		deliverables: [
			'Search, browse and checkout built for conversion',
			'Stock, fulfilment and returns handled properly',
			'Payments and tax configured for where you sell',
			'Analytics that attributes revenue to changes'
		],
		outcomes: [
			'A higher share of visits ending in a sale',
			'Operations that do not break at volume',
			'Numbers you can act on'
		],
		engagement: '2–4 months'
	},
	{
		slug: 'shopify-app-development',
		title: 'Shopify App Development',
		category: ServiceCategory.ECOMMERCE,
		summary: 'Extend Shopify beyond its limits with custom apps.',
		visualKind: 'plugin-socket',
		intro: 'Custom apps for the things Shopify does not do — public apps for the store, or private ones that fit only your operation.',
		problem:
			'Every Shopify business eventually hits a wall the theme editor cannot solve: a pricing rule, a fulfilment path, an integration that does not exist. Working around it by hand costs more every month.',
		deliverables: [
			'An app built to current platform requirements',
			'An admin surface embedded where merchants expect it',
			'Webhooks and sync that survive rate limits',
			'App Store submission, if it is going public'
		],
		outcomes: [
			'The capability the platform was missing',
			'Manual workarounds removed from the day',
			'A route to revenue, for a public app'
		],
		engagement: '6–12 weeks'
	},
	{
		slug: 'payment-integration',
		title: 'Payment Integration',
		category: ServiceCategory.ECOMMERCE,
		summary: 'Accept payments securely, globally, your way.',
		visualKind: 'secure-rail',
		intro: 'Take money reliably, in the places you sell, with the failure cases handled — retries, disputes, refunds, and reconciliation that matches your accounts.',
		problem:
			'Payments look finished when the first charge succeeds. The cost arrives later, in failed renewals nobody retried, disputes nobody answered, and a ledger that does not reconcile.',
		deliverables: [
			'Provider integration with idempotent handling',
			'Subscriptions, retries and dunning where relevant',
			'Refunds, disputes and chargeback flow',
			'Reconciliation your finance team can tie out'
		],
		outcomes: [
			'Fewer payments lost to recoverable failures',
			'Books that reconcile without manual work',
			'A provider you can change without a rewrite'
		],
		engagement: '3–8 weeks'
	},
	{
		slug: 'native-mobile-app-development',
		title: 'Native Mobile App Development',
		category: ServiceCategory.MOBILE,
		summary: 'iOS and Android apps that feel native because they are.',
		visualKind: 'dual-handset',
		intro: 'iOS and Android apps that behave the way each platform expects, because they are built for it rather than wrapped in it.',
		problem:
			'Cross-platform shortcuts save money until the app needs the camera, background sync, offline state, or a gesture that feels right. Then the saving is spent debugging the abstraction.',
		deliverables: [
			'Native builds for the platforms you need',
			'Offline behaviour and background sync',
			'Store submission and a release pipeline',
			'Crash reporting and staged rollout'
		],
		outcomes: [
			'An app that reviews well because it feels native',
			'Releases that ship without drama',
			'Access to platform capability when you need it'
		],
		engagement: '3–6 months'
	},
	{
		slug: 'app-modernisation',
		title: 'App Modernisation',
		category: ServiceCategory.MOBILE,
		summary:
			'Bring an app that still works onto a platform that still ships.',
		visualKind: 'device-frame',
		intro: 'Bring an app that still works onto a platform that still ships — current OS requirements, current tooling, and a release process that does not need an archaeologist.',
		problem:
			'Mobile platforms deprecate on a schedule. An app untouched for two years is one store policy change away from being unlistable, and the original build environment may no longer exist.',
		deliverables: [
			'Current SDK, toolchain and store compliance',
			'Abandoned dependencies replaced',
			'A reproducible build and release pipeline',
			'Test coverage on the paths that matter'
		],
		outcomes: [
			'An app that stays listable',
			'Changes that are safe to make again',
			'A build anyone on the team can run'
		],
		engagement: '6–12 weeks'
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
export const homeTeaserServices: ServiceDetail[] = homeTeaserSlugs.flatMap(
	(slug) => services.find((service) => service.slug === slug) ?? []
);

export const servicesHeroLead =
	'Twelve services across four areas. If an off-the-shelf tool would do the job we will say so — this list is where custom actually earns its cost.';

export const servicesCtaHeading = 'Not sure which of these you need?';
export const servicesCtaLead =
	'Describe the problem instead of the solution. A free discovery call will tell you which of these applies, or whether none of them do.';

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
