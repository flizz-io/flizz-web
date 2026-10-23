'use client';

import { motion, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { CostDiagram } from '@/components/features/home/cost-diagrams';
import { ProblemScene } from '@/components/features/home/problem-scenes';
import { Pinned } from '@/components/snippets/pinned/pinned';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { problemItems, realCostItems } from '@/constants/home';
import { useSmoother } from '@/contexts/smooth-scroll-context';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import type { ProblemItem } from '@/types/home';
import { scaleMs, scaleTransition } from '@/utils/animation';
import { scrollToPosition } from '@/utils/scroll';
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
/** Split: copy down both sides, so the scene reads around it rather than beside. */
const SPLIT_SCENE_MASK =
	'radial-gradient(ellipse 86% 64% at 50% 50%, transparent 24%, #000 92%)';
/** The two columns, declared once so the held header and the stages align. */
const SPLIT_GRID = 'grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16';

interface ProblemStage {
	key: string;
	scene: 'grid' | 'scattered' | 'slipping' | 'cost' | 'none';
	drain: number;
	item?: ProblemItem;
	number?: number;
}

type ProblemVariation = 'stages' | 'split';

interface ProblemProps {
	sectionIndex: number;
	totalSections?: number;
	/**
	 * `stages` — each stage takes the whole screen in turn, the header being
	 * the first of them. `split` — the header holds the left column for the
	 * whole sequence and the stages run through the right one. Below `lg`
	 * there is no room for two columns, so `split` reads as `stages` there.
	 */
	variation?: ProblemVariation;
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
			className="font-mono text-base tracking-[0.2em] text-primary uppercase"
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
			<p className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
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
	drain,
	/**
	 * Half the stage rather than all of it: the number leads instead of
	 * standing beside, and the type holds its smaller step. Only from `lg`,
	 * where the two columns exist — narrower than that both read the same.
	 */
	narrow = false
}: {
	item: ProblemItem;
	number: number;
	drain: number;
	narrow?: boolean;
}) {
	return (
		<div
			className={cn(
				'grid items-center gap-6',
				narrow
					? 'lg:gap-2'
					: 'lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16'
			)}
		>
			<span
				className={cn(
					'font-serif text-7xl leading-none text-primary',
					!narrow && 'lg:text-[10rem]'
				)}
				style={{ opacity: 0.25 + drain * 0.6 }}
			>
				{String(number).padStart(2, '0')}
			</span>

			<div className="max-w-2xl">
				<StageEyebrow drain={drain}>{item.eyebrow}</StageEyebrow>
				<h3
					className={cn(
						'mt-3 font-heading text-4xl leading-[1.05] font-semibold text-balance text-foreground sm:text-4xl',
						!narrow && 'lg:text-5xl'
					)}
				>
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

/** The section's own opening: held beside the stages in `split`, a stage of its own otherwise. */
function ProblemIntro({
	sectionIndex,
	totalSections,
	showCue = true,
	className
}: {
	sectionIndex: number;
	totalSections?: number;
	/** The cue has said its piece once the sequence is moving. */
	showCue?: boolean;
	className?: string;
}) {
	return (
		<div className={className}>
			<SectionHeader
				index={sectionIndex}
				total={totalSections}
				eyebrow="The Problem"
				title="Is this how you're building your digital solutions?"
				description="Most businesses face the same frustrating choices when building software."
				descriptionClassName="max-w-xl"
			/>
			<p
				className={cn(
					'mt-12 flex items-center gap-3 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase transition-opacity duration-700 ease-power-on',
					!showCue && 'opacity-0'
				)}
			>
				<span className="h-px w-10 bg-primary/60" />
				Keep scrolling
			</p>
		</div>
	);
}

/** The closing stage: what all of it adds up to, each loss rising in turn. */
function RealCost({
	isActive,
	/** Half the stage: tighter rows and one type step down, from `lg` up. */
	narrow = false
}: {
	isActive: boolean;
	narrow?: boolean;
}) {
	return (
		<div className="max-w-3xl">
			<p className="font-mono text-base tracking-[0.22em] text-primary uppercase">
				The real cost
			</p>

			<ul className={cn('mt-8', narrow && 'lg:mt-5')}>
				{realCostItems.map((item, itemIndex) => (
					// The row clips its own content, so each loss rises out
					// from behind the rule above it.
					<li
						key={item.line}
						className="overflow-hidden border-b border-border/60 last:border-0"
					>
						<div
							className={cn(
								'flex items-center gap-5 py-4 transition-transform duration-[900ms] ease-power-on sm:gap-7',
								narrow && 'lg:py-3',
								isActive ? 'translate-y-0' : 'translate-y-full'
							)}
							style={{
								transitionDelay: `${scaleMs(200 + itemIndex * 150)}ms`
							}}
						>
							<CostDiagram
								kind={item.diagram}
								active={isActive}
							/>
							<p
								className={cn(
									'font-heading text-lg leading-snug text-foreground sm:text-xl',
									!narrow && 'lg:text-2xl'
								)}
							>
								{item.line}
							</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Problem({
	className,
	sectionIndex,
	totalSections,
	variation = 'stages',
	stageScrollVh = STAGE_SCROLL_VH,
	slideDirection = 'vertical',
	showSkip = true
}: ProblemProps) {
	const reduceMotion = usePrefersReducedMotion();
	const smoother = useSmoother();
	const trackRef = useRef<HTMLDivElement>(null);
	const progress = useScrollProgress(trackRef);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isInView, setIsInView] = useState(false);

	const isSplit = variation === 'split';

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

		scrollToPosition(smoother, target);
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
		<section
			data-section-reveal
			data-section-hold
			className={cn('border-y border-border', className)}
		>
			<div
				ref={trackRef}
				className="relative"
				style={{
					height: `calc(100svh + ${stageCount * stageScrollVh}svh)`
				}}
			>
				<Pinned className="flex h-svh items-center overflow-hidden">
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
									maskImage: isSplit
										? SPLIT_SCENE_MASK
										: SCENE_MASK,
									WebkitMaskImage: isSplit
										? SPLIT_SCENE_MASK
										: SCENE_MASK
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
						className={cn(
							'pointer-events-none absolute inset-x-0 z-10 h-1/3 bg-linear-to-b from-transparent via-primary/10 to-transparent'
							// slideDirection === 'horizontal' && 'bg-linear-to-r',
							// slideDirection === 'vertical' && 'bg-linear-to-b'
						)}
						initial={{ y: '-100%', opacity: 0.9 }}
						animate={{ y: '300%', opacity: 0 }}
						transition={scaleTransition({
							duration: 1.2,
							ease: 'easeOut'
						})}
					/>

					{/* `split`: the opening holds the left column for the
					    whole sequence, so the stages have the right one to
					    themselves. Below `lg` it is a stage like any other. */}
					{isSplit ? (
						<div className="absolute inset-0 hidden items-center px-4 sm:px-6 lg:flex lg:px-8">
							<div className="mx-auto w-full max-w-7xl">
								<div className={SPLIT_GRID}>
									<ProblemIntro
										sectionIndex={sectionIndex}
										totalSections={totalSections}
										showCue={activeIndex === 0}
									/>
								</div>
							</div>
						</div>
					) : null}

					{stages.map((stage, index) => {
						const isActive = index === activeIndex;
						const content =
							stage.key === 'intro' ? (
								<ProblemIntro
									sectionIndex={sectionIndex}
									totalSections={totalSections}
									// Said already, beside the stages.
									className={cn(
										'max-w-3xl',
										isSplit && 'lg:hidden'
									)}
								/>
							) : stage.key === 'cost' ? (
								<RealCost
									isActive={isActive}
									narrow={isSplit}
								/>
							) : stage.item ? (
								<ProblemBody
									item={stage.item}
									number={stage.number ?? 1}
									drain={stage.drain}
									narrow={isSplit}
								/>
							) : null;

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
								<div className="mx-auto w-full max-w-7xl">
									{isSplit ? (
										<div className={SPLIT_GRID}>
											<div
												aria-hidden
												className="hidden lg:block"
											/>
											<div>{content}</div>
										</div>
									) : (
										content
									)}
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
							className="absolute inset-x-0 bottom-10 mx-auto flex w-fit cursor-pointer items-center gap-2 font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
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
				</Pinned>
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
		<section
			data-section-reveal
			data-section-hold
			className={cn('border-y border-border', className)}
		>
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="The Problem"
					title="Is this how you're building your digital solutions?"
					description="Most businesses face the same frustrating choices when building software."
					className="max-w-3xl"
				/>

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
					<p className="font-mono text-base tracking-[0.22em] text-primary uppercase">
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
								<p className="font-heading text-lg leading-snug text-foreground sm:text-xl">
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
