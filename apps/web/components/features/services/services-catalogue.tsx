'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Reveal } from '@/components/snippets/reveal/reveal';
import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { SectionTag } from '@/components/snippets/section-tag/section-tag';
import { services } from '@/constants/services';
import { serviceCategoryAnchors, serviceCategoryOrder } from '@/enums/services';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ServiceVisual } from '@workspace/service-visuals';
import { cn } from '@workspace/ui/lib/utils';

interface ServicesCatalogueProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
}

/**
 * Swapping the specimen rebuilds a Three scene, so a cursor dragged down the
 * index would rebuild once per row it crossed. This lets the pointer settle
 * first.
 */
const specimenSettleMs = 130;

/**
 * An index and one viewer, rather than twelve cards each carrying their own
 * canvas. Two reasons, and both matter:
 *
 * The home teaser already spends the specimens as a horizontal spine of small
 * scenes; repeating that here would make the list page read as the same section
 * twice. Giving a single specimen a large stage shows the work the visuals
 * package actually does.
 *
 * And twelve live WebGL contexts on one page sits at the browser's ceiling.
 * One viewer means one context, whatever the roster grows to.
 */
export function ServicesCatalogue({
	sectionIndex,
	totalSections,
	className
}: ServicesCatalogueProps) {
	// `hidden lg:block` would still mount the specimen and burn a WebGL context
	// on phones that never see it, so the viewer is gated on the query instead.
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const [activeSlug, setActiveSlug] = useState(services[0]?.slug ?? '');
	const [settledSlug, setSettledSlug] = useState(activeSlug);

	const grouped = useMemo(
		() =>
			serviceCategoryOrder.map((category) => ({
				category,
				items: services.filter(
					(service) => service.category === category
				)
			})),
		[]
	);

	useEffect(() => {
		const timer = setTimeout(
			() => setSettledSlug(activeSlug),
			specimenSettleMs
		);

		return () => clearTimeout(timer);
	}, [activeSlug]);

	const settled = services.find((service) => service.slug === settledSlug);

	return (
		<section
			className={cn(
				'border-t border-border px-4 py-20 sm:px-6 sm:py-28 lg:px-8',
				className
			)}
		>
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<SectionTag
						index={sectionIndex}
						total={totalSections}
						label="The catalogue"
					/>
				</Reveal>

				<div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
					<div
						// Extra room under the last group on desktop only: the
						// viewer is sticky within this grid row, so without it
						// the row ends before the final services scroll past and
						// the specimen drifts out of view just as they are read.
						className="space-y-14 lg:pb-32"
					>
						{grouped.map(({ category, items }, groupIndex) => (
							<Reveal
								key={category}
								delay={groupIndex * 60}
								// Detail pages link back to their own category,
								// so each group is an anchor. The scroll margin
								// clears the sticky header.
								id={serviceCategoryAnchors[category]}
								className="scroll-mt-28"
							>
								<p className="flex items-baseline gap-3 border-b border-border pb-3 font-mono text-sm tracking-[0.2em] text-primary uppercase">
									{category}
									<span className="text-muted-foreground">
										{String(items.length).padStart(2, '0')}
									</span>
								</p>

								<ul>
									{items.map((service) => {
										const isActive =
											service.slug === activeSlug;

										return (
											<li
												key={service.slug}
												// On the row rather than the
												// Link, so the behaviour does
												// not depend on which props
												// next/link chooses to forward.
												// React's synthetic focus
												// bubbles, so the row catches
												// focus from the anchor inside.
												onMouseEnter={() =>
													setActiveSlug(service.slug)
												}
												onFocus={() =>
													setActiveSlug(service.slug)
												}
											>
												<Link
													href={`/services/${service.slug}`}
													className={cn(
														'group/row flex items-start gap-5 border-b border-border py-5 transition-colors',
														// A hairline marker rather
														// than a fill — the row
														// should mark itself
														// without becoming a card.
														'border-l-2 pl-4 sm:pl-5',
														isActive
															? 'border-l-primary'
															: 'border-l-transparent'
													)}
												>
													<span className="flex-1">
														<span
															className={cn(
																'block font-heading text-lg font-semibold tracking-tight text-balance transition-colors sm:text-xl',
																isActive
																	? 'text-primary'
																	: 'text-foreground'
															)}
														>
															{service.title}
														</span>
														<span className="mt-1.5 block max-w-md text-sm text-pretty text-muted-foreground">
															{service.summary}
														</span>
													</span>

													<ArrowUpRight
														className={cn(
															'mt-1 size-4 shrink-0 transition-all',
															isActive
																? 'translate-x-0.5 -translate-y-0.5 text-primary'
																: 'text-muted-foreground'
														)}
													/>
												</Link>
											</li>
										);
									})}
								</ul>
							</Reveal>
						))}
					</div>

					{/* Pointer-driven, so desktop only — below `lg` every row
					    already carries its own summary. */}
					{isDesktop ? (
						<div className="sticky top-28 self-start">
							<SchematicFrame className="border border-border bg-card/40">
								<div className="flex items-center justify-between border-b border-border px-5 py-3">
									<span className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
										Specimen
									</span>
									<span className="font-mono text-sm tracking-[0.2em] text-primary uppercase">
										{settled?.category}
									</span>
								</div>

								{settled ? (
									<>
										<ServiceVisual
											key={settled.slug}
											kind={settled.visualKind}
											focused
											className="h-80 w-full"
										/>

										<div className="border-t border-border px-5 py-5">
											<h2 className="font-heading text-xl font-semibold tracking-tight text-balance text-foreground">
												{settled.title}
											</h2>
											<p className="mt-2 text-sm text-pretty text-muted-foreground">
												{settled.summary}
											</p>
											<Link
												href={`/services/${settled.slug}`}
												className="group/link mt-5 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] text-foreground uppercase underline-offset-4 hover:text-primary hover:underline"
											>
												View service
												<ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
											</Link>
										</div>
									</>
								) : null}
							</SchematicFrame>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
