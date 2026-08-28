'use client';

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useReducedMotion
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { ProcessConsoleCine } from '@/components/features/home/process-console-cine';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { processSteps } from '@/constants/home';
import { cn } from '@workspace/ui/lib/utils';

/** Scroll distance each stage holds the pinned view for. */
const STEP_SCROLL_VH = 60;
const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

interface SolutionScrollProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Mounts children only once they have actually been on screen. A `display:none`
 * element never intersects, so this keeps the mobile stack's consoles — and
 * their looping animations — from running while the desktop layout is showing.
 */
function InViewMount({ children }: { children: React.ReactNode }) {
	const ref = useRef<HTMLDivElement>(null);
	const [hasAppeared, setHasAppeared] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setHasAppeared(true);
					observer.disconnect();
				}
			},
			{ rootMargin: '200px' }
		);
		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	return <div ref={ref}>{hasAppeared ? children : null}</div>;
}

function ConsoleFrame({
	index,
	children
}: {
	index: number;
	children: React.ReactNode;
}) {
	const activeStep = processSteps[index];

	return (
		<div className="relative">
			{/* Schematic corner ticks, matching the motif used elsewhere. */}
			{[
				'-top-px -left-px border-t border-l',
				'-top-px -right-px border-t border-r',
				'-bottom-px -left-px border-b border-l',
				'-right-px -bottom-px border-r border-b'
			].map((corner) => (
				<span
					key={corner}
					aria-hidden
					className={cn(
						'pointer-events-none absolute z-20 size-4 border-primary/60',
						corner
					)}
				/>
			))}

			<div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
				<div
					aria-hidden
					className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-[50%] bg-primary/20 blur-3xl"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-[0.07]"
					style={{
						backgroundImage:
							'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
						backgroundSize: '18px 18px'
					}}
				/>

				<div className="relative flex items-center gap-2 border-b border-border px-4 py-3">
					{[0, 1, 2].map((dot) => (
						<span
							key={dot}
							className="size-2 rounded-full bg-muted-foreground/30"
						/>
					))}
					<span className="ml-2 font-mono text-[0.65rem] text-muted-foreground">
						flizz.build / northwind
					</span>
				</div>

				<div className="relative h-[21rem] p-6">
					{/* One scan sweep per stage change. */}
					<motion.span
						key={`sweep-${index}`}
						aria-hidden
						className="pointer-events-none absolute inset-x-0 z-10 h-24 bg-gradient-to-b from-transparent via-primary/12 to-transparent"
						initial={{ y: '-100%', opacity: 0.9 }}
						animate={{ y: '420%', opacity: 0 }}
						transition={{ duration: 1.1, ease: 'easeOut' }}
					/>
					{children}
				</div>

				<div className="relative flex items-center justify-between border-t border-border px-4 py-2.5">
					<span className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
						{String(index + 1).padStart(2, '0')} /{' '}
						{activeStep?.shortLabel}
					</span>
					<span className="flex gap-1.5">
						{processSteps.map((step, i) => (
							<span
								key={step.title}
								className={cn(
									'h-1 rounded-full transition-all duration-500',
									i === index
										? 'w-6 bg-primary'
										: 'w-1.5 bg-muted-foreground/30'
								)}
							/>
						))}
					</span>
				</div>
			</div>
		</div>
	);
}

