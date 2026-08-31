export interface HeroDiscipline {
	label: string;
	/** One line on what the discipline actually contributes. */
	caption: string;
}

export interface Stat {
	value: string;
	/** Unit, set smaller and italic beside the value. */
	suffix?: string;
	label: string;
	/**
	 * No real figure yet. Rendered provisionally so a placeholder can't be
	 * mistaken for a claim we've actually made.
	 */
	pending?: boolean;
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
