'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSmoother } from '@/contexts/smooth-scroll-context';
import type { SmoothScroller } from '@/hooks/use-smooth-scroll';
import {
	pendingScrollTop,
	queueScrollRefresh,
	scrollToPosition
} from '@/utils/scroll';
import { restingProgress, stepPosition } from '@/utils/scroll-steps';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Tailwind `lg` — where the rail runs sideways at all. */
const DESKTOP_QUERY = '(min-width: 1024px)';
/**
 * Share of each item's scroll the move to the next plays across. Wider than
 * Our Process's: the rail travels sideways, and a longer ease reads calmer.
 */
const RAIL_BLEND = 0.4;

export interface PinnedRailScroller extends SmoothScroller {
	/**
	 * Glide the page to the item `steps` away from the one showing (−1 back,
	 * 1 forward) — for the arrows, so a click is always exactly one item.
	 */
	stepBy: (steps: number) => void;
}

interface PinnedRailOptions {
	/** How many items the rail carries. */
	steps: number;
	/**
	 * On, the rail stops on each item (`stepScrollVh` of scroll apiece,
	 * settling onto the nearer one). Off, it pans 1:1 with the page scroll.
	 */
	stepped: boolean;
	/** Stepped only: page scroll each item holds the rail for, in vh. */
	stepScrollVh: number;
	/**
	 * The rail's continuous position in items (0 → `steps - 1`) while it is
	 * pinned, with the scroll's direction (1 down, −1 up, 0 while a snap is
	 * settling it — that move is the rail's, not the reader's) — or `null`
	 * whenever it isn't pinned (before, after, or with no pin).
	 */
	onPosition?: (position: number | null, direction: number) => void;
}

/** How page scroll maps onto the rail — stepped or 1:1. */
interface RailMapping {
	/** Page scroll the pin lasts for, in px. */
	distance: number;
	/** Pin progress (0 → 1) → the rail's position in items. */
	positionAt: (progress: number) => number;
	/** The page offset (into the pin) where item `step` rests. */
	offsetOf: (step: number) => number;
	/** A page offset as a fractional item, unstepped, so moves stack. */
	stepAt: (offset: number) => number;
}

function railMapping(
	steps: number,
	stepped: boolean,
	stepScrollVh: number,
	travel: number
): RailMapping {
	const last = Math.max(steps - 1, 1);

	if (!stepped) {
		// 1:1 — a pixel of page scroll is a pixel of rail.
		return {
			distance: travel,
			positionAt: (progress) => progress * (steps - 1),
			offsetOf: (step) => (step / last) * travel,
			stepAt: (offset) => (travel ? (offset / travel) * last : 0)
		};
	}

	const distance = (window.innerHeight * stepScrollVh * steps) / 100;

	return {
		distance,
		positionAt: (progress) =>
			stepPosition(progress * steps, steps, RAIL_BLEND),
		offsetOf: (step) => ((step + 0.5) / steps) * distance,
		stepAt: (offset) => (offset / distance) * steps - 0.5
	};
}

/**
 * Turns a horizontal rail into part of the page's own scroll (large screens).
 *
 * The rail pins in the middle of the viewport and the page's vertical scroll
 * moves it. Stepped, it walks item by item: each item owns `stepScrollVh` of
 * scroll, holds the rail still for most of it, then eases it on to the next
 * across the boundary, and a scroll that stops mid-move settles onto the
 * nearer item. Unstepped, it pans 1:1. Either way scrolling up runs it back —
 * the rail's position is a function of the page's, so it can't differ by
 * direction without jumping. It pans the viewport's native `scrollLeft`, so
 * everything that already watches the strip (edge counts, arrows, cursor)
 * keeps working unchanged.
 *
 * While pinned it returns a `SmoothScroller` whose every move is a *page*
 * scroll: drag and horizontal wheel input set the page position that shows
 * the requested `scrollLeft`, and the arrows step one item. So there is one
 * source of truth — the page. Returns `null` when not pinned (small screens,
 * reduced motion); the caller falls back to its own scroller.
 */
