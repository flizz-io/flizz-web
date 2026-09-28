'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef, type ReactNode } from 'react';

import { scrollReveal } from '@/constants/animation';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

interface FillHeadingProps {
	children: ReactNode;
	className?: string;
}

/**
 * A section title that fills in letter by letter with the scroll: every
 * character starts faint and brightens to full as the heading travels up the
 * viewport, then fades back when the reader scrolls up. Accent phrases keep
 * their own colour — only opacity moves.
 *
 * Split into words *and* characters, so a word never breaks across lines;
 * `aria: 'auto'` keeps the heading reading as one phrase to assistive tech.
 * `autoSplit` re-splits on resize and font load, and returning the tween
 * from `onSplit` carries its progress across each re-split.
 */
export function FillHeading({ children, className }: FillHeadingProps) {
	const ref = useRef<HTMLHeadingElement>(null);

	useGSAP(
		() => {
			const node = ref.current;
			if (!node || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
				return;
			}

			const { heading } = scrollReveal;

			const split = SplitText.create(node, {
				type: 'words,chars',
				aria: 'auto',
				autoSplit: true,
				onSplit: (self) => {
					// Every character to rest first, explicitly: a staggered
					// `fromTo` rebuilt on a re-split only writes the letters
					// its playhead has reached, leaving the rest at full.
					gsap.set(self.chars, { opacity: heading.rest });

					return gsap.to(self.chars, {
						opacity: 1,
						ease: 'none',
						stagger: heading.stagger,
						scrollTrigger: {
							trigger: node,
							start: heading.start,
							end: heading.end,
							scrub: true
						}
					});
				}
			});

			return () => split.revert();
		},
		{ scope: ref }
	);

	return (
		<h2
			ref={ref}
			className={className}
		>
			{children}
		</h2>
	);
}
