export interface HeroDiscipline {
	label: string;
	/** One line on what the discipline actually contributes. */
	caption: string;
}

/** The tuning dials for the hero constellation, kept out of the component. */
export interface HeroDisciplinesSceneConfig {
	/** Size of the whole constellation, 0–100, where 50 is the composed size. */
	sceneScale: number;
	/** Size of the centre object on the same 0–100 scale. */
	centerObjectScale: number;
	/** Discipline label size, in px. */
	labelFontSize: number;
	/** Caption size under each label, in px. */
	captionFontSize: number;
	/** How many points scatter around each discipline's hub. */
	clusterPointCount: number;
	/** Whether to show the discipline's background. */
	hasDisciplineBg: boolean;
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
