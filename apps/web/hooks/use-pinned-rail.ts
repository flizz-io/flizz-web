'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMemo, useState } from 'react';

import { useSmoother } from '@/contexts/smooth-scroll-context';
import type { SmoothScroller } from '@/hooks/use-smooth-scroll';
import { pendingScrollTop, scrollToPosition } from '@/utils/scroll';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Tailwind `lg` — where the rail runs sideways at all. */
const DESKTOP_QUERY = '(min-width: 1024px)';

export interface PinnedRailScroller extends SmoothScroller {
	/**
	 * Step the rail by a delta as one eased page scroll — for the arrows,
	 * where handing the whole distance over at once would read as a jump.
	 */
	glideBy: (delta: number) => void;
}

/**
 * Turns a horizontal rail into part of the page's own scroll (large screens).
 *
 * The rail pins in the middle of the viewport and the page's vertical scroll
 * pans it, 1:1 — scrolling down moves it forward, scrolling up moves it back.
 * It pans the viewport's native `scrollLeft`, so everything that already
 * watches the strip (edge counts, arrows, cursor) keeps working unchanged.
 *
 * While pinned it returns a `SmoothScroller` whose every move is a *page*
 * scroll: drag, arrows and horizontal wheel input set the page position that
 * shows the requested `scrollLeft`, and the pin does the rest. So there is one
 * source of truth — the page — and input of any kind glides the same way.
 * Returns `null` when not pinned (small screens, reduced motion); the caller
 * falls back to its own scroller.
 */
export function usePinnedRail(
	pinRef: React.RefObject<HTMLElement | null>,
	viewportRef: React.RefObject<HTMLElement | null>
): PinnedRailScroller | null {
	const smoother = useSmoother();
	const reducedMotion = usePrefersReducedMotion();
	const [trigger, setTrigger] = useState<ScrollTrigger | null>(null);

	useGSAP(
		() => {
			const pin = pinRef.current;
			const viewport = viewportRef.current;
			// Measured inside the smoother, never against the raw page.
			if (!pin || !viewport || !smoother || reducedMotion) return;

			const media = gsap.matchMedia();

			media.add(DESKTOP_QUERY, () => {
				const travel = () =>
					Math.max(viewport.scrollWidth - viewport.clientWidth, 0);

				const pan = gsap.fromTo(
					viewport,
					{ scrollLeft: 0 },
					{
						scrollLeft: travel,
						ease: 'none',
						scrollTrigger: {
							trigger: pin,
							pin: true,
							start: 'center center',
							end: () => `+=${travel()}`,
							// The smoother already eases the page; the rail
							// rides that rather than lagging a second time.
							scrub: true,
							invalidateOnRefresh: true
						}
					}
				);

				setTrigger(pan.scrollTrigger ?? null);
				// Created after the triggers below it, so re-measure them all
				// with this pin's spacing in place.
				ScrollTrigger.sort();
				ScrollTrigger.refresh();

				return () => setTrigger(null);
			});

			return () => media.revert();
		},
		{ dependencies: [smoother, reducedMotion] }
	);

	return useMemo(() => {
		if (!trigger || !smoother) return null;

		// 1:1, so a rail position is simply its distance into the pin.
		const clamp = (left: number) =>
			Math.min(Math.max(left, 0), trigger.end - trigger.start);
		const scrollTo = (left: number) =>
			smoother.scrollTop(trigger.start + clamp(left));

		return {
			scrollTo,
			// From where the page is heading, not where the content has
			// caught up to, so repeated input stacks instead of being eaten.
			scrollBy: (delta: number) =>
				scrollTo(smoother.scrollTop() - trigger.start + delta),
			// Settle the page on what's showing right now.
			stop: () => scrollTo(viewportRef.current?.scrollLeft ?? 0),
			glideBy: (delta: number) => {
				const from = pendingScrollTop(smoother) - trigger.start;

				scrollToPosition(
					smoother,
					trigger.start + clamp(from + delta),
					{
						glide: true
					}
				);
			}
		};
	}, [smoother, trigger, viewportRef]);
}
