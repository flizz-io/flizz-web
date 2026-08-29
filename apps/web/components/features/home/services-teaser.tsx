'use client';

import { useMemo, useRef, useState } from 'react';

import { ServiceSpecimen } from '@/components/features/home/service-specimen';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { serviceCards } from '@/constants/home';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { cn } from '@workspace/ui/lib/utils';

interface ServicesTeaserProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
	limit?: number;
}

export function ServicesTeaser({
	className,
	sectionIndex,
	totalSections,
	limit = 4
}: ServicesTeaserProps) {
	// One shared index rather than per-item state: focusing one has to dim its
	// siblings and drive the shared caption, which only a common owner can do.
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const dragHandlers = useDragScroll(viewportRef);

	const displayServices = useMemo(
		() => (limit ? serviceCards.slice(0, limit) : serviceCards),
		[limit]
	);

	// The resting caption names the practice areas instead of sitting empty.
	const restingCaption = useMemo(
		() =>
			Array.from(
				new Set(displayServices.map((service) => service.category))
			).join(' · '),
		[displayServices]
	);

	const focusedService =
		focusedIndex === null ? null : displayServices[focusedIndex];

	return (
		<section className={cn(className, 'overflow-x-clip py-20 sm:py-28')}>
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="What We Build"
					title="Services for every stage of the build"
					description="A snapshot of what we do — the full list lives on the Services page."
					seeAllLabel="View all services"
					seeAllHref="/services"
				/>
			</div>

			<div className="relative mt-16 lg:mt-20">
				{/* Stacked layout keeps its spine on the left; the scrolling
				    layout carries its own inside the track, so the spine spans
				    every item rather than stopping at the viewport edge. */}
				<span
					aria-hidden
					className="absolute top-0 bottom-0 left-6 w-px bg-border sm:left-8 lg:hidden"
				/>

				<div
					ref={viewportRef}
					// Lenis owns the wheel; without this a horizontal swipe over
					// the track is swallowed by page scroll.
					data-lenis-prevent
					{...dragHandlers}
					className="lg:overflow-x-auto lg:[mask-image:linear-gradient(to_right,transparent,#000_3%,#000_97%,transparent)] lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
				>
					<div className="relative lg:w-max lg:min-w-full lg:px-20">
						<span
							aria-hidden
							className="absolute inset-x-0 top-1/2 hidden h-px bg-border lg:block"
						/>
						<span
							aria-hidden
							className="absolute top-1/2 left-0 hidden -translate-y-1/2 bg-background pr-3 font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase lg:block"
						>
							Start
						</span>
						<span
							aria-hidden
							className="absolute top-1/2 right-0 hidden -translate-y-1/2 bg-background pl-3 font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase lg:block"
						>
							Scale
						</span>

						<ul className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:gap-14 sm:px-6 lg:h-[580px] lg:max-w-none lg:flex-row lg:gap-0 lg:px-0 xl:h-[660px]">
							{displayServices.map((service, index) => (
								<ServiceSpecimen
									key={`${service.title}-${index}`}
									service={service}
									index={index}
									above={index % 2 === 0}
									focused={focusedIndex === index}
									dimmed={
										focusedIndex !== null &&
										focusedIndex !== index
									}
									onFocusChange={(focusing) =>
										setFocusedIndex((current) => {
											if (focusing) return index;
											return current === index
												? null
												: current;
										})
									}
								/>
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* Fixed height, so swapping the caption on focus can never move
			    anything below it. Only large screens use it — the stacked
			    layout keeps each description inline instead. */}
			<div className="mx-auto hidden max-w-6xl px-4 sm:px-6 lg:block lg:px-8">
				<div className="mt-10 flex h-14 items-start border-t border-border pt-5">
					<p
						className={cn(
							'font-serif text-lg text-balance transition-colors duration-300 sm:text-xl',
							focusedService
								? 'text-foreground'
								: 'font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase'
						)}
					>
						{focusedService?.description ?? restingCaption}
					</p>
				</div>
			</div>
		</section>
	);
}
