'use client';

import { useGSAP } from '@gsap/react';
import { motion, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
	ProcessConsole,
	ProcessStepItem
} from '@/components/features/home/solution-parts';
import { Pinned } from '@/components/snippets/pinned/pinned';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { processSectionCopy, processSteps } from '@/constants/home';
import { useSmoother } from '@/contexts/smooth-scroll-context';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import type { SolutionVariationProps } from '@/types/home';
import { scrollToPosition } from '@/utils/scroll';
import { restingProgress, stepPosition } from '@/utils/scroll-steps';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { cn } from '@workspace/ui/lib/utils';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Viewport heights of scroll each stage holds the stage for. */
const STEP_SCROLL_VH = 70;
/** Where in its stretch of scroll a clicked stage lands — its middle. */
const STEP_LANDING = 0.5;

interface SolutionScrollProps extends SolutionVariationProps {
	stepScrollVh?: number;
}

/**
 * Our Process, pinned like the Problem section: the stage holds the screen
 * while the page's scroll walks through the five steps, the rail and the
 * console changing together. A progress line fills beside the rail as it
 * goes; clicking a step glides the page to that step's stretch of scroll, so
 * scrolling stays the one thing that decides what's active.
 *
 * Large screens only — `hidden lg:motion-safe:block` — so the carousel stands
 * in on small screens and under reduced motion, with no swap after hydration.
 */
export function SolutionScroll({
	className,
	sectionIndex,
	totalSections,
	stepScrollVh = STEP_SCROLL_VH
}: SolutionScrollProps) {
	const reduceMotion = usePrefersReducedMotion();
	const smoother = useSmoother();
	const trackRef = useRef<HTMLDivElement>(null);
	const progress = useScrollProgress(trackRef);
	const [activeIndex, setActiveIndex] = useState(0);

	const stepCount = processSteps.length;

	// The rail follows the scroll continuously, easing from step to step.
	const position = useTransform(progress, (value) =>
		stepPosition(value * stepCount, stepCount)
	);

	useEffect(() => {
		// The console swaps as the rail passes the halfway point of a
		// hand-over — the same boundary the scroll crosses.
		return position.on('change', (value) => {
			const next = Math.round(value);
			setActiveIndex((current) => (current === next ? current : next));
		});
	}, [position]);

	useGSAP(
		() => {
			const track = trackRef.current;
			if (!track || !smoother || reduceMotion) return;

			// Settles a scroll that stops mid-hand-over onto the nearest
			// resting step; free scrolling everywhere else is left alone.
			ScrollTrigger.create({
				trigger: track,
				start: 'top top',
				end: 'bottom bottom',
				snap: {
					snapTo: (value) => restingProgress(value, stepCount),
					delay: 0.12,
					duration: { min: 0.35, max: 0.7 },
					ease: 'power2.inOut'
				}
			});
		},
		{ dependencies: [smoother, reduceMotion, stepCount] }
	);

	/** The page position that shows the track at `share` of the way through. */
	const positionAt = useCallback(
		(share: number) => {
			const track = trackRef.current;
			if (!track) return null;

			const top = smoother
				? smoother.offset(track, 'top top')
				: track.getBoundingClientRect().top + window.scrollY;

			return top + share * (track.offsetHeight - window.innerHeight);
		},
		[smoother]
	);

	const goToStep = useCallback(
		(index: number) => {
			const target = positionAt((index + STEP_LANDING) / stepCount);
			if (target !== null) {
				scrollToPosition(smoother, target, { glide: true });
			}
		},
		[positionAt, smoother, stepCount]
	);

	const skipProcess = useCallback(() => {
		// The pin lets go at the track's end, so that's where it's finished.
		const target = positionAt(1);
		if (target !== null) {
			scrollToPosition(smoother, target, { glide: true });
		}
	}, [positionAt, smoother]);

	// The carousel covers reduced motion; nothing here should pin or measure.
	if (reduceMotion) return null;

	return (
		<section
			data-section-reveal
			data-section-hold
			className={cn(
				'hidden border-y border-border lg:motion-safe:block',
				className
			)}
		>
			<div
				ref={trackRef}
				className="relative"
				style={{
					height: `calc(100svh + ${stepCount * stepScrollVh}svh)`
				}}
			>
				<Pinned className="flex h-svh items-center overflow-hidden">
					{/* Top padding clears the floating header. */}
					<div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-14 px-8 pt-16">
						<div>
							<SectionHeader
								index={sectionIndex}
								total={totalSections}
								eyebrow={processSectionCopy.eyebrow}
								title={processSectionCopy.title}
								description={processSectionCopy.description}
								sectionTagWrapperClassName="max-w-xl"
								// Short screens drop it so the whole rail fits.
								descriptionClassName="[@media(max-height:50rem)]:hidden"
							/>

							<div className="relative mt-10 pl-6 [@media(max-height:50rem)]:mt-6">
								{/* How far through the process the scroll is,
								    filling continuously rather than per step. */}
								<span
									aria-hidden
									className="absolute inset-y-0 left-0 w-px bg-border"
								/>
								<motion.span
									aria-hidden
									className="absolute inset-y-0 left-0 w-px origin-top bg-primary"
									style={{ scaleY: progress }}
								/>

								<ul className="flex flex-col">
									{processSteps.map((step, index) => (
										<ProcessStepItem
											key={step.title}
											step={step}
											index={index}
											isActive={index === activeIndex}
											position={position}
											onSelect={() => goToStep(index)}
											fitShortScreens
										/>
									))}
								</ul>
							</div>
						</div>

						<ProcessConsole activeIndex={activeIndex} />
					</div>

					{/* A way out of the pin, gone on the last step where the
					    next section is one scroll away anyway. */}
					{activeIndex < stepCount - 1 ? (
						<button
							type="button"
							onClick={skipProcess}
							className="absolute inset-x-0 bottom-10 mx-auto flex w-fit cursor-pointer items-center gap-2 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
						>
							{processSectionCopy.skip}
							<span aria-hidden>&darr;</span>
						</button>
					) : null}
				</Pinned>
			</div>
		</section>
	);
}
