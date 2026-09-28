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
 * The one scroll-reveal feel. Items (`<Reveal>`) rise a little and come into
 * focus; whole sections below the hero rise further and slower first, so
 * their items cascade in after them.
 */
export const scrollReveal = {
	/**
	 * Plays on the way in; and if a jump (End key, an anchor link, a long
	 * cinematic scroll) carries the page clean past a reveal, completes it —
	 * by default GSAP does nothing then, leaving that content hidden.
	 */
	toggleActions: 'play complete none none',
	item: {
		y: 28,
		blur: 6,
		duration: 1.1,
		ease: 'expo.out',
		start: 'top 88%'
	},
	section: {
		y: 56,
		duration: 1.4,
		ease: 'expo.out',
		start: 'top 92%',
		stagger: 0.12
	}
} as const;
