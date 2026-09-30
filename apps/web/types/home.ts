import type { HeroDepth } from '@/enums/home';

export interface HeroDiscipline {
	label: string;
	/** One line on what the discipline actually contributes. */
	caption: string;
}

/** The tuning dials for the hero constellation, kept out of the component. */
/** Controls for the cinematic hero — see docs/requirements/home-hero-cinematic.md. */
export interface HeroCinematicConfig {
	/** Minimum loader time in real seconds from navigation start, clamped 1.5–4. */
	loaderSeconds: number;
	/** Off skips straight to the reveal. */
	showLoader: boolean;
	/** Pinned scroll travel, as % of the viewport height. */
	scrollDistance: number;
	/** Idle seconds before the hand-off plays itself; 0 disables. */
	autoAdvanceSeconds: number;
	/** The headline's rotating third line; the first is the accessible one. */
	rotatingPhrases: string[];
	/** How long each phrase holds, in seconds. */
	phraseHoldSeconds: number;
}

/** How one hero plane moves — see `heroParallax` in constants/home.ts. */
export interface HeroParallaxLayer {
	/**
	 * Small screens, as the hero scrolls away: how far the plane trails (+)
	 * or leads (−) the page, as a share of the hero's height. 0 moves with
	 * the page.
	 */
	scroll: number;
	/**
	 * Large screens, as the Services section slides up over the hero: the
	 * share of that scroll the plane counters. 1 holds it perfectly still;
	 * a little under 1 lets it drift up a touch, for depth.
	 */
	hold: number;
	/** During the pinned hand-off: a vertical drift, in % of its own height. */
	pinned: number;
	/**
	 * With the pointer at the hero's edge: px the plane follows (+) or
	 * counters (−) it. Fine pointers only; 0 holds the plane still.
	 */
	pointer: number;
}

export interface HeroParallaxConfig {
	layers: Record<HeroDepth, HeroParallaxLayer>;
	/** Seconds the pointer planes take to catch the cursor. */
	pointerFollowSeconds: number;
	/**
	 * Large screens, as the hero leaves: the copy swells to `copyScale`,
	 * blurs to `copyBlur` px and fades out over the first `copyShare` of the
	 * exit; the scene dims to `sceneOpacity`.
	 */
	exit: {
		copyScale: number;
		copyBlur: number;
		copyShare: number;
		sceneOpacity: number;
	};
}

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

/**
 * `carousel` — the stages advance on a timer, picked from the rail.
 * `scroll` — the section pins like Problem and the page's scroll drives the
 *   stages (large screens; the carousel stands in below `lg` and under
 *   reduced motion).
 */
export type SolutionVariation = 'carousel' | 'scroll';

/** What every Our Process variation takes from the page. */
export interface SolutionVariationProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
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
