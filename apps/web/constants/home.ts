import { HeroDepth } from '@/enums/home';
import { ServiceCategory } from '@/enums/services';
import type {
	FaqItem,
	HeroCinematicConfig,
	HeroDiscipline,
	HeroDisciplinesSceneConfig,
	HeroParallaxConfig,
	ProblemItem,
	ProcessStep,
	RealCostItem,
	ServiceCategoryCard,
	RiskReversal,
	Stat,
	ValueProp
} from '@/types/home';

// Anchor the hero's "See the works" cue scrolls to — the Our Work section.
// Shared so the id can't drift apart.
export const heroScrollTargetId = 'our-work';

// The three disciplines the alternate hero orbits — labels track their own node
// as the constellation turns.
export const heroDisciplines: HeroDiscipline[] = [
	{
		label: 'Product discovery',
		caption: 'Deciding what is worth building' // 'Building what matters'
	},
	{
		label: 'AI-Augmented Delivery',
		caption: 'Building with advanced intelligence'
	},
	{ label: 'Systems engineering', caption: 'Building it to scale and last' }
];

// The one place to resize the hero constellation or its labels. Both scales run
// 0–100 with 50 as the size the scene was composed at, so they read like
// sliders rather than raw multipliers. 100 is whatever still fits the frame,
// measured at runtime — no setting can clip the artwork.
// The cinematic hero's one place to tune timing and the rotating line.
export const heroCinematicConfig: HeroCinematicConfig = {
	loaderSeconds: 1.8,
	showLoader: true,
	scrollDistance: 200,
	autoAdvanceSeconds: 10,
	rotatingPhrases: ['what\u2019s next.', 'what scales.', 'what lasts.'],
	phraseHoldSeconds: 3
};

// The cinematic hero's depth. Back planes trail the scroll and counter the
// pointer; front planes lead and follow it — the gap between them is what
// reads as depth. On large screens the hero is one of the held sections: its
// planes counter the exit scroll (`hold`) so Services slides up over a still
// stage, the back planes stiller than the front. Small screens keep `scroll`,
// modest for the scene: it trails inside the hero's clipped frame, so too much
// and its labels slide under the next section.
export const heroParallax: HeroParallaxConfig = {
	layers: {
		[HeroDepth.FAR]: { scroll: 0.45, hold: 1, pinned: -10, pointer: -28 },
		[HeroDepth.MID]: { scroll: 0.25, hold: 0.96, pinned: -18, pointer: 16 },
		[HeroDepth.SCENE]: { scroll: 0.18, hold: 0.9, pinned: 0, pointer: 12 },
		[HeroDepth.COPY]: { scroll: -0.12, hold: 0.82, pinned: 0, pointer: 0 }
	},
	pointerFollowSeconds: 1.2,
	exit: { copyScale: 1.08, copyBlur: 14, copyShare: 0.55, sceneOpacity: 0.3 }
};

// The cinematic hero's words. The headline's first two lines are set, the
// third rotates (see `heroCinematicConfig.rotatingPhrases`).
export const heroCinematicCopy = {
	headlineLines: ['Your technology', 'partner for'],
	// Heads the logo strip that sits under the headline.
	logosLabel: 'Trusted by teams at',
	primaryAction: 'Schedule a discovery call',
	secondaryAction: 'See the works',
	// TODO: swap for a quarterly availability line if the PM wants one.
	availability: 'Replies within one business day.',
	caption: 'Your Technology Partner',
	scrollCue: 'Scroll to begin'
};

export const heroDisciplinesSceneConfig: HeroDisciplinesSceneConfig = {
	sceneScale: 100,
	centerObjectScale: 50,
	labelFontSize: 13,
	captionFontSize: 15,
	clusterPointCount: 20,
	hasDisciplineBg: true
};

// Facts already in the Hero/Solution/Final-CTA copy, reframed as a stat strip — not invented business metrics
export const stats: Stat[] = [
	{
		// value: '30\u201390',
		value: '30',
		suffix: 'days',
		label: 'Warranty on everything we ship'
	},
	{ value: '2', suffix: 'wks', label: 'Cadence for working software' },
	{ value: '100', suffix: '%', label: 'Of code and IP is yours, day one' },
	{ value: '20', suffix: '+', label: 'Projects shipped' }
];

// Placeholder wordmarks — real company logos are an open item for the PM (see docs/requirements/progress-report.md)
export const socialProofLogos: string[] = [
	'Northwind',
	'Vantage Cove',
	'Adaptive Labs',
	'Marlin & Co',
	'Fieldstone',
	'Rivergate',
	'Halden Grove',
	'Ardsley',
	'Penhurst',
	'Brightmoor'
];

