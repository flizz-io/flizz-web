'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

import { audienceSegments } from '@/constants/home';
import { cn } from '@workspace/ui/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function AudienceList({ className }: { className?: string }) {
	const listRef = useRef<HTMLUListElement>(null);

	useGSAP(
		() => {
			const list = listRef.current;
			if (!list || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
				return;
			}

			// Each name rises into its own clipped row. The trigger sits on
			// the list, never the clipped names, which start out of view.
			// Each name rises into its own clipped row, scrubbed to the
			// scroll. The trigger sits on the list, never the clipped names,
			// which start out of view.
			gsap.fromTo(
				gsap.utils.toArray<HTMLElement>('[data-audience-name]', list),
				{ yPercent: 120 },
				{
					yPercent: 0,
					ease: 'power2.out',
					stagger: 0.12,
					scrollTrigger: {
						trigger: list,
						start: 'top 92%',
						end: 'top 55%',
						scrub: true
					}
				}
			);
		},
		{ scope: listRef }
	);

	return (
		<ul
			ref={listRef}
			className={cn(
				// A fixed grid rather than a wrapping row: six names of very
				// different lengths break into ragged lines when centred.
				'mx-auto grid w-fit grid-cols-2 gap-x-6 gap-y-1 text-left sm:grid-cols-3 sm:gap-x-10',
				className
			)}
		>
			{audienceSegments.map((segment) => (
				<li
					key={segment}
					className="overflow-hidden py-1"
				>
					<span
						data-audience-name
						// Top-aligned, not centred: a name that wraps to two
						// lines would otherwise float its dot into the gap.
						className="flex items-start gap-2 text-sm text-foreground sm:text-base"
					>
						<span
							aria-hidden
							className="mt-2 size-1 shrink-0 rounded-full bg-primary sm:mt-2.5"
						/>
						{segment}
					</span>
				</li>
			))}
		</ul>
	);
}
