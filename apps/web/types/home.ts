import type { ServiceVisualKind } from '@workspace/service-visuals';

export interface Stat {
	value: string;
	label: string;
}

export interface ProblemItem {
	/** Short framing line above the title, set in the utility face. */
	eyebrow: string;
	title: string;
	description: string;
	/** The single sharpest consequence, pulled out as a callout. */
	cost: string;
}

export type RealCostDiagram = 'held-back' | 'missed' | 'forked' | 'friction';

export interface RealCostItem {
	line: string;
	/** Which moving figure plays out this line. */
	diagram: RealCostDiagram;
}

export interface ProcessStep {
	/** Punchy one-word label for the process rail. */
	shortLabel: string;
	title: string;
	description: string;
	/** Trimmed description for layouts where the rail has less room. */
	compactDescription: string;
	whatYouGet: string;
}

export interface ServiceCard {
	category: string;
	title: string;
	description: string;
	/**
	 * Which specimen from `@workspace/service-visuals` represents this
	 * service. Once the Services CRUD ships, this becomes the same key an
	 * admin picks from that package's picker — the palette lives there, not
	 * here, so this field only ever stores the id.
	 */
	visualKind: ServiceVisualKind;
}

export interface ProjectCard {
	name: string;
	/** Accent pill — the kind of build. */
	category: string;
	/** Outline pill — the market it was built for. */
	sector: string;
	year: string;
	summary: string;
	/**
	 * Path to the real screenshot. Until the PM supplies one the card shows a
	 * marked-empty slot rather than invented cover art.
	 */
	image?: string;
}

export interface ValueProp {
	title: string;
	description: string;
}

export interface Testimonial {
	quote: string;
	/**
	 * Exact phrases from `quote` to set in the accent colour. Kept as data
	 * rather than markup in the string so the same quotes survive moving to
	 * the Testimonial CRUD later.
	 */
	highlights?: string[];
	author: string;
	role: string;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface RiskReversal {
	text: string;
}
