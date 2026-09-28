/**
 * Playback speed for every landing-page animation when
 * `NEXT_PUBLIC_ANIMATION_SPEED` is unset or not a usable number. `1` plays
 * everything as authored; below `1` is slower, above `1` faster.
 */
export const defaultAnimationSpeed = 0.7;

/** A speed outside these is clamped — past them nothing reads as motion. */
export const animationSpeedBounds = { min: 0.1, max: 3 } as const;

/**
 * The custom property every CSS duration and delay is multiplied by (see the
 * `duration-*` / `delay-*` overrides in `@workspace/ui/globals.css`). Set on
 * `<html>` by the root layout; unset elsewhere, it falls back to `1`.
 */
export const animationScaleProperty = '--motion-scale';

/**
 * The scroll-driven motion system (after forgeautomotive.co.uk): nothing plays
 * on a clock — every entrance, exit and fill is scrubbed to the scroll, so it
 * moves exactly as fast as the reader does, stops when they stop, and runs
 * backwards when they scroll back up. Trigger positions are ScrollTrigger
 * `start` / `end` strings; distances are px unless noted.
 */
export const scrollReveal = {
	/** `<Reveal>` items — rise and fade in over this stretch of scroll. */
	item: {
		y: 40,
		/** Viewport % the item's top enters at and settles by. */
		enterAt: 96,
		settleAt: 66,
		/** Viewport % a `delay` of 100ms shifts both by, as a stagger. */
		percentPer100ms: 4,
		ease: 'power2.out'
	},
	/** `<Reveal trigger="mount">` — above the fold, so it plays on a clock. */
	mount: { y: 28, blur: 6, duration: 1.1, ease: 'expo.out' },
	/** Each direct child of a `[data-section-reveal]` section. */
	section: {
		y: 72,
		/** Below `lg`, where the same travel crowds a narrow screen. */
		yCompact: 40,
		start: 'top 98%',
		end: 'top 55%',
		ease: 'power2.out'
	},
	/**
	 * Section to section: the next section slides up over this one while this
	 * one sinks at `sink` of the scroll speed and dims toward the page colour.
	 */
	curtain: { sink: 0.5, sinkCompact: 0.3, dim: 0.6 },
	/** `SectionHeader` titles fill letter by letter from `rest` opacity. */
	heading: {
		rest: 0.14,
		start: 'top 88%',
		end: 'top 45%',
		stagger: 0.04
	},
	/** `[data-reveal-media]` — a plate wiped open from an inset, zooming out. */
	media: {
		/** Where the wipe opens from, and where it ends — past the edges, so
		    nothing drawn around the plate (a shadow) is left cut off. */
		from: 'inset(14% 10% 14% 10% round 24px)',
		to: 'inset(-12% -12% -12% -12% round 12px)',
		/** `[data-media-zoom]` inside the plate settles from this scale. */
		zoom: 1.25,
		start: 'top 100%',
		end: 'top 40%'
	}
} as const;