export const problemItems: ProblemItem[] = [
	{
		eyebrow: 'The tool sets the process',
		title: "Generic off-the-shelf tools that don't fit",
		description:
			"You're forcing your unique processes into rigid templates. Manual workarounds everywhere. Features you pay for but never use. Missing the exact capabilities you actually need.",
		cost: 'Your team spends its day being the integration layer.'
	},
	{
		eyebrow: 'No one owns the whole',
		title: 'Unreliable freelancers & contractors',
		// title: 'Unreliable freelancers and scattered contractors',
		description:
			'No one owns the full picture. Communication breaks down between specialists. Code quality is inconsistent. You\u2019re spending more time managing than building.',
		cost: 'You become the project manager for people you hired to manage the project.'
	},
	{
		eyebrow: 'Shipping after it matters',
		title: 'Slow-moving agencies or internal teams',
		description:
			'Months of meetings. Endless scope discussions. By the time something ships, requirements have changed. Technical debt piles up because "we\'ll fix it later."',
		cost: 'What finally ships was scoped for a business you no longer run.'
	}
];

// The sheet's "The Real Cost" block, split at its own sentence boundaries so
// the closing stage can land one loss at a time, each with a figure that plays
// the sentence out.
export const realCostItems: RealCostItem[] = [
	{
		line: 'Technology that holds you back instead of moving you forward.',
		diagram: 'held-back'
	},
	{
		line: "Competitive advantages you can't capture.",
		diagram: 'missed'
	},
	{
		line: "Growth opportunities you can't pursue.",
		diagram: 'forked'
	},
	{
		line: 'Teams frustrated by tools that make work harder, not easier.',
		diagram: 'friction'
	}
];

// The Our Process section's words, shared by both of its variations.
export const processSectionCopy = {
	eyebrow: 'Our Process',
	title: 'How we get you there',
	description:
		'Five stages, one system of record. You can see exactly where your project stands at every point.',
	consoleTitle: 'flizz.build / northwind',
	skip: 'Skip the process'
};

export const processSteps: ProcessStep[] = [
	{
		shortLabel: 'Discover',
		title: 'Discovery & Strategic Planning',
		description:
			"We don't start coding on day one. We start by understanding your business — current operations, pain points, growth goals, technical constraints. Then we map solutions that actually fit.",
		compactDescription:
			'We understand your business, challenges, constraints, and goals before deciding what to build.',
		whatYouGet:
			'Clear technical roadmap, realistic timeline, transparent pricing'
	},
	{
		shortLabel: 'Design',
		title: 'Architecture & Design',
		description:
			'Smart architecture decisions now prevent expensive problems later. We design systems for your current needs and future growth — database schema, integrations, security, scalability built in from the start.',
		compactDescription:
			'Architecture, user experience, and key technical decisions planned upfront—reducing costly surprises later.',
		whatYouGet: 'Technical blueprint, user flow designs, integration plan'
	},
	{
		shortLabel: 'Build',
		title: 'Development with Regular Progress',
		description:
			'Agile development with weekly check-ins. You see working software regularly, provide feedback, and stay involved. No surprises. No black box development.',
		compactDescription:
			'Working software, regular demos, and a continuous feedback loop.',
		whatYouGet: 'Working software every 2 weeks, continuous feedback loop'
	},
	{
		shortLabel: 'Launch',
		title: 'Testing, Security & Launch',
		description:
			"Rigorous testing across scenarios. Security audits. Performance optimization. We launch when it's actually ready — stable, secure, and reliable.",
		compactDescription:
			'Tested, audited and tuned. We ship when it is genuinely ready, not when the calendar says so.',
		whatYouGet:
			'Production-ready software that works under real-world conditions'
	},
	{
		shortLabel: 'Handover',
		title: 'Training, Documentation & Support',
		description:
			"Complete handoff with documentation, team training, and optional ongoing support. You're never dependent on us, but we're here when you need us.",
		compactDescription:
			'Documentation, training and full ownership handed over. You are never locked in.',
		whatYouGet:
			'Knowledge transfer, technical documentation, support options'
	}
];

/**
 * The teaser's rail: the four categories. Their services come from the API
 * (`serviceCategoryCardsOf` in utils/services.ts), so the home page and
 * `/services` can never disagree about which services a category holds or
 * what they're called. Titles and sentences are the PM's.
 */
