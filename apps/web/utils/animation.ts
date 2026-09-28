import type { Transition, Variants } from 'framer-motion';
import gsap from 'gsap';

import { animationConfig } from '@/configs/animation';

/** The time-valued keys of a Motion transition — everything else is shape. */
const TIMED_KEYS = [
	'duration',
	'delay',
	'delayChildren',
	'staggerChildren',
	'repeatDelay'
] as const;

/**
 * Slows every GSAP tween, timeline, delay and scrub catch-up at once. Called
 * at module scope from the smooth-scroll shell, which every landing page
 * loads before any of its animations are built.
 */
export function applyAnimationSpeed() {
	gsap.globalTimeline.timeScale(animationConfig.speed);
}

/**
 * A GSAP duration that must stay in real time despite the global time scale —
 * scroll catch-up is input latency, not animation, so slowing it only makes
 * the page feel heavy.
 */
export function realTimeSeconds(seconds: number) {
	return seconds * animationConfig.speed;
}

/** An authored duration or delay in ms, at the configured speed. */
export function scaleMs(ms: number) {
	return ms * animationConfig.durationScale;
}

/** An authored duration or delay in seconds, at the configured speed. */
export function scaleSeconds(seconds: number) {
	return seconds * animationConfig.durationScale;
}

/**
 * A Motion transition at the configured speed. Motion has no global clock to
 * slow, so each authored transition goes through here instead.
 */
export function scaleTransition<T extends Transition>(transition: T): T {
	const scaled: Record<string, unknown> = { ...transition };

	TIMED_KEYS.forEach((key) => {
		const value = scaled[key];
		if (typeof value === 'number') scaled[key] = scaleSeconds(value);
	});

	// A spring has no duration to stretch. Dividing stiffness by the scale
	// squared and damping by the scale slows it by exactly that factor while
	// keeping the same damping ratio — the same settle, just longer.
	const scale = animationConfig.durationScale;
	if (typeof scaled.stiffness === 'number') {
		scaled.stiffness = scaled.stiffness / (scale * scale);
	}
	if (typeof scaled.damping === 'number') {
		scaled.damping = scaled.damping / scale;
	}

	return scaled as T;
}

/** Motion variants with every state's transition at the configured speed. */
export function scaleVariants<T extends Variants>(variants: T): T {
	return Object.fromEntries(
		Object.entries(variants).map(([name, target]) => [
			name,
			typeof target === 'object' && target.transition
				? {
						...target,
						transition: scaleTransition(target.transition)
					}
				: target
		])
	) as T;
}
