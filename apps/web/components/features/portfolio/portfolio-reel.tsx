'use client';

import { useLenis } from 'lenis/react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ProjectShift } from '@/components/features/portfolio/project-shift';
import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { DotField } from '@/components/snippets/dot-field/dot-field';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { projects, projectSectorVisuals } from '@/constants/portfolio';
import { projectSectorAnchors, projectSectorOrder } from '@/enums/portfolio';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ServiceVisual } from '@workspace/service-visuals';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface PortfolioReelProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/** Scroll travel each project gets while the stage is pinned. */
const frameHeight = '72svh';

/**
 * Scenery changes with the chapter, and rebuilding one of those scenes is real
 * work on the main thread — so a scroll that crosses several chapters waits for
 * the reader to stop rather than building every set it passed.
 */
const sceneSettleMs = 260;

/** Keeps the scene off the type on the left and off every edge of its panel. */
const sceneMask =
	'radial-gradient(ellipse 72% 78% at 52% 50%, #000 22%, transparent 78%)';

/**
 * The roster in running order — sector by sector, newest first inside each —
 * so the reel plays as five chapters rather than ten unrelated frames.
 */
const reel = projectSectorOrder.flatMap((sector) =>
	projects
		.filter((project) => project.sector === sector)
		.sort((a, b) => b.year.localeCompare(a.year))
);

/** Where each chapter opens, for the scrubber and the masthead's rail. */
const chapters = projectSectorOrder
	.map((sector) => ({
		sector,
		start: reel.findIndex((project) => project.sector === sector),
		items: reel
			.map((project, index) => ({ project, index }))
			.filter((entry) => entry.project.sector === sector)
	}))
	.filter((chapter) => chapter.items.length > 0);

const chapterAnchors = new Map(
	chapters.map((chapter) => [
		chapter.start,
		projectSectorAnchors[chapter.sector]
	])
);

/**
 * One project at a time, full-bleed, advanced by scrolling.
 *
 * A portfolio's job is to be watched rather than scanned — a list of ten rows
 * gives every project the same weight and none of them any presence. So the
 * stage pins and the work plays through it: the specimen from the service that
 * delivered the project sits behind the title as scenery, the change it made
 * lands under it, and the next frame arrives as this one leaves.
 *
 * Every frame stays in the DOM so the ten links are always crawlable and the
 * copy is always in the page; only the active one is visible and reachable.
 * The scrubber along the foot is what makes it browsable rather than a queue —
 * ten ticks, grouped into chapters, each one a jump.
 */
