'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProjectShift } from '@/components/features/portfolio/project-shift';
import { Atmosphere } from '@/components/snippets/atmosphere/atmosphere';
import { DotField } from '@/components/snippets/dot-field/dot-field';
import { MediaSlot } from '@/components/snippets/media-slot/media-slot';
import { Reveal } from '@/components/snippets/reveal/reveal';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { featuredProjects } from '@/constants/portfolio';
import { projectSectorOrder } from '@/enums/portfolio';
import { Button } from '@workspace/ui/components/button';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi
} from '@workspace/ui/components/carousel';
import { cn } from '@workspace/ui/lib/utils';

interface PortfolioCarouselProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * The highlighted work in running order — sector by sector, newest first inside
 * each — the same order the scroll reel plays, so switching variant never
 * reshuffles the work.
 */
const reel = projectSectorOrder.flatMap((sector) =>
	featuredProjects
		.filter((project) => project.sector === sector)
		.sort((a, b) => b.year.localeCompare(a.year))
);

/** Ticks grouped by chapter, so the scrubber shows the shape of the set. */
const chapters = projectSectorOrder
	.map((sector) => ({
		sector,
		items: reel
			.map((project, index) => ({ project, index }))
			.filter((entry) => entry.project.sector === sector)
	}))
	.filter((chapter) => chapter.items.length > 0);

/**
 * Hidden on phones: the region's height there is mostly caption, so a
 * percentage offset lands the arrows on the copy, and a thumb has the swipe and
 * the ticks anyway.
 */
const arrowClassName =
	'hidden size-11 border-border bg-background/80 text-foreground backdrop-blur-md hover:border-primary hover:text-primary sm:top-[42%] sm:inline-flex';

/**
 * The highlighted work as a run of stills, advanced by the visitor rather than
 * by the scroll position.
 *
 * Where the scroll reel puts a specimen behind the title, this puts the
 * project's own screenshot in front of it — the plate is the frame, with the
 * name and the change it made set into its foot like a caption on a still. The
 * neighbours peek in at the edges, dimmed, so the set reads as a strip of film
 * and not as one image at a time; a slow push in on the live plate is the one
 * piece of unprompted motion, and only when there is a real image to push into.
 *
 * Built on the shared carousel, so drag, swipe, arrow keys and looping come
 * from the same place the testimonials get them.
 */
