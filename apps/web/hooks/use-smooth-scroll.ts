'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCallback, useMemo, useRef } from 'react';

import { smoothScrollEase, smoothScrollSeconds } from '@/constants/scroll';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';

gsap.registerPlugin(useGSAP);

export interface SmoothScroller {
	/** Glide to an absolute `scrollLeft`, clamped to the scrollable range. */
	scrollTo: (left: number) => void;
	/** Glide by a delta, stacking onto any glide already in flight. */
	scrollBy: (delta: number) => void;
	/** Halt wherever the glide currently is. */
	stop: () => void;
}

/**
 * GSAP-eased horizontal scrolling for a container — the same duration and
 * curve ScrollSmoother gives the page, so a strip glides like everything
 * around it.
 *
 * Everything that moves the strip — drag, flick momentum, wheel, arrow
 * buttons — retargets one `quickTo` tween rather than writing `scrollLeft`,
 * so input from any of them blends into a single glide instead of each one
 * jumping on its own.
 */
export function useSmoothScroll(
	ref: React.RefObject<HTMLElement | null>
): SmoothScroller {
	const reducedMotion = usePrefersReducedMotion();
	const glide = useRef<gsap.QuickToFunc | null>(null);
	const target = useRef(0);

	useGSAP(
		() => {
			const node = ref.current;
			if (!node || reducedMotion) return;

			glide.current = gsap.quickTo(node, 'scrollLeft', {
				duration: smoothScrollSeconds,
				ease: smoothScrollEase
			});

			return () => {
				glide.current = null;
			};
		},
		{ dependencies: [reducedMotion] }
	);

	const clamp = useCallback(
		(left: number) => {
			const node = ref.current;
			if (!node) return left;

			const max = Math.max(node.scrollWidth - node.clientWidth, 0);

			return Math.min(Math.max(left, 0), max);
		},
		[ref]
	);

	const scrollTo = useCallback(
		(left: number) => {
			const node = ref.current;
			if (!node) return;

			target.current = clamp(left);

			if (glide.current) glide.current(target.current);
			else node.scrollLeft = target.current;
		},
		[clamp, ref]
	);

	const scrollBy = useCallback(
		(delta: number) => {
			const node = ref.current;
			if (!node) return;

			// Mid-glide, stack onto where it's heading rather than where it
			// happens to be, so quick repeated input adds up instead of
			// being partly swallowed.
			const base = gsap.isTweening(node)
				? target.current
				: node.scrollLeft;
			scrollTo(base + delta);
		},
		[ref, scrollTo]
	);

	const stop = useCallback(() => {
		const node = ref.current;
		if (!node || !glide.current) return;

		// Retarget onto the current position, starting from it: the tween
		// settles instantly without being killed, so it stays reusable.
		target.current = node.scrollLeft;
		glide.current(node.scrollLeft, node.scrollLeft);
	}, [ref]);

	return useMemo(
		() => ({ scrollTo, scrollBy, stop }),
		[scrollBy, scrollTo, stop]
	);
}
