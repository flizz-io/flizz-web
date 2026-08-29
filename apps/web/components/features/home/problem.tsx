'use client';

import { motion, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { CostDiagram } from '@/components/features/home/cost-diagrams';
import { ProblemScene } from '@/components/features/home/problem-scenes';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { problemItems, realCostItems } from '@/constants/home';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import type { ProblemItem } from '@/types/home';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { cn } from '@workspace/ui/lib/utils';

// Three.js is heavy and only the closing stage needs it.
const CostScene = dynamic(
	() => import('./cost-scene').then((mod) => mod.CostScene),
	{ ssr: false }
);

const STAGE_SCROLL_VH = 80;
const RAIL_HEIGHT = 176;

/**
 * The accent drains as the problems compound — full strength on the first,
 * almost gone by the real cost — so the palette carries the descent and the
 * Solution section reads as colour coming back.
 */
const PROBLEM_STAGES = [
	{ scene: 'grid', drain: 1 },
	{ scene: 'scattered', drain: 0.6 },
	{ scene: 'slipping', drain: 0.32 }
] as const;

const COST_DRAIN = 0.14;

const SCENE_MASK =
	'radial-gradient(ellipse 58% 56% at 34% 50%, transparent 10%, #000 76%)';

interface ProblemStage {
	key: string;
	scene: 'grid' | 'scattered' | 'slipping' | 'cost' | 'none';
	drain: number;
	item?: ProblemItem;
	number?: number;
}

interface ProblemProps {
	sectionIndex: number;
	totalSections?: number;
	/** Viewport heights of scroll each stage is held for. */
	stageScrollVh?: number;
	/** Which axis stages travel on as the sequence advances. */
	slideDirection?: 'vertical' | 'horizontal';
	/** Offer a way out of the pinned sequence before the last stage. */
	showSkip?: boolean;
	className?: string;
}

function accentWash(drain: number) {
	return `radial-gradient(ellipse 110% 70% at 50% 0%, color-mix(in oklab, var(--color-primary) ${Math.round(
		18 * drain
	)}%, transparent) 0%, transparent 72%)`;
}

function StageEyebrow({
	children,
	drain
}: {
	children: string;
	drain: number;
}) {
	return (
		<p
			className="font-mono text-[0.65rem] tracking-[0.22em] text-primary uppercase sm:text-xs"
			style={{ opacity: 0.45 + drain * 0.55 }}
		>
			{children}
		</p>
	);
}

function CostCallout({ item, drain }: { item: ProblemItem; drain: number }) {
	return (
		<div
			className="mt-7 border-l-2 py-3 pl-5"
			style={{
				borderColor: `color-mix(in oklab, var(--color-primary) ${Math.round(
					25 + 60 * drain
				)}%, transparent)`
			}}
		>
			<p className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
				What it costs you
			</p>
			<p className="mt-2 font-serif text-lg text-foreground italic sm:text-xl">
				{item.cost}
			</p>
		</div>
	);
}

function ProblemBody({
	item,
	number,
	drain
}: {
	item: ProblemItem;
	number: number;
	drain: number;
}) {
	return (
		<div className="grid items-center gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
			<span
				className="font-serif text-7xl leading-none text-primary lg:text-[10rem]"
				style={{ opacity: 0.25 + drain * 0.6 }}
			>
				{String(number).padStart(2, '0')}
			</span>

			<div className="max-w-2xl">
				<StageEyebrow drain={drain}>{item.eyebrow}</StageEyebrow>
				<h3 className="mt-3 font-serif text-3xl leading-[1.05] text-balance text-foreground sm:text-4xl lg:text-5xl">
					{item.title}
				</h3>
				<p className="mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
					{item.description}
				</p>
				<CostCallout
					item={item}
					drain={drain}
				/>
			</div>
		</div>
	);
}

export function Problem({
	className,
	sectionIndex,
	totalSections,
	stageScrollVh = STAGE_SCROLL_VH,
	slideDirection = 'vertical',
	showSkip = true
}: ProblemProps) {
	const reduceMotion = usePrefersReducedMotion();
	const lenis = useLenis();
	const trackRef = useRef<HTMLDivElement>(null);
	const progress = useScrollProgress(trackRef);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isInView, setIsInView] = useState(false);

	// intro + one per problem + the real cost
	const stageCount = problemItems.length + 2;
	const dotY = useTransform(progress, [0, 1], [0, RAIL_HEIGHT]);

	useEffect(() => {
		return progress.on('change', (value) => {
			const next = Math.min(
				stageCount - 1,
				Math.floor(value * stageCount)
			);
			setActiveIndex((current) => (current === next ? current : next));
		});
	}, [progress, stageCount]);

	useEffect(() => {
		const node = trackRef.current;
		if (!node) return;

		// One gate for every scene: nothing animates while the section is
		// parked off screen, and nothing stutters mid-crossfade either.
		const observer = new IntersectionObserver(
			([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
			{ rootMargin: '10% 0px' }
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	const skipSequence = () => {
		const track = trackRef.current;
		if (!track) return;

		// The pin releases once the track's bottom reaches the viewport bottom,
		// so that position is exactly where the sequence has finished.
		const target =
			window.scrollY +
			track.getBoundingClientRect().bottom -
			window.innerHeight;

		if (lenis) {
			lenis.scrollTo(target);
			return;
		}

		window.scrollTo({ top: target, behavior: 'smooth' });
	};

	if (reduceMotion) {
		return (
			<ProblemStack
				className={className}
				sectionIndex={sectionIndex}
				totalSections={totalSections}
			/>
		);
	}

	const stages: ProblemStage[] = [
		{ key: 'intro', scene: 'none', drain: 1 },
		...problemItems.map((item, index) => ({
			key: item.title,
			scene: PROBLEM_STAGES[index]?.scene ?? 'grid',
			drain: PROBLEM_STAGES[index]?.drain ?? 1,
			item,
			number: index + 1
		})),
		{ key: 'cost', scene: 'cost', drain: COST_DRAIN }
	];

	return (
		<section className={cn('border-y border-border', className)}>
			<div
				ref={trackRef}
				className="relative"
				style={{
					height: `calc(100svh + ${stageCount * stageScrollVh}svh)`
				}}
			>
				<div className="sticky top-0 flex h-svh items-center overflow-hidden">
					{stages.map((stage, index) => (
						<div
							key={`scene-${stage.key}`}
							aria-hidden
							className="absolute inset-0 transition-opacity duration-700 ease-power-on"
							style={{ opacity: index === activeIndex ? 1 : 0 }}
						>
							<div
								className="absolute inset-0"
								style={{ background: accentWash(stage.drain) }}
							/>
							{/* Carved back where the copy sits, so the diagram
							    stays rich at the edges and never competes. */}
							<div
								className={cn(
									'absolute inset-0',
									stage.scene === 'cost'
										? 'opacity-80'
										: 'text-foreground opacity-[0.16]'
								)}
								style={{
									maskImage: SCENE_MASK,
									WebkitMaskImage: SCENE_MASK
								}}
							>
								{stage.scene === 'cost' ? (
									<CostScene
										active={
											isInView && index === activeIndex
										}
									/>
								) : (
									<ProblemScene
										scene={stage.scene}
										active={isInView}
									/>
								)}
							</div>
						</div>
					))}

					{/* One light seam per stage change — keyed, so it replays. */}
					<motion.span
						key={`seam-${activeIndex}`}
						aria-hidden
						className="pointer-events-none absolute inset-x-0 z-10 h-1/3 bg-linear-to-b from-transparent via-primary/10 to-transparent"
						initial={{ y: '-100%', opacity: 0.9 }}
						animate={{ y: '300%', opacity: 0 }}
						transition={{ duration: 1.2, ease: 'easeOut' }}
					/>

					{stages.map((stage, index) => {
						const isActive = index === activeIndex;

						return (
							<div
								key={stage.key}
								className={cn(
									'absolute inset-0 flex items-center px-4 transition-[opacity,transform,filter] duration-700 ease-power-on sm:px-6 lg:px-8',
									isActive &&
										'translate-x-0 translate-y-0 opacity-100 blur-none',
									!isActive &&
										'pointer-events-none opacity-0 blur-[6px]',
									// Horizontal stages sit on the side they
									// belong to, so advancing brings the next in
									// from the right and going back from the left.
									!isActive &&
										slideDirection === 'horizontal' &&
										(index > activeIndex
											? 'translate-x-16'
											: '-translate-x-16'),
									!isActive &&
										slideDirection === 'vertical' &&
										'translate-y-5'
								)}
							>
								<div className="mx-auto w-full max-w-6xl">
									{stage.key === 'intro' ? (
										<div className="max-w-3xl">
											<SectionTag
												index={sectionIndex}
												total={totalSections}
												label="The Problem"
											/>
											<h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
												Is this how you&apos;re building
												your digital solutions?
											</h2>
											<p className="mt-5 max-w-xl text-lg text-muted-foreground">
												Most businesses face the same
												frustrating choices when
												building software.
											</p>
											<p className="mt-12 flex items-center gap-3 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
												<span className="h-px w-10 bg-primary/60" />
												Keep scrolling
											</p>
										</div>
									) : stage.key === 'cost' ? (
										<div className="max-w-3xl">
											<p className="font-mono text-[0.65rem] tracking-[0.22em] text-primary uppercase sm:text-xs">
												The real cost
											</p>

											<ul className="mt-8">
												{realCostItems.map(
													(item, itemIndex) => (
														// The row clips its own
														// content, so each loss
														// rises out from behind
														// the rule above it.
														<li
															key={item.line}
															className="overflow-hidden border-b border-border/60 last:border-0"
														>
															<div
																className={cn(
																	'flex items-center gap-5 py-4 transition-transform duration-[900ms] ease-power-on sm:gap-7',
																	isActive
																		? 'translate-y-0'
																		: 'translate-y-full'
																)}
																style={{
																	transitionDelay: `${
																		200 +
																		itemIndex *
																			150
																	}ms`
																}}
															>
																<CostDiagram
																	kind={
																		item.diagram
																	}
																	active={
																		isActive
																	}
																/>
																<p className="font-serif text-lg leading-snug text-foreground sm:text-xl lg:text-2xl">
																	{item.line}
																</p>
															</div>
														</li>
													)
												)}
											</ul>
										</div>
									) : stage.item ? (
										<ProblemBody
											item={stage.item}
											number={stage.number ?? 1}
											drain={stage.drain}
										/>
									) : null}
								</div>
							</div>
						);
					})}

					{/* A way out of the pin. Hidden on the closing stage, where
					    the sequence is over and the next section is one scroll
					    away anyway. */}
					{showSkip && activeIndex < stageCount - 1 ? (
						<button
							type="button"
							onClick={skipSequence}
							className="absolute inset-x-0 bottom-10 mx-auto flex w-fit items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
						>
							Skip the problem
							<span aria-hidden>&darr;</span>
						</button>
					) : null}

					<div
						aria-hidden
						className="pointer-events-none absolute top-1/2 right-5 hidden -translate-y-1/2 lg:block"
						style={{ height: RAIL_HEIGHT }}
					>
						<span className="absolute inset-y-0 left-0 w-px bg-border" />
						{stages.map((stage, index) => (
							<span
								key={`tick-${stage.key}`}
								className={cn(
									'absolute -left-[2px] size-[5px] rounded-full transition-colors duration-500',
									index <= activeIndex
										? 'bg-primary/70'
										: 'bg-muted-foreground/30'
								)}
								style={{
									top:
										(index / (stages.length - 1)) *
										RAIL_HEIGHT
								}}
							/>
						))}
						<motion.span
							className="absolute -left-[3px] size-[7px] rounded-full bg-primary"
							style={{ y: dotY }}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

/** Reduced-motion path: the same content, read top to bottom, nothing pinned. */
function ProblemStack({
	className,
	sectionIndex,
	totalSections
}: Omit<ProblemProps, 'stageScrollVh'>) {
	return (
		<section className={cn('border-y border-border', className)}>
			<div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<Reveal className="max-w-3xl">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The Problem"
					/>
					<h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
						Is this how you&apos;re building your digital solutions?
					</h2>
					<p className="mt-5 text-lg text-muted-foreground">
						Most businesses face the same frustrating choices when
						building software.
					</p>
				</Reveal>

				<div className="mt-16 flex flex-col gap-16">
					{problemItems.map((item, index) => (
						<Reveal key={item.title}>
							<ProblemBody
								item={item}
								number={index + 1}
								drain={PROBLEM_STAGES[index]?.drain ?? 1}
							/>
						</Reveal>
					))}
				</div>

				<Reveal className="mt-16 max-w-4xl border-t border-border pt-10">
					<p className="font-mono text-xs tracking-[0.22em] text-primary uppercase">
						The real cost
					</p>
					<ul className="mt-6">
						{realCostItems.map((item) => (
							<li
								key={item.line}
								className="flex items-center gap-5 border-b border-border/60 py-4 last:border-0 sm:gap-7"
							>
								<CostDiagram
									kind={item.diagram}
									active={false}
								/>
								<p className="font-serif text-lg leading-snug text-foreground sm:text-xl">
									{item.line}
								</p>
							</li>
						))}
					</ul>
				</Reveal>
			</div>
		</section>
	);
}