export function PortfolioCarousel({
	sectionIndex,
	totalSections,
	className
}: PortfolioCarouselProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api) return;

		const onSelect = () => setCurrent(api.selectedScrollSnap());

		onSelect();
		api.on('select', onSelect);

		return () => {
			api.off('select', onSelect);
		};
	}, [api]);

	const active = reel[current];

	return (
		<section
			className={cn(
				'relative isolate overflow-hidden border-t border-border py-20 sm:py-28',
				className
			)}
		>
			<Atmosphere intensity="quiet" />
			<DotField spacing={26} />

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<Reveal className="flex items-center justify-between gap-6 border-b border-border pb-4">
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The reel"
					/>

					<p className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
						Frame
						<span className="ml-3 text-foreground">
							{String(current + 1).padStart(2, '0')}
						</span>
						<span className="mx-1.5 text-border">/</span>
						{String(reel.length).padStart(2, '0')}
					</p>
				</Reveal>
			</div>

			{/* Full width rather than the page container, so the neighbouring
			    plates can peek in from the viewport edges. */}
			<Reveal
				delay={120}
				className="relative mt-10"
			>
				<Carousel
					setApi={setApi}
					opts={{ align: 'center', loop: true, skipSnaps: false }}
					aria-label="Highlighted work"
				>
					<CarouselContent className="-ml-6 sm:-ml-8 lg:-ml-10">
						{reel.map((project, index) => {
							const isActive = index === current;
							const result = project.results[0];

							return (
								<CarouselItem
									key={project.slug}
									className="basis-[88%] pl-6 sm:basis-[82%] sm:pl-8 lg:basis-[74%] lg:pl-10"
								>
									<article
										className={cn(
											'motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-power-on',
											isActive
												? 'scale-100 opacity-100'
												: 'scale-[0.96] opacity-40'
										)}
									>
										<div
											// A peeking neighbour is an
											// invitation — clicking it brings it
											// forward, the way a strip of film
											// would be pulled along.
											onClick={() => {
												if (!isActive)
													api?.scrollTo(index);
											}}
											className={cn(
												'relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-card sm:aspect-16/9 lg:aspect-21/9',
												!isActive && 'cursor-pointer'
											)}
										>
											<div
												className={cn(
													'absolute inset-0 motion-safe:transition-transform motion-safe:duration-[9000ms] motion-safe:ease-linear',
													// The push in only means
													// something on a photograph;
													// on a reserved plate it just
													// slides the registration
													// marks around.
													isActive && project.image
														? 'scale-[1.06]'
														: 'scale-100'
												)}
											>
												<MediaSlot
													src={project.image}
													alt={project.name}
													label="Screenshot pending"
													sizes="(min-width: 1024px) 74vw, 88vw"
												/>
											</div>

											{/* The caption's scrim. Runs from
											    the foot only, so the top of a
											    real screenshot stays clean. */}
											<span
												aria-hidden
												className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
												style={{
													background:
														'linear-gradient(to top, color-mix(in oklab, var(--color-background) 94%, transparent), color-mix(in oklab, var(--color-background) 55%, transparent) 55%, transparent)'
												}}
											/>

											<div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 p-5 sm:p-8 lg:p-10">
												<div className="min-w-0">
													<p className="font-mono text-sm tracking-[0.2em] text-primary uppercase">
														{project.sector}
													</p>
													<h3 className="mt-3 max-w-2xl font-heading text-[clamp(1.75rem,4.2vw,3.75rem)] leading-[0.98] font-semibold tracking-tight text-balance text-foreground">
														{project.name}
													</h3>
												</div>

												{result ? (
													<ProjectShift
														result={result}
														align="right"
														className="hidden sm:block"
													/>
												) : null}
											</div>
										</div>

										{/* Only the live frame carries its
										    caption. On a peeking neighbour it
										    would be a second, dimmed line of
										    copy competing with the one being
										    read. */}
										<div
											className={cn(
												'mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-1 motion-safe:transition-opacity motion-safe:duration-500',
												isActive
													? 'opacity-100'
													: 'pointer-events-none opacity-0'
											)}
										>
											<p className="max-w-xl font-serif text-lg text-pretty text-muted-foreground italic sm:text-xl">
												{project.summary}
											</p>

											<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
												<p className="font-mono text-sm tracking-[0.18em] text-muted-foreground uppercase">
													{project.service}
													<span className="mx-2 text-border">
														·
													</span>
													{project.year}
												</p>

												<Button
													asChild
													size="lg"
													className="h-11 px-6"
												>
													<Link
														href={`/portfolio/${project.slug}`}
														tabIndex={
															isActive
																? undefined
																: -1
														}
														aria-hidden={!isActive}
													>
														Open case study
														<ArrowUpRight />
													</Link>
												</Button>
											</div>
										</div>
									</article>
								</CarouselItem>
							);
						})}
					</CarouselContent>

					<CarouselPrevious
						className={cn(
							arrowClassName,
							'left-3 sm:left-[4%] lg:left-[calc(13%-1.375rem)]'
						)}
					/>
					<CarouselNext
						className={cn(
							arrowClassName,
							'right-3 sm:right-[4%] lg:right-[calc(13%-1.375rem)]'
						)}
					/>
				</Carousel>
			</Reveal>

			<div className="relative mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between gap-6 border-t border-border pt-4">
					<p className="hidden font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase sm:block">
						{active?.client}
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
								{chapter.items.map(({ project, index }) => (
									<button
										key={project.slug}
										type="button"
										onClick={() => api?.scrollTo(index)}
										aria-label={`${project.name} — ${project.sector}`}
										aria-current={index === current}
										className="group/tick flex h-7 items-end px-1.5 sm:px-2"
									>
										<span
											className={cn(
												'block w-px transition-all',
												index === current
													? 'h-6 bg-primary'
													: 'h-2.5 bg-border group-hover/tick:h-5 group-hover/tick:bg-foreground'
											)}
										/>
									</button>
								))}
							</div>
						))}
					</nav>
				</div>
			</div>
		</section>
	);
}