export function PortfolioReel({
	sectionIndex,
	totalSections,
	className
}: PortfolioReelProps) {
	const lenis = useLenis();
	// `hidden lg:block` would still mount the specimen and burn a WebGL context
	// on phones that never see it, so the scene is gated on the query instead.
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const trackRef = useRef<HTMLDivElement>(null);
	const markersRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [settledSector, setSettledSector] = useState(reel[0]?.sector);

	const goToFrame = useCallback(
		(index: number) => {
			const marker = markersRef.current?.children[index];
			if (!(marker instanceof HTMLElement)) return;

			// The frame is active once its middle crosses the middle of the
			// viewport, so that — not the marker's top — is what to scroll to.
			const top =
				marker.getBoundingClientRect().top +
				window.scrollY +
				marker.offsetHeight / 2 -
				window.innerHeight / 2;

			if (lenis) {
				lenis.scrollTo(top);
				return;
			}

			window.scrollTo({ top, behavior: 'smooth' });
		},
		[lenis]
	);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;

		let frame = 0;

		// Measured from the track's own rect each frame rather than from an
		// IntersectionObserver on the markers: a jump from the scrubber changes
		// several markers at once, and the observer delivers that a beat late —
		// long enough to leave the wrong project on a pinned stage. The loop
		// only runs while the reel is on screen.
		const measure = () => {
			const rect = track.getBoundingClientRect();
			const height = rect.height / reel.length;
			// Which frame the middle of the viewport is currently over.
			const reading = window.innerHeight / 2 - rect.top;
			const next = Math.min(
				reel.length - 1,
				Math.max(0, Math.floor(reading / height))
			);

			setActiveIndex((current) => (current === next ? current : next));
			frame = requestAnimationFrame(measure);
		};

		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				if (!frame) frame = requestAnimationFrame(measure);
				return;
			}

			if (frame) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		});

		observer.observe(track);

		return () => {
			observer.disconnect();
			if (frame) cancelAnimationFrame(frame);
		};
	}, []);

	const activeProject = reel[activeIndex];
	const activeSector = activeProject?.sector;

	useEffect(() => {
		const timer = setTimeout(
			() => setSettledSector(activeSector),
			sceneSettleMs
		);

		return () => clearTimeout(timer);
	}, [activeSector]);

	const settledVisual = settledSector
		? projectSectorVisuals[settledSector]
		: undefined;

	return (
		<section
			className={cn('relative isolate border-t border-border', className)}
		>
			<div
				ref={trackRef}
				className="relative"
				style={{
					height: `calc(${reel.length} * ${frameHeight})`
				}}
			>
				<div className="sticky top-0 h-svh overflow-hidden">
					<Atmosphere intensity="quiet" />
					<DotField spacing={26} />

					{/* Scenery, not a specimen card: the scene the service page
					    frames and labels runs full-bleed here, dimmed and washed
					    out under the type so it reads as the room the work sits
					    in rather than as a diagram of it. */}
					{isDesktop && settledVisual ? (
						<div
							// Deliberately smaller than the space it appears to
							// fill. A WebGL surface costs by the pixel, and a
							// full-bleed one behind every frame is the most
							// expensive thing on the page for the least reason —
							// the mask below makes a panel this size read as
							// scenery running past the edges anyway.
							className="pointer-events-none absolute top-1/2 -right-[2%] h-[72%] w-[50%] -translate-y-1/2 opacity-70"
							style={{
								maskImage: sceneMask,
								WebkitMaskImage: sceneMask
							}}
						>
							<ServiceVisual
								key={settledSector}
								kind={settledVisual}
								focused
								className="h-full w-full"
							/>
						</div>
					) : null}

					<div className="relative mx-auto flex h-full w-full max-w-7xl flex-col px-4 pt-24 pb-5 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between gap-6 border-b border-border pb-4">
							<SectionTag
								index={sectionIndex}
								total={totalSections}
								label="The reel"
							/>

							<p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
								Frame
								<span className="ml-3 text-foreground">
									{String(activeIndex + 1).padStart(2, '0')}
								</span>
								<span className="mx-1.5 text-border">/</span>
								{String(reel.length).padStart(2, '0')}
							</p>
						</div>

						<div className="relative flex-1">
							{reel.map((project, index) => {
								const isActive = index === activeIndex;

								return (
									<div
										key={project.slug}
										inert={!isActive}
										className={cn(
											'absolute inset-0 flex items-center',
											!isActive && 'pointer-events-none'
										)}
									>
										<article
											className={cn(
												'w-full motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-power-on',
												isActive
													? 'translate-y-0 opacity-100'
													: index > activeIndex
														? 'translate-y-8 opacity-0'
														: '-translate-y-8 opacity-0'
											)}
										>
											<p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
												{project.sector}
											</p>

											<h2 className="mt-4 max-w-3xl font-heading text-[clamp(2.5rem,6.4vw,5.5rem)] leading-[0.95] font-semibold tracking-tight text-balance text-foreground">
												{project.name}
											</h2>

											<p className="mt-6 max-w-xl font-serif text-xl text-pretty text-muted-foreground italic sm:text-2xl">
												{project.summary}
											</p>

											{project.results[0] ? (
												<ProjectShift
													result={project.results[0]}
													size="lg"
													className="mt-8"
												/>
											) : null}

											<div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
												<Button
													asChild
													size="lg"
													className="h-11 px-6"
												>
													<Link
														href={`/portfolio/${project.slug}`}
													>
														Open case study
														<ArrowUpRight />
													</Link>
												</Button>

												<p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
													{project.service}
													<span className="mx-2 text-border">
														·
													</span>
													{project.year}
												</p>
											</div>
										</article>
									</div>
								);
							})}
						</div>

						<div className="mt-auto flex items-end justify-between gap-6 border-t border-border pt-4">
							<p className="hidden font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase sm:block">
								{activeProject?.client}
							</p>

							<nav
								aria-label="Jump to a project"
								className="flex items-end gap-3 sm:gap-5"
							>
								{chapters.map((chapter) => (
									<div
										key={chapter.sector}
										className="flex items-end"
									>
										{chapter.items.map(
											({ project, index }) => (
												<button
													key={project.slug}
													type="button"
													onClick={() =>
														goToFrame(index)
													}
													aria-label={`${project.name} — ${project.sector}`}
													aria-current={
														index === activeIndex
													}
													className="group/tick flex h-7 items-end px-1.5 sm:px-2"
												>
													<span
														className={cn(
															'block w-px transition-all',
															index ===
																activeIndex
																? 'h-6 bg-primary'
																: 'h-2.5 bg-border group-hover/tick:h-5 group-hover/tick:bg-foreground'
														)}
													/>
												</button>
											)
										)}
									</div>
								))}
							</nav>
						</div>
					</div>

					<span
						aria-hidden
						className="absolute inset-x-0 bottom-0 h-px bg-border"
					>
						<span
							className="block h-px bg-primary transition-[width] duration-500 ease-power-on"
							style={{
								width: `${((activeIndex + 1) / reel.length) * 100}%`
							}}
						/>
					</span>
				</div>

				{/* One per frame, stacked down the track. They carry the chapter
				    anchors the masthead rail links to, and give the scrubber
				    something real to measure a jump against. */}
				<div
					ref={markersRef}
					aria-hidden
					className="pointer-events-none absolute inset-x-0 top-0"
				>
					{reel.map((project, index) => (
						<div
							key={project.slug}
							id={chapterAnchors.get(index)}
							style={{ height: frameHeight }}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
