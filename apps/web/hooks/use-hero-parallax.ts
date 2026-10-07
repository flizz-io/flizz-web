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
	enabled: boolean;
	/**
	 * Large screens: the hero holds while the next section slides up over it,
	 * rather than each plane trailing the page on its way out.
	 */
	holds: boolean;
	/** Whatever else the parallax should re-measure after. */
	dependencies: unknown[];
}

/**
 * The cinematic hero's depth, in two GSAP layers:
 *
 * - **Exit** — large screens: the stage holds (`hold`) while Services slides
 *   up over it, the copy blurring away. Small screens: each plane trails or
 *   leads the page by its own share (`scroll`). Either way it starts at the
 *   top of the page: the hero is the first thing on it, and the stage hands
 *   over on its own time rather than on scroll.
 * - **Pointer** — the planes lean with the cursor (`pointer`). This moves
 *   each plane's inner `[data-hero-pointer]` layer, so it never shares a
 *   transform with the scroll layers above.
 *
 * Every depth lives in `heroParallax` (constants/home.ts).
 */
export function useHeroParallax({
	sectionRef,
	enabled,
	holds,
	dependencies
}: HeroParallaxOptions) {
	useGSAP(
		() => {
			const section = sectionRef.current;
			if (!enabled || !section) return;

			const { layers } = heroParallax;
			const plane = (depth: HeroDepth) =>
				gsap.utils.toArray<HTMLElement>(
					`[data-hero-depth="${depth}"]`,
					section
				);

			// The hero is gone once its bottom edge clears the top — its own
			// offset plus its height, from the top of the page.
			const exitEnd = () => section.offsetTop + section.offsetHeight;

			const exit = gsap.timeline({
				defaults: { ease: 'none', duration: 1 },
				scrollTrigger: {
					start: 0,
					end: exitEnd,
					scrub: true,
					invalidateOnRefresh: true
				}
			});

			Object.values(HeroDepth).forEach((depth) => {
				const targets = plane(depth);
				// Large screens: counter the exit scroll, so the stage holds
				// while the next section covers it. Otherwise trail the page.
				const share = holds ? layers[depth].hold : layers[depth].scroll;
				if (!targets.length || !share) return;

				exit.fromTo(
					targets,
					{ y: 0 },
					{
						y: () =>
							share * (holds ? exitEnd() : section.offsetHeight)
					},
					0
				);
			});

			// Large screens only: below `lg` the copy sits under the scene and
			// is still being read as the page starts to move.
			if (holds) {
				const { exit: leave } = heroParallax;
				const [copy] = plane(HeroDepth.COPY);
				const [scene] = plane(HeroDepth.SCENE);

				if (copy) {
					exit.fromTo(
						copy,
						{ autoAlpha: 1, scale: 1, filter: 'blur(0px)' },
						{
							autoAlpha: 0,
							scale: leave.copyScale,
							filter: `blur(${leave.copyBlur}px)`,
							duration: leave.copyShare
						},
						0
					);
				}
				if (scene) {
					exit.fromTo(
						scene,
						{ autoAlpha: 1 },
						{ autoAlpha: leave.sceneOpacity },
						0
					);
				}
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
			dependencies: [enabled, holds, ...dependencies],
			// Every rebuild replaces the planes' transforms rather than
			// stacking a second set of them on top.
			revertOnUpdate: true,
			scope: sectionRef
		}
	);
}
