'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { ConsoleFrame } from '@/components/snippets/console-frame/console-frame';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { processSteps } from '@/constants/home';
import { cn } from '@workspace/ui/lib/utils';

import { ProcessConsoleCine } from './process-console-cine';

const STEP_INTERVAL_MS = 3500;
const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

interface SolutionProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
	stepIntervalMs?: number;
}

export function Solution({
	className,
	sectionIndex,
	totalSections,
	stepIntervalMs = STEP_INTERVAL_MS
}: SolutionProps) {
	const reduceMotion = useReducedMotion();
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const node = sectionRef.current;
		if (!node) return;

		// Cycling off screen isn't just wasted work: each stage remount makes
		// Motion measure percentage keyframes, and that measurement scrolls the
		// window and restores it — which Lenis doesn't recover from, so the
		// page creeps upward while the reader is somewhere else entirely.
		const observer = new IntersectionObserver(([entry]) =>
			setIsInView(Boolean(entry?.isIntersecting))
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		// Reduced-motion visitors drive it themselves via the rail buttons.
		if (reduceMotion || isPaused || !isInView) return;

		const timer = window.setInterval(() => {
			setActiveIndex((current) => (current + 1) % processSteps.length);
		}, stepIntervalMs);

		return () => window.clearInterval(timer);
	}, [reduceMotion, isPaused, isInView, stepIntervalMs]);

	const activeStep = processSteps[activeIndex];

	return (
		<section
			ref={sectionRef}
			className={cn(
				'mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<SectionHeader
				index={sectionIndex}
				total={totalSections}
				eyebrow="Our Process"
				title="How we get you there"
				description="Five stages, one system of record. You can see exactly where your project stands at every point."
				sectionTagWrapperClassName="max-w-2xl"
			/>

			<div
				className="mt-14 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<ul className="flex flex-col">
					{processSteps.map((step, index) => {
						const isActive = index === activeIndex;

						return (
							<li
								key={step.title}
								className="border-b border-border last:border-0"
							>
								<button
									type="button"
									onClick={() => setActiveIndex(index)}
									aria-current={isActive}
									className="flex w-full items-baseline gap-4 py-4 text-left"
								>
									<span
										className={cn(
											'font-mono text-xs transition-colors',
											isActive
												? 'text-primary'
												: 'text-muted-foreground/50'
										)}
									>
										{String(index + 1).padStart(2, '0')}
									</span>
									<span
										className={cn(
											'font-heading text-3xl font-semibold tracking-tight transition-all duration-500 sm:text-4xl',
											isActive
												? 'text-primary opacity-100'
												: 'text-foreground opacity-25 hover:opacity-50'
										)}
									>
										{step.shortLabel}
									</span>
								</button>

								<AnimatePresence initial={false}>
									{isActive ? (
										<motion.div
											initial={
												reduceMotion
													? undefined
													: { height: 0, opacity: 0 }
											}
											animate={
												reduceMotion
													? undefined
													: {
															height: 'auto',
															opacity: 1
														}
											}
											exit={
												reduceMotion
													? undefined
													: { height: 0, opacity: 0 }
											}
											transition={{
												duration: 0.45,
												ease: REVEAL_EASE
											}}
											className="overflow-hidden"
										>
											{/* Fixed slot height, not `auto`: the
											    entering and exiting panels then
											    animate over the same distance with
											    the same easing, so their heights
											    cancel and the rail never changes
											    size mid-transition. Measured max
											    content is 142px across breakpoints. */}
											<div className="h-40 pb-6 pl-10">
												<p className="font-heading text-lg font-semibold text-foreground">
													{step.title}
												</p>
												<p className="mt-2 max-w-md text-base text-muted-foreground">
													{step.compactDescription}
												</p>
												<p className="mt-3 font-mono text-sm text-primary">
													What you get —{' '}
													{step.whatYouGet}
												</p>
											</div>
										</motion.div>
									) : null}
								</AnimatePresence>
							</li>
						);
					})}
				</ul>

				<ConsoleFrame
					headerTitle={'flizz.build / northwind'}
					footerContent={
						<>
							<span className="font-mono text-sm tracking-[0.2em] text-primary uppercase">
								{String(activeIndex + 1).padStart(2, '0')} /{' '}
								{activeStep?.shortLabel}
							</span>
							<span className="flex gap-1.5">
								{processSteps.map((step, i) => (
									<span
										key={step.title}
										className={cn(
											'h-1 rounded-full transition-all duration-500',
											i === activeIndex
												? 'w-6 bg-primary'
												: 'w-1.5 bg-muted-foreground/30'
										)}
									/>
								))}
							</span>
						</>
					}
					className="lg:sticky lg:top-28"
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={activeIndex}
							initial="hidden"
							animate="show"
							exit="exit"
							className="h-full"
						>
							{/* One scan sweep per stage change. */}
							<motion.span
								key={`sweep-${activeIndex}`}
								aria-hidden
								className="pointer-events-none absolute inset-x-0 z-10 h-24 bg-linear-to-b from-transparent via-primary/12 to-transparent"
								initial={{ y: '-100%', opacity: 0.9 }}
								animate={{ y: '420%', opacity: 0 }}
								transition={{
									duration: 1.1,
									ease: 'easeOut'
								}}
							/>
							<ProcessConsoleCine index={activeIndex} />
						</motion.div>
					</AnimatePresence>
				</ConsoleFrame>
			</div>
		</section>
	);
}
