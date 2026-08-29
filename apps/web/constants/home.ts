import type {
	FaqItem,
	ProblemItem,
	ProcessStep,
	ProjectCard,
	RealCostItem,
	RiskReversal,
	ServiceCard,
	Stat,
	Testimonial,
	ValueProp
} from '@/types/home';

// Anchor the hero's scroll cue targets — shared so the id can't drift apart.
export const heroScrollTargetId = 'highlights';

// Facts already in the Hero/Solution/Final-CTA copy, reframed as a stat strip — not invented business metrics
export const stats: Stat[] = [
	{ value: '30-90', label: 'Day warranty on all work we ship' },
	{ value: '2', label: 'Week cadence for working software' },
	{ value: '100%', label: 'Of code and IP is yours, day one' }
];

// Placeholder wordmarks — real company logos are an open item for the PM (see docs/requirements/progress-report.md)
export const socialProofLogos: string[] = [
	'Northwind',
	'Vantage Cove',
	'Adaptive Labs',
	'Marlin & Co',
	'Fieldstone',
	'Rivergate'
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

export const processSteps: ProcessStep[] = [
	{
		shortLabel: 'Discover',
		title: 'Discovery & Strategic Planning',
		description:
			"We don't start coding on day one. We start by understanding your business — current operations, pain points, growth goals, technical constraints. Then we map solutions that actually fit.",
		compactDescription:
			'We map your operations, constraints and goals before a line of code is written.',
		whatYouGet:
			'Clear technical roadmap, realistic timeline, transparent pricing'
	},
	{
		shortLabel: 'Design',
		title: 'Architecture & Design',
		description:
			'Smart architecture decisions now prevent expensive problems later. We design systems for your current needs and future growth — database schema, integrations, security, scalability built in from the start.',
		compactDescription:
			'Schema, integrations, security and scale decided up front, so later changes stay cheap.',
		whatYouGet: 'Technical blueprint, user flow designs, integration plan'
	},
	{
		shortLabel: 'Build',
		title: 'Development with Regular Progress',
		description:
			'Agile development with weekly check-ins. You see working software regularly, provide feedback, and stay involved. No surprises. No black box development.',
		compactDescription:
			'Working software every two weeks — running builds you can use, not status decks.',
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

// Placeholder cards — Services content moves to a CRUD feature later (see docs/requirements/progress-report.md); do not treat as final copy
export const serviceCards: ServiceCard[] = [
	{
		category: 'Custom Software',
		title: 'MVP Development',
		description: 'Validate fast with a lean, production-grade first build.',
		visualKind: 'layered-stack'
	},
	{
		category: 'Custom Software',
		title: 'SaaS Application Development',
		description:
			'Multi-tenant platforms built to scale with your customer base.',
		visualKind: 'grid-lattice'
	},
	{
		category: 'AI & Automation',
		title: 'AI Integration',
		description:
			'Embed AI where it removes real work, not where it looks good in a demo.',
		visualKind: 'particle-swarm'
	},
	{
		category: 'AI & Automation',
		title: 'Chatbots & Conversational AI',
		description:
			'Support and sales conversations that actually resolve things.',
		visualKind: 'pulse-orb'
	},
	{
		category: 'E-commerce',
		title: 'Online Store Development',
		description:
			'Storefronts tuned for conversion, not just checked boxes.',
		visualKind: 'orbit-ring'
	},
	{
		category: 'Custom Software two',
		title: 'SaaS Application Development',
		description:
			'Multi-tenant platforms built to scale with your customer base.',
		visualKind: 'grid-lattice'
	},
	{
		category: 'AI & Automation two',
		title: 'AI Integration',
		description:
			'Embed AI where it removes real work, not where it looks good in a demo.',
		visualKind: 'particle-swarm'
	},
	{
		category: 'AI & Automation two',
		title: 'Chatbots & Conversational AI',
		description:
			'Support and sales conversations that actually resolve things.',
		visualKind: 'pulse-orb'
	},
	{
		category: 'E-commerce two',
		title: 'Online Store Development',
		description:
			'Storefronts tuned for conversion, not just checked boxes.',
		visualKind: 'orbit-ring'
	},
	{
		category: 'Mobile',
		title: 'Native Mobile App Development',
		description: 'iOS and Android apps that feel native because they are.',
		visualKind: 'device-frame'
	}
];

// Placeholder cards — no project entries provided yet (see docs/requirements/home-page.md)
// TODO: PM to replace with real projects and supply a screenshot per card
// (`image`) — the roster mirrors the placeholder names used by socialProofLogos.
export const projectCards: ProjectCard[] = [
	{
		name: 'Northwind Ops Platform',
		category: 'Custom Software',
		sector: 'B2B \u00b7 Operations',
		year: '2025',
		summary:
			'Replaced five spreadsheets with one system of record for a 40-person ops team.'
	},
	{
		name: 'Vantage Cove Storefront',
		category: 'E-commerce',
		sector: 'DTC \u00b7 Retail',
		year: '2025',
		summary:
			'Rebuilt the checkout flow and cut cart abandonment by a third.'
	},
	{
		name: 'Fieldstone Field App',
		category: 'Mobile',
		sector: 'Field Services',
		year: '2024',
		summary:
			'Offline-first inspection app for crews working without signal.'
	},
	{
		name: 'Adaptive Labs Intake',
		category: 'AI & Automation',
		sector: 'B2B \u00b7 Services',
		year: '2026',
		summary:
			'Automated a manual intake queue that was costing two days a week.'
	},
	{
		name: 'Marlin & Co Dashboard',
		category: 'SaaS Platform',
		sector: 'B2B \u00b7 Logistics',
		year: '2024',
		summary:
			'One dashboard in place of four vendor logins for a distributed team.'
	},
	{
		name: 'Rivergate Rebuild',
		category: 'Legacy Modernisation',
		sector: 'B2B \u00b7 Finance',
		year: '2026',
		summary:
			'Moved a decade-old internal tool off unsupported infrastructure, without downtime.'
	}
];

// Sits opposite the section tag, the way the reference states its remit.
export const portfolioMeta =
	'Custom software, e-commerce & mobile \u00b7 2024 to 2026';

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

// Placeholder quotes — no testimonial content provided yet (see docs/requirements/home-page.md)
export const testimonials: Testimonial[] = [
	{
		quote: "Flizz shipped in weeks what our last agency couldn't finish in a year. We saw working software every two weeks, not a status deck.",
		highlights: ['in weeks', 'every two weeks'],
		author: 'Dana Whitfield',
		role: 'COO, Northwind'
	},
	{
		quote: 'The system they handed off is one we can actually maintain ourselves. No black box, no lock-in — exactly what we needed.',
		highlights: ['maintain ourselves', 'no lock-in'],
		author: 'Marcus Oyelaran',
		role: 'Founder, Vantage Cove'
	},
	{
		quote: 'They caught a scaling problem in the architecture phase that would have cost us months to fix post-launch.',
		highlights: ['architecture phase', 'cost us months'],
		author: 'Priya Nandakumar',
		role: 'VP Engineering, Fieldstone'
	}
];

// Audience segments, derived from the four service categories in
// docs/requirements/home-page.md — TODO: PM to confirm the final segment list
// and the "Who we build for" headline.
export const audienceSegments: string[] = [
	'SaaS & product teams',
	'E-commerce & retail',
	'Operations & automation',
	'Founders shipping v1',
	'Legacy replacements',
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
