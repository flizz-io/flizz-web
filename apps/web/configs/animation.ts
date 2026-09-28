import {
	animationSpeedBounds,
	defaultAnimationSpeed
} from '@/constants/animation';

/**
 * Inlined at build time, so a change needs a rebuild (or a dev-server
 * restart). Anything unparseable falls back to the default rather than
 * freezing or racing the page.
 */
function resolveAnimationSpeed(raw: string | undefined) {
	const speed = Number(raw);
	if (!raw || !Number.isFinite(speed) || speed <= 0) {
		return defaultAnimationSpeed;
	}

	return Math.min(
		Math.max(speed, animationSpeedBounds.min),
		animationSpeedBounds.max
	);
}

const speed = resolveAnimationSpeed(process.env.NEXT_PUBLIC_ANIMATION_SPEED);

export const animationConfig = {
	/** Multiplies elapsed time — GSAP's global time scale, scene clocks. */
	speed,
	/** Multiplies authored durations and delays — CSS and Motion. */
	durationScale: 1 / speed
} as const;
