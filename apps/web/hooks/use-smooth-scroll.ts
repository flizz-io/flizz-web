'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';

/** Share of the remaining distance covered each frame — lower glides longer. */
const EASE = 0.12;
/** Close enough to call the glide finished, in px. */
const SETTLE_DISTANCE = 0.5;

export interface SmoothScroller {
	/** Glide to an absolute `scrollLeft`, clamped to the scrollable range. */
	scrollTo: (left: number) => void;
	/** Glide by a delta, stacking onto any glide already in flight. */
	scrollBy: (delta: number) => void;
	/** Halt wherever the glide currently is. */
	stop: () => void;
}

/**
 * Eased horizontal scrolling for a container, driven by one rAF loop that
 * chases a target position.
 *
 * Everything that moves the strip — drag, inertia, wheel, arrow buttons —
 * writes the target rather than `scrollLeft`, so input from any of them
 * blends into the same glide instead of each one jumping on its own. The
 * position is tracked here rather than re-read from `scrollLeft`, because
 * browsers round that to device pixels and a sub-pixel step would never land.
 */
export function useSmoothScroll(
	ref: React.RefObject<HTMLElement | null>
): SmoothScroller {
	const reducedMotion = usePrefersReducedMotion();
	const frame = useRef<number | null>(null);
	const current = useRef(0);
	const target = useRef(0);

	const stop = useCallback(() => {
		if (frame.current === null) return;

		cancelAnimationFrame(frame.current);
		frame.current = null;
	}, []);

	const clamp = useCallback(
		(left: number) => {
			const node = ref.current;
			if (!node) return left;

			const max = node.scrollWidth - node.clientWidth;

			return Math.min(Math.max(left, 0), Math.max(max, 0));
		},
		[ref]
	);

	/** Starts the chase loop; a named inner step lets it re-queue itself. */
	const run = useCallback(() => {
		const step = () => {
			const node = ref.current;
			if (!node) {
				frame.current = null;
				return;
			}

			const distance = target.current - current.current;

			if (Math.abs(distance) < SETTLE_DISTANCE) {
				node.scrollLeft = target.current;
				frame.current = null;
				return;
			}

			current.current += distance * EASE;
			node.scrollLeft = current.current;
			frame.current = requestAnimationFrame(step);
		};

		frame.current = requestAnimationFrame(step);
	}, [ref]);

	const scrollTo = useCallback(
		(left: number) => {
			const node = ref.current;
			if (!node) return;

			target.current = clamp(left);

			if (reducedMotion) {
				node.scrollLeft = target.current;
				return;
			}

			if (frame.current !== null) return;

			// Starting fresh: pick up wherever the strip really is, in case
			// something outside this hook (keyboard, scrollbar) moved it.
			current.current = node.scrollLeft;
			run();
		},
		[clamp, reducedMotion, ref, run]
	);

	const scrollBy = useCallback(
		(delta: number) => {
			const node = ref.current;
			if (!node) return;

			const base =
				frame.current === null ? node.scrollLeft : target.current;
			scrollTo(base + delta);
		},
		[ref, scrollTo]
	);

	useEffect(() => stop, [stop]);

	return useMemo(
		() => ({ scrollTo, scrollBy, stop }),
		[scrollBy, scrollTo, stop]
	);
}
