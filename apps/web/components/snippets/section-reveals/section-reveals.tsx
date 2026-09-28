'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { scrollReveal } from '@/constants/animation';
import { useSmoother } from '@/contexts/smooth-scroll-context';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SECTION_SELECTOR = '[data-section-reveal]';
/** Tailwind `lg`. */
const DESKTOP_QUERY = '(min-width: 1024px)';
/** A pin, or the spacer ScrollTrigger wraps one in. */
const PIN_SELECTOR = '[data-pinned], .pin-spacer';
/** A `<Reveal>`, which scrubs its own entrance. */
const REVEAL_SELECTOR = '[data-reveal]';
const MEDIA_SELECTOR = '[data-reveal-media]';
const MEDIA_ZOOM_SELECTOR = '[data-media-zoom]';
/** Read by the section's `::after` veil in `@workspace/ui/globals.css`. */
const DIM_PROPERTY = '--curtain-dim';

/**
 * Whether a part can move as well as fade. A pin — or anything around one —
 * must never be transformed, or the pin measures against a moved box; and a
 * part that already carries its own translate (a centred glow) would lose it
 * to GSAP's transform, so those only fade.
 */
function canMove(part: HTMLElement) {
	if (part.matches(PIN_SELECTOR) || part.querySelector(PIN_SELECTOR)) {
		return false;
	}

	const style = getComputedStyle(part);

	return style.translate === 'none' && style.transform === 'none';
}

/**
 * Every `[data-section-reveal]` section's motion, scrubbed to the scroll:
 *
 * - **Entrance** — each direct child rises and fades in over its own stretch
 *   of scroll, so a section assembles top to bottom as it arrives.
 * - **Curtain** — as a section leaves, the next one slides up over it while
 *   it sinks at half the scroll speed and dims toward the page colour, so it
 *   reads as falling away behind rather than scrolling off. (The stacking and
 *   the veil are CSS on `[data-section-reveal]`.) The last section is left to
 *   scroll off under the footer normally.
 *
 * - **Media** — `[data-reveal-media]` plates wipe open from an inset, and a
 *   `[data-media-zoom]` layer inside settles from a zoom.
 *
 * Entrance moves `yPercent` and the curtain moves `y`, so the two compose
 * rather than fight when a short section is still arriving as it starts to
 * leave. The section element itself never moves, so anything that measures a
 * section (anchor jumps, "See the works") lands true. Mount once per page,
 * after the sections.
 */
export function SectionReveals() {
	const smoother = useSmoother();
	const reducedMotion = usePrefersReducedMotion();

	useGSAP(
		() => {
			// After the smoother, so every trigger measures inside it.
			if (!smoother || reducedMotion) return;

			const { section, curtain } = scrollReveal;
			const sections = gsap.utils.toArray<HTMLElement>(SECTION_SELECTOR);
			// Phones get the same motion over shorter travel.
			const compact = !window.matchMedia(DESKTOP_QUERY).matches;
			const rise = compact ? section.yCompact : section.y;
			const sink = compact ? curtain.sinkCompact : curtain.sink;

			sections.forEach((node, index) => {
				const parts = Array.from(node.children).filter(
					(child): child is HTMLElement =>
						child instanceof HTMLElement
				);
				const moving = parts.filter(canMove);

				parts.forEach((part) => {
					// A `<Reveal>` part scrubs its own entrance; two tweens on
					// one opacity would fight. It still sinks with the curtain.
					if (part.matches(REVEAL_SELECTOR)) return;

					// Read before anything is tweened: a faint backdrop
					// (`opacity-[0.05]`) fades up to its own opacity, never
					// past it.
					const opacity = Number(getComputedStyle(part).opacity);
					const move = moving.includes(part);

					gsap.fromTo(
						part,
						{
							autoAlpha: 0,
							...(move && {
								yPercent: () =>
									(rise / Math.max(part.offsetHeight, 1)) *
									100
							})
						},
						{
							autoAlpha: opacity,
							...(move && { yPercent: 0 }),
							ease: section.ease,
							scrollTrigger: {
								trigger: part,
								start: section.start,
								end: section.end,
								scrub: true,
								invalidateOnRefresh: true
							}
						}
					);
				});

				if (index === sections.length - 1) return;

				const leave = gsap.timeline({
					defaults: { ease: 'none' },
					scrollTrigger: {
						trigger: node,
						start: 'bottom bottom',
						end: 'bottom top',
						scrub: true,
						invalidateOnRefresh: true
					}
				});

				leave.fromTo(
					node,
					{ [DIM_PROPERTY]: 0 },
					{ [DIM_PROPERTY]: curtain.dim },
					0
				);

				if (moving.length) {
					leave.fromTo(
						moving,
						{ y: 0 },
						{ y: () => window.innerHeight * sink },
						0
					);
				}
			});

			// Media plates wipe open from an inset while what's inside settles
			// from a zoom — the plate framing the picture as it arrives.
			const { media } = scrollReveal;

			gsap.utils.toArray<HTMLElement>(MEDIA_SELECTOR).forEach((plate) => {
				const scrollTrigger = {
					trigger: plate,
					start: media.start,
					end: media.end,
					scrub: true
				};

				gsap.fromTo(
					plate,
					{ clipPath: media.from },
					{ clipPath: media.to, ease: 'power2.out', scrollTrigger }
				);

				const zoom = plate.querySelector(MEDIA_ZOOM_SELECTOR);
				if (zoom) {
					gsap.fromTo(
						zoom,
						{ scale: media.zoom },
						{ scale: 1, ease: 'none', scrollTrigger }
					);
				}
			});

			ScrollTrigger.sort();
			ScrollTrigger.refresh();
		},
		{ dependencies: [smoother, reducedMotion] }
	);

	return null;
}