export function usePinnedRail(
	pinRef: React.RefObject<HTMLElement | null>,
	viewportRef: React.RefObject<HTMLElement | null>,
	{ steps, stepped, stepScrollVh, onPosition }: PinnedRailOptions
): PinnedRailScroller | null {
	const smoother = useSmoother();
	const reducedMotion = usePrefersReducedMotion();
	const [trigger, setTrigger] = useState<ScrollTrigger | null>(null);
	// Read through a ref, so a new callback each render doesn't rebuild the pin.
	const onPositionRef = useRef(onPosition);

	useEffect(() => {
		onPositionRef.current = onPosition;
	}, [onPosition]);

	useGSAP(
		() => {
			const pin = pinRef.current;
			const viewport = viewportRef.current;
			// Measured inside the smoother, never against the raw page.
			if (!pin || !viewport || !smoother || reducedMotion || !steps) {
				return;
			}

			const media = gsap.matchMedia();

			media.add(DESKTOP_QUERY, () => {
				// Measured on refresh rather than every frame — reading it
				// right after writing `scrollLeft` would force a layout.
				let travel = 0;
				let mapping = railMapping(steps, stepped, stepScrollVh, 0);
				const measure = () => {
					travel = Math.max(
						viewport.scrollWidth - viewport.clientWidth,
						0
					);
					mapping = railMapping(steps, stepped, stepScrollVh, travel);
				};

				// A settle can run either way, whichever item is nearer.
				let snapping = false;

				const apply = (self: ScrollTrigger) => {
					const position = mapping.positionAt(self.progress);

					viewport.scrollLeft =
						steps > 1 ? (position / (steps - 1)) * travel : 0;
					if (self.isActive) {
						onPositionRef.current?.(
							position,
							snapping ? 0 : self.direction
						);
					}
				};

				measure();

				const rail = ScrollTrigger.create({
					trigger: pin,
					pin: true,
					start: 'center center',
					end: () => `+=${mapping.distance}`,
					invalidateOnRefresh: true,
					onRefreshInit: measure,
					onRefresh: (self) => {
						measure();
						apply(self);
					},
					onUpdate: apply,
					onToggle: (self) => {
						if (!self.isActive) {
							onPositionRef.current?.(null, self.direction);
						}
					},
					// Stopped mid-move, two items sit half shown; ease the
					// page the short way onto the nearer one instead.
					snap: stepped
						? {
								snapTo: (value) =>
									restingProgress(value, steps, RAIL_BLEND),
								delay: 0.12,
								duration: { min: 0.35, max: 0.7 },
								ease: 'power2.inOut',
								onStart: () => {
									snapping = true;
								},
								onComplete: () => {
									snapping = false;
								},
								onInterrupt: () => {
									snapping = false;
								}
							}
						: undefined
				});

				apply(rail);
				setTrigger(rail);
				// Created after the triggers below it, so re-measure them all
				// with this pin's spacing in place.
				ScrollTrigger.sort();
				queueScrollRefresh();

				return () => {
					rail.kill();
					setTrigger(null);
					onPositionRef.current?.(null, 1);
				};
			});

			return () => media.revert();
		},
		{
			dependencies: [
				smoother,
				reducedMotion,
				steps,
				stepped,
				stepScrollVh
			]
		}
	);

	return useMemo(() => {
		if (!trigger || !smoother) return null;

		const travel = () => {
			const viewport = viewportRef.current;

			return viewport
				? Math.max(viewport.scrollWidth - viewport.clientWidth, 0)
				: 0;
		};
		const map = () => railMapping(steps, stepped, stepScrollVh, travel());
		const clampStep = (step: number) =>
			Math.min(Math.max(step, 0), steps - 1);
		const clampOffset = (offset: number) =>
			Math.min(Math.max(offset, 0), trigger.end - trigger.start);
		/** A `scrollLeft` as a fractional item along the rail. */
		const stepOfLeft = (left: number) =>
			steps > 1 && travel() ? (left / travel()) * (steps - 1) : 0;
		const leftOfStep = (step: number) =>
			steps > 1 ? (step / (steps - 1)) * travel() : 0;
		const offsetNow = () => smoother.scrollTop() - trigger.start;

		const scrollTo = (left: number) =>
			smoother.scrollTop(
				trigger.start +
					clampOffset(map().offsetOf(clampStep(stepOfLeft(left))))
			);

		return {
			scrollTo,
			// From where the page is heading, not where the content has
			// caught up to, so repeated input stacks instead of being eaten.
			scrollBy: (delta: number) =>
				scrollTo(
					leftOfStep(clampStep(map().stepAt(offsetNow()))) + delta
				),
			// Settle the page on what's showing right now. Read from the pin's
			// own progress (it follows the smoothed scroll), not `scrollLeft`:
			// stepped, many page positions share one `scrollLeft`, and a rail
			// that fits the screen never leaves 0 — so a press would yank the
			// page back to the first item.
			stop: () =>
				smoother.scrollTop(
					trigger.start +
						trigger.progress * (trigger.end - trigger.start)
				),
			stepBy: (count: number) => {
				const mapping = map();
				const from = clampOffset(
					pendingScrollTop(smoother) - trigger.start
				);
				const current = Math.round(
					mapping.positionAt(from / (mapping.distance || 1))
				);

				scrollToPosition(
					smoother,
					trigger.start +
						clampOffset(
							mapping.offsetOf(clampStep(current + count))
						),
					{ glide: true }
				);
			}
		};
	}, [smoother, stepScrollVh, stepped, steps, trigger, viewportRef]);
}
