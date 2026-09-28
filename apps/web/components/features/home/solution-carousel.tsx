'use client';

import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import {
	ProcessConsole,
	ProcessStepItem
} from '@/components/features/home/solution-parts';
import { Pinned } from '@/components/snippets/pinned/pinned';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { processSectionCopy, processSteps } from '@/constants/home';
import { PinOffset } from '@/enums/scroll';
import type { SolutionVariationProps } from '@/types/home';
import { scaleTransition } from '@/utils/animation';
import { cn } from '@workspace/ui/lib/utils';

const STEP_INTERVAL_MS = 3500;
/** One long, soft ease for the rail's hand-over from step to step. */
const HAND_OVER = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

interface SolutionCarouselProps extends SolutionVariationProps {
	stepIntervalMs?: number;
}

/**
 * Our Process as a carousel: the stages advance on a timer (paused on hover),
 * and any stage can be picked from the rail. Also the small-screen and
 * reduced-motion fallback for the scroll variation.
 */
export function SolutionCarousel({
	className,
	sectionIndex,
	totalSections,
	stepIntervalMs = STEP_INTERVAL_MS
}: SolutionCarouselProps) {
	const reduceMotion = useReducedMotion();
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const [isInView, setIsInView] = useState(false);
	// The rail's continuous position, eased to each new step — the rows open
	// and close off this one value, so the hand-over is a single glide.
	const position = useMotionValue(0);

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return;

		// Cycling off screen isn't just wasted work: each stage remount makes
		// Motion measure percentage keyframes, and that measurement scrolls the
		// window and restores it — which a smooth scroller doesn't recover from, so the
		// page creeps upward while the reader is somewhere else entirely.
		const observer = new IntersectionObserver(([entry]) =>
			setIsInView(Boolean(entry?.isIntersecting))
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (reduceMotion) {
			position.set(activeIndex);
			return;
		}

		const controls = animate(
			position,
			activeIndex,
			scaleTransition(HAND_OVER)
		);

		return () => controls.stop();
	}, [activeIndex, position, reduceMotion]);

	useEffect(() => {
		// Reduced-motion visitors drive it themselves via the rail buttons.
		if (reduceMotion || isPaused || !isInView) return;

		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % processSteps.length);
		}, stepIntervalMs);

		return () => window.clearInterval(timer);
	}, [reduceMotion, isPaused, isInView, stepIntervalMs]);

	return (
		<section
			data-section-reveal
			ref={sectionRef}
			className={cn(
				'mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<SectionHeader
				index={sectionIndex}
				total={totalSections}
				eyebrow={processSectionCopy.eyebrow}
				title={processSectionCopy.title}
				description={processSectionCopy.description}
				sectionTagWrapperClassName="max-w-2xl"
			/>

			<div
				className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<ul className="flex flex-col">
					{processSteps.map((step, index) => (
						<ProcessStepItem
							key={step.title}
							step={step}
							index={index}
							isActive={index === activeIndex}
							position={position}
							onSelect={() => setActiveIndex(index)}
						/>
					))}
				</ul>

				<Pinned
					offset={PinOffset.BELOW_HEADER}
					desktopOnly
				>
					<ProcessConsole activeIndex={activeIndex} />
				</Pinned>
			</div>
		</section>
	);
}
