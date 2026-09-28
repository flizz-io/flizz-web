'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

import { scrollReveal } from '@/constants/animation';
import { cn } from '@workspace/ui/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

interface RevealProps {
	children: React.ReactNode;
	/**
	 * Stagger, in ms. Scrubbed reveals have no clock, so this shifts where in
	 * the scroll the item starts — later items rise a little further down.
	 */
	delay?: number;
	trigger?: 'view' | 'mount';
	/** Anchor target, for sections that get linked to directly. */
	id?: string;
	className?: string;
}

/**
 * Rises and fades into place with the scroll — scrubbed, so it moves exactly
 * as fast as the reader does and sinks back out when they scroll up. `mount`
 * is for above-the-fold content, where there's no scroll to follow: it plays
 * once, on a clock.
 *
 * Carries `data-revealed` while it's in, for children that finish their own
 * flourish off it (`group-data-[revealed=true]/reveal:*`).
 */
export function Reveal({
	children,
	delay = 0,
	trigger = 'view',
	id,
	className
}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const node = ref.current;
			if (!node) return;

			const setRevealed = (revealed: boolean) => {
				node.dataset.revealed = String(revealed);
			};

			if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
				setRevealed(true);
				return;
			}

			setRevealed(false);

			if (trigger === 'mount') {
				const { mount } = scrollReveal;

				gsap.fromTo(
					node,
					{
						autoAlpha: 0,
						y: mount.y,
						filter: `blur(${mount.blur}px)`
					},
					{
						autoAlpha: 1,
						y: 0,
						filter: 'blur(0px)',
						duration: mount.duration,
						ease: mount.ease,
						delay: delay / 1000,
						clearProps: 'opacity,visibility,transform,filter',
						onStart: () => setRevealed(true)
					}
				);
				return;
			}

			const { item } = scrollReveal;
			const shift = (delay / 100) * item.percentPer100ms;

			// `yPercent`, not `y`: a Reveal that is itself a section part
			// also sinks with the section's curtain, which moves `y`.
			gsap.fromTo(
				node,
				{
					autoAlpha: 0,
					yPercent: () =>
						(item.y / Math.max(node.offsetHeight, 1)) * 100
				},
				{
					autoAlpha: 1,
					yPercent: 0,
					ease: item.ease,
					scrollTrigger: {
						trigger: node,
						invalidateOnRefresh: true,
						start: `top ${item.enterAt - shift}%`,
						end: `top ${item.settleAt - shift}%`,
						scrub: true,
						onEnter: () => setRevealed(true),
						onLeaveBack: () => setRevealed(false)
					}
				}
			);
		},
		{ dependencies: [delay, trigger], scope: ref }
	);

	return (
		<div
			ref={ref}
			id={id}
			// Section reveals leave this to animate its own entrance.
			data-reveal
			className={cn('group/reveal', className)}
		>
			{children}
		</div>
	);
}