export function SolutionScroll({
	sectionIndex,
	totalSections,
	className
}: SolutionScrollProps) {
	const reduceMotion = useReducedMotion();
	const trackRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const scrollProgress = useMotionValue(0);

	// Measured from the track's own rect rather than Framer Motion's
	// `useScroll`, which does not track this page — Lenis owns the scroll and
	// `useScroll`'s progress stayed pinned at 0.
	useEffect(() => {
		function update() {
			const element = trackRef.current;
			if (!element) return;

			const rect = element.getBoundingClientRect();
			const distance = rect.height - window.innerHeight;
			const progress =
				distance <= 0
					? 0
					: Math.min(1, Math.max(0, -rect.top / distance));

			scrollProgress.set(progress);

			const next = Math.min(
				processSteps.length - 1,
				Math.floor(progress * processSteps.length)
			);
			setActiveIndex((current) => (current === next ? current : next));
		}

		// Deferred so the first measurement is not a synchronous setState.
		const frame = window.requestAnimationFrame(update);
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);

		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	}, [scrollProgress]);

	return (
		<section
			className={cn('border-t border-border', className)}
			aria-label="Our process"
		>
			{/* Desktop keeps the heading inside the pinned column, so context
			    stays on screen while the stages advance. */}
			<div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28 lg:hidden lg:px-8">
				<div className="max-w-2xl">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="Our Process"
					/>
					<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
						How we get you there
					</h2>
					<p className="mt-4 text-base text-muted-foreground">
						Five stages, one system of record. You can see exactly
						where your project stands at every point.
					</p>
				</div>
			</div>

			{/* Mobile and reduced-motion: a plain stack, since pinning a
			    full-height stage does not fit a short viewport. */}
			<div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-14 sm:px-6 lg:hidden lg:px-8">
				{processSteps.map((step, index) => (
					<div key={step.title}>
						<div className="flex items-baseline gap-4">
							<span className="font-mono text-xs text-primary">
								{String(index + 1).padStart(2, '0')}
							</span>
							<h3 className="font-heading text-3xl font-semibold tracking-tight text-primary">
								{step.shortLabel}
							</h3>
						</div>
						<p className="mt-3 text-sm text-muted-foreground">
							{step.compactDescription}
						</p>
						<p className="mt-2 font-mono text-[0.7rem] text-primary">
							What you get — {step.whatYouGet}
						</p>
						<div className="mt-5">
							<InViewMount>
								<ConsoleFrame index={index}>
									<ProcessConsoleCine index={index} />
								</ConsoleFrame>
							</InViewMount>
						</div>
					</div>
				))}
			</div>

			<div
				ref={trackRef}
				className="relative hidden lg:block"
				style={{
					height: `calc(100vh + ${processSteps.length * STEP_SCROLL_VH}vh)`
				}}
			>
				<div className="sticky top-0 flex h-screen items-center">
					<div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:px-8">
						<div className="flex flex-col gap-8">
							<div>
								<SectionTag
									index={sectionIndex}
									total={totalSections}
									label="Our Process"
								/>
								<h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground">
									How we get you there
								</h2>
							</div>

							<div className="flex gap-6">
								{/* Rail progress fills with scroll position. */}
								<div className="relative w-px shrink-0 bg-border">
									<motion.span
										aria-hidden
										className="absolute inset-x-0 top-0 origin-top bg-primary"
										style={{
											height: '100%',
											scaleY: reduceMotion
												? 1
												: scrollProgress
										}}
									/>
								</div>

								<ul className="flex flex-1 flex-col gap-1">
									{processSteps.map((step, index) => {
										const isActive = index === activeIndex;

										return (
											<li key={step.title}>
												<div className="flex items-baseline gap-4">
													<span
														className={cn(
															'font-mono text-xs transition-colors duration-500',
															isActive
																? 'text-primary'
																: 'text-muted-foreground/40'
														)}
													>
														{String(
															index + 1
														).padStart(2, '0')}
													</span>
													<span
														className={cn(
															'font-heading text-3xl font-semibold tracking-tight transition-all duration-500 sm:text-4xl',
															isActive
																? 'text-primary opacity-100'
																: 'text-foreground opacity-20'
														)}
													>
														{step.shortLabel}
													</span>
												</div>

												<AnimatePresence
													initial={false}
												>
													{isActive ? (
														<motion.div
															initial={{
																height: 0,
																opacity: 0
															}}
															animate={{
																height: 'auto',
																opacity: 1
															}}
															exit={{
																height: 0,
																opacity: 0
															}}
															transition={{
																duration: 0.4,
																ease: REVEAL_EASE
															}}
															className="overflow-hidden"
														>
															<div className="pt-2 pb-4 pl-9">
																<p className="max-w-sm text-sm text-muted-foreground">
																	{
																		step.compactDescription
																	}
																</p>
																<p className="mt-2 font-mono text-[0.7rem] text-primary">
																	What you get
																	—{' '}
																	{
																		step.whatYouGet
																	}
																</p>
															</div>
														</motion.div>
													) : null}
												</AnimatePresence>
											</li>
										);
									})}
								</ul>
							</div>
						</div>

						<ConsoleFrame index={activeIndex}>
							<AnimatePresence mode="wait">
								<motion.div
									key={activeIndex}
									initial="hidden"
									animate="show"
									exit="exit"
									className="h-full"
								>
									<ProcessConsoleCine index={activeIndex} />
								</motion.div>
							</AnimatePresence>
						</ConsoleFrame>
					</div>
				</div>
			</div>
		</section>
	);
}
