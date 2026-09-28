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
	/** Extra wait before it plays, in ms. */
	delay?: number;
	trigger?: 'view' | 'mount';
	/** Anchor target, for sections that get linked to directly. */
	id?: string;
	className?: string;
}

/**
 * Rises and sharpens into place once it scrolls into view (or on mount) — the
 * site's one item reveal, in GSAP so it shares the page's clock and speed.
 *
 * Carries `data-revealed` once it has played, for children that finish their
 * own flourish off it (`group-data-[revealed=true]/reveal:*`). Everything it
 * animated is cleared afterwards, so no stray transform is left creating a
 * containing block around the content.
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

			const markRevealed = () => {
				node.dataset.revealed = 'true';
			};

			if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
				markRevealed();
				return;
			}

			const { item } = scrollReveal;
			node.dataset.revealed = 'false';

			gsap.fromTo(
				node,
				{ autoAlpha: 0, y: item.y, filter: `blur(${item.blur}px)` },
				{
					autoAlpha: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: item.duration,
					ease: item.ease,
					delay: delay / 1000,
					clearProps: 'opacity,visibility,transform,filter',
					onStart: markRevealed,
					scrollTrigger:
						trigger === 'view'
							? {
									trigger: node,
									start: item.start,
									toggleActions: scrollReveal.toggleActions,
									once: true
								}
							: undefined
				}
			);
		},
		{ dependencies: [delay, trigger], scope: ref }
	);

	return (
		<div
			ref={ref}
			id={id}
			className={cn('group/reveal', className)}
		>
			{children}
		</div>
	);
}
