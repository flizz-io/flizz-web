/** Where the page intro is — drives the header entrance. */
export enum IntroPhase {
	/** Nothing has revealed yet (or this page has no intro). */
	IDLE = 'idle',
	/** The loader is opening; the header and hero are making their entrance. */
	REVEALING = 'revealing',
	/** Entrance finished; everything is interactive. */
	DONE = 'done'
}

/**
 * Written to `html[data-intro]` before first paint, so CSS alone can hide the
 * loader (or hold the header back) without a flash either way.
 */
export enum IntroGate {
	PLAY = 'play',
	SKIP = 'skip'
}
