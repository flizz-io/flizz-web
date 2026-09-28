'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';

import { heroParallax } from '@/constants/home';
import { HeroDepth } from '@/enums/home';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

interface HeroParallaxOptions {
	/**
	 * The hero. Its planes are the `[data-hero-depth]` elements inside (moved
	 * by scroll) and the `[data-hero-pointer]` ones (moved by the pointer).
	 */
	sectionRef: RefObject<HTMLElement | null>;
	/** The pinned hand-off, when there is one — the parallax hands on from it. */
	handOffRef: RefObject<ScrollTrigger | null>;
	enabled: boolean;
	pinned: boolean;
	/** Whatever rebuilds the hand-off, so the parallax re-measures after it. */
	dependencies: unknown[];
}

/**
 * The cinematic hero's depth, in three GSAP layers:
 *
 * - **Exit** — as the hero scrolls away, each plane trails or leads the page
 *   by its own share (`scroll`), so the back of the frame lingers while the
 *   copy lifts off first. Starts where the pinned hand-off ends, or at the top
 *   when nothing pins.
 * - **Hand-off** — while pinned, the atmosphere drifts (`pinned`) so the stage
 *   never reads as a flat backdrop behind the moving scene.
 * - **Pointer** — the planes lean with the cursor (`pointer`). This moves
 *   each plane's inner `[data-hero-pointer]` layer, so it never shares a
 *   transform with the scroll layers above.
 *
 * Every depth lives in `heroParallax` (constants/home.ts).
 */
export function useHeroParallax({
	sectionRef,
	handOffRef,
	enabled,
	pinned,
	dependencies
}: HeroParallaxOptions) {
	useGSAP(
		() => {
			const section = sectionRef.current;
			if (!enabled || !section) return;

			const { layers } = heroParallax;
			const handOff = pinned ? handOffRef.current : null;
			const plane = (depth: HeroDepth) =>
				gsap.utils.toArray<HTMLElement>(
					`[data-hero-depth="${depth}"]`,
					section
				);

			// The hero is gone once its bottom edge clears the top — from
			// wherever it starts moving, that's its own offset plus height.
			const exitStart = () => handOff?.end ?? 0;
			const exitEnd = () =>
				exitStart() + section.offsetTop + section.offsetHeight;

			const exit = gsap.timeline({
				defaults: { ease: 'none', duration: 1 },
				scrollTrigger: {
					start: exitStart,
					end: exitEnd,
					scrub: true,
					invalidateOnRefresh: true
				}
			});

			Object.values(HeroDepth).forEach((depth) => {
				const targets = plane(depth);
				if (!targets.length || !layers[depth].scroll) return;

				exit.fromTo(
					targets,
					{ y: 0 },
					{ y: () => layers[depth].scroll * section.offsetHeight },
					0
				);
			});

			if (handOff) {
				const drift = gsap.timeline({
					defaults: { ease: 'none', duration: 1 },
					scrollTrigger: {
						start: () => handOff.start,
						end: () => handOff.end,
						scrub: 1.2,
						invalidateOnRefresh: true
					}
				});

				Object.values(HeroDepth).forEach((depth) => {
					const targets = plane(depth);
					if (!targets.length || !layers[depth].pinned) return;

					drift.fromTo(
						targets,
						{ yPercent: 0 },
						{ yPercent: layers[depth].pinned },
						0
					);
				});
			}

			if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;

			// One follower per plane and axis; each maps the pointer's -1…1
			// across the hero to its own depth in px.
			const followers = Object.values(HeroDepth).flatMap((depth) => {
				const targets = gsap.utils.toArray<HTMLElement>(
					`[data-hero-pointer="${depth}"]`,
					section
				);
				const px = layers[depth].pointer;
				if (!targets.length || !px) return [];

				const follow = {
					duration: heroParallax.pointerFollowSeconds,
					ease: 'power3.out'
				};

				return [
					{
						px,
						x: gsap.quickTo(targets, 'x', follow),
						y: gsap.quickTo(targets, 'y', follow)
					}
				];
			});

			const lean = (x: number, y: number) =>
				followers.forEach((follower) => {
					follower.x(x * follower.px);
					follower.y(y * follower.px);
				});

			const onMove = (event: PointerEvent) => {
				// Held still while a button is down: the scene is being
				// dragged, and a frame that slid under the hand would fight it.
				if (event.buttons) return;

				const rect = section.getBoundingClientRect();
				lean(
					((event.clientX - rect.left) / rect.width) * 2 - 1,
					((event.clientY - rect.top) / rect.height) * 2 - 1
				);
			};
			const onLeave = () => lean(0, 0);

			section.addEventListener('pointermove', onMove, { passive: true });
			section.addEventListener('pointerleave', onLeave);

			return () => {
				section.removeEventListener('pointermove', onMove);
				section.removeEventListener('pointerleave', onLeave);
			};
		},
		{
			dependencies: [enabled, pinned, ...dependencies],
			scope: sectionRef
		}
	);
}
