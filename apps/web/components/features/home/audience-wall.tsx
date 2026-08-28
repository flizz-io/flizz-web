'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { audienceSegments } from '@/constants/home';
import { cn } from '@workspace/ui/lib/utils';

// Co-prime-ish durations so the rows never phase-lock into a visible grid.
const marqueeRows = [
	{ duration: 61, reverse: false },
	{ duration: 47, reverse: true },
	{ duration: 73, reverse: false },
	{ duration: 53, reverse: true },
	{ duration: 67, reverse: false },
	{ duration: 43, reverse: true },
	{ duration: 59, reverse: false }
];

// Two fades intersected: the wall runs off every edge of the band rather than
// sitting inside it, so it reads as a window onto something larger.
const EDGE_FADE = [
	'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)',
	'linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)'
].join(', ');

const SPOTLIGHT =
	'radial-gradient(circle 300px at var(--spot-x, -9999px) var(--spot-y, -9999px), #000 0%, rgba(0,0,0,0.6) 42%, transparent 74%)';

function Rows({
	animate,
	className,
	style
}: {
	animate: boolean;
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<div
			className={cn(
				'absolute inset-0 flex flex-col justify-center gap-3 sm:gap-5 lg:gap-7',
				className
			)}
			style={style}
		>
			{marqueeRows.map((marqueeRow, rowIndex) => {
				// Each row starts on a different segment, so the same six words
				// never stack into columns down the wall.
				const rotated = [
					...audienceSegments.slice(rowIndex),
					...audienceSegments.slice(0, rowIndex)
				];

				return (
					<div
						key={marqueeRow.duration}
						className="flex w-max"
						style={
							animate
								? {
										animation: `marquee ${marqueeRow.duration}s linear infinite${
											marqueeRow.reverse ? ' reverse' : ''
										}`
									}
								: undefined
						}
					>
						{/* Two identical groups, each carrying its own trailing
						    gap: the -50% keyframe then lands exactly one group
						    along, so the loop has no seam. */}
						{[0, 1].map((copy) => (
							<div
								key={copy}
								className="flex gap-10 pr-10 sm:gap-14 sm:pr-14"
							>
								{rotated.map((segment) => (
									<span
										key={segment}
										className="font-serif text-5xl whitespace-nowrap italic sm:text-6xl lg:text-7xl"
									>
										{segment}
									</span>
								))}
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
}

export function AudienceWall({ className }: { className?: string }) {
	const reduceMotion = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		let frame = 0;

		const handleMove = (event: PointerEvent) => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				// Read the rect per frame rather than caching it: the band
				// moves under the pointer while the page scrolls.
				const rect = node.getBoundingClientRect();
				node.style.setProperty(
					'--spot-x',
					`${event.clientX - rect.left}px`
				);
				node.style.setProperty(
					'--spot-y',
					`${event.clientY - rect.top}px`
				);
			});
		};

		// The light only tracks while the band is on screen, so the rest of
		// the page carries no pointer listener.
		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				window.addEventListener('pointermove', handleMove, {
					passive: true
				});
				return;
			}

			window.removeEventListener('pointermove', handleMove);
			node.style.setProperty('--spot-x', '-9999px');
		});

		observer.observe(node);

		return () => {
			observer.disconnect();
			window.removeEventListener('pointermove', handleMove);
			if (frame) cancelAnimationFrame(frame);
		};
	}, []);

	return (
		<div
			ref={ref}
			aria-hidden
			className={cn(
				'pointer-events-none absolute inset-0 overflow-hidden select-none',
				className
			)}
			style={{
				maskImage: EDGE_FADE,
				maskComposite: 'intersect',
				WebkitMaskImage: EDGE_FADE,
				WebkitMaskComposite: 'source-in'
			}}
		>
			<Rows
				animate={!reduceMotion}
				className="text-foreground opacity-[0.07]"
			/>
			{/* The same wall again, lit — cut back to just the pointer's circle,
			    so the segments are found rather than displayed. */}
			<Rows
				animate={!reduceMotion}
				className="text-primary opacity-90"
				style={{ maskImage: SPOTLIGHT, WebkitMaskImage: SPOTLIGHT }}
			/>
		</div>
	);
}
