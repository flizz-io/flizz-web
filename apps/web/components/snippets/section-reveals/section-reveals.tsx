'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { scrollReveal } from '@/constants/animation';
import { useSmoother } from '@/contexts/smooth-scroll-context';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SECTION_SELECTOR = '[data-section-reveal]';
/** A pin, or the spacer ScrollTrigger wraps one in. */
const PIN_SELECTOR = '[data-pinned], .pin-spacer';

/**
 * Whether a part can rise as well as fade. A pin — or anything around one —
 * must never be transformed, or the pin measures against a moved box; and a
 * part that already carries its own translate (a centred glow) would lose it
 * to GSAP's transform, so those fade in place too.
 */
function canRise(part: HTMLElement) {
	if (part.matches(PIN_SELECTOR) || part.querySelector(PIN_SELECTOR)) {
		return false;
	}

	const style = getComputedStyle(part);

	return style.translate === 'none' && style.transform === 'none';
}

/**
 * The entrance for every `[data-section-reveal]` section: as a section's top
 * comes into view its parts fade and rise in, one after another, and the
 * `<Reveal>` items inside them cascade in after. Plays once.
 *
 * The section element itself never moves — only its direct children — so
 * anything that measures a section (anchor jumps, "See the works") still
 * lands true. Mount once per page, after the sections.
 */
export function SectionReveals() {
	const smoother = useSmoother();
	const reducedMotion = usePrefersReducedMotion();

	useGSAP(
		() => {
			// After the smoother, so every trigger measures inside it.
			if (!smoother || reducedMotion) return;

			const { section } = scrollReveal;

			gsap.utils
				.toArray<HTMLElement>(SECTION_SELECTOR)
				.forEach((node) => {
					const parts = Array.from(node.children).filter(
						(child): child is HTMLElement =>
							child instanceof HTMLElement
					);
					if (!parts.length) return;

					const entrance = gsap.timeline({
						scrollTrigger: {
							trigger: node,
							start: section.start,
							toggleActions: scrollReveal.toggleActions,
							once: true
						}
					});

					parts.forEach((part, index) => {
						// Read before anything is tweened: a faint backdrop
						// (`opacity-[0.05]`) fades up to its own opacity,
						// never flashing to full and snapping back.
						const opacity = Number(getComputedStyle(part).opacity);
						const at = index * section.stagger;
						const fade = {
							duration: section.duration,
							ease: section.ease
						};

						entrance.fromTo(
							part,
							{ autoAlpha: 0 },
							{
								...fade,
								autoAlpha: opacity,
								clearProps: 'opacity,visibility'
							},
							at
						);

						// Kept to its own tween, so a part that only fades
						// never has a transform written onto it at all.
						if (canRise(part)) {
							entrance.fromTo(
								part,
								{ y: section.y },
								{ ...fade, y: 0, clearProps: 'transform' },
								at
							);
						}
					});
				});

			ScrollTrigger.sort();
			ScrollTrigger.refresh();
		},
		{ dependencies: [smoother, reducedMotion] }
	);

	return null;
}