export const serviceCategoryCardBases: Omit<ServiceCategoryCard, 'services'>[] =
	[
		{
			category: ServiceCategory.CUSTOM_SOFTWARE,
			title: 'Custom Software',
			summary: 'Build software tailored to your business.',
			visualKind: 'mvp-ascent'
		},
		{
			category: ServiceCategory.AI_AUTOMATION,
			title: 'AI & Automation',
			summary: 'Put AI and automation to work for your business.',
			visualKind: 'neural-layers'
		},
		{
			category: ServiceCategory.ECOMMERCE,
			title: 'E-commerce Solutions',
			summary: 'Build better digital commerce experiences.',
			visualKind: 'catalog-checkout'
		},
		{
			category: ServiceCategory.MOBILE,
			title: 'Mobile Solutions',
			summary: 'Bring your product to mobile.',
			visualKind: 'dual-handset'
		}
	];

// Copy for the services strip's edge arrows and pointer badge.
export const servicesRailLabels = {
	moreAfter: 'more',
	moreBefore: 'earlier',
	nextAria: 'Show later services',
	previousAria: 'Show earlier services',
	viewDetails: 'Click to view details',
	/** Prefixes a category's title on the popover's link to its group. */
	explore: 'Explore',
	servicesCount: (count: number) =>
		`${count} ${count === 1 ? 'service' : 'services'}`
};

export const valueProps: ValueProp[] = [
	{
		title: 'Generate ROI, not just features',
		description:
			'Every function built with business impact in mind — revenue, efficiency, or competitive advantage.'
	},
	{
		title: 'Turn data into decisions',
		description:
			"Dashboards and analytics that show what's working and what needs attention."
	},
	{
		title: 'Reduce risk through transparency',
		description:
			'Clear ownership, documented code, industry-standard tools — never held hostage by complexity.'
	},
	{
		title: 'Build competitive moats',
		description:
			"Custom capabilities and experiences competitors can't replicate with off-the-shelf tools."
	},
	{
		title: 'Support your entire growth journey',
		description:
			'From validating concepts to scaling operations, technology that grows with you.'
	},
	{
		title: 'Win customers through experience',
		description:
			'Interfaces that delight, workflows that convert, interactions that build loyalty.'
	}
];

// Audience segments, derived from the four service categories in
// docs/requirements/home-page.md — TODO: PM to confirm the final segment list
// and the "Who we build for" headline.
export const audienceSegments: string[] = [
	// 'SaaS & product teams',
	// 'E-commerce & retail',
	// 'Operations & automation',
	// 'Founders shipping v1',
	// 'Legacy replacements',
	// 'Internal tools',
	// Following are decided by PM
	'Founders & Product Teams',
	'Growing Businesses',
	'Operations & Process Teams',
	'E-commerce & Retail Businesses',
	'Businesses Outgrowing Their Systems',
	'Internal tools'
];

export const faqItems: FaqItem[] = [
	{
		question: "What's your development process?",
		answer: 'We start with discovery to understand your goals and requirements. Then we move to design and architecture planning, followed by iterative development with regular check-ins. You see progress weekly, provide feedback continuously, and we adjust as needed. Post-launch, we offer support and maintenance to ensure everything runs smoothly.'
	},
	{
		question:
			'Do you only build new software or can you work with existing systems?',
		answer: "Both. We build new applications from scratch, modernize legacy systems, integrate with existing tools, add features to current platforms, and optimize performance. Whether you're starting fresh or improving what you have, we adapt to your situation."
	},
	{
		question: 'Can you integrate with our existing systems?',
		answer: "Absolutely. We specialize in connecting disparate systems through APIs, databases, and middleware. Whether it's your CRM, accounting software, inventory system, or legacy applications - we make them work together seamlessly."
	},
	{
		question: 'What if my needs change during development?',
		answer: "Flexibility is core to our process. We use agile methodology with regular checkpoints to accommodate changes. Major scope changes may adjust timeline or budget, but we handle minor pivots and refinements naturally. You're never locked into the wrong direction."
	},
	{
		question: 'What if something breaks after launch?',
		answer: 'All projects include a warranty period (typically 30-90 days) covering bugs and issues related to our work. After that, support agreements cover fixes, updates, and improvements.'
	},
	{
		question: 'How do you ensure the software is secure?',
		answer: 'Security is built into every phase. We follow industry best practices: secure authentication, encrypted data transmission, regular security audits, vulnerability scanning, and compliance with relevant standards.'
	},
	{
		question: 'How do we begin working together?',
		answer: "Schedule a discovery call to discuss your project. We'll explore goals, requirements, and feasibility. If it's a good fit, we provide a detailed proposal with scope, timeline, and cost. After agreement, we kick off with planning and design."
	}
];

export const riskReversals: RiskReversal[] = [
	{ text: 'Free discovery call to explore your needs' },
	{ text: 'Clear proposal with realistic timeline and transparent pricing' },
	{ text: 'You own all code and IP from day one' }
];
