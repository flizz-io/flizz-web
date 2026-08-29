'use client';

import { useMemo, useState } from 'react';

import { ServiceSpecimen } from '@/components/features/home/service-specimen';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { serviceCards } from '@/constants/home';
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
	limit = 3
}: ServicesTeaserProps) {
	// One shared index rather than per-item state: focusing one has to dim its
	// siblings and drive the shared caption, which only a common owner can do.
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

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
				{/* The spine: vertical while the items are stacked, horizontal
				    and full-bleed once they straddle it. */}
				<span
					aria-hidden
					className="absolute top-0 bottom-0 left-6 w-px bg-border sm:left-8 lg:inset-x-0 lg:top-1/2 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
				/>

				<div className="mx-auto hidden max-w-6xl px-4 sm:px-6 lg:block lg:px-8">
					<div className="absolute top-1/2 left-0 flex w-full -translate-y-1/2 justify-between px-4 sm:px-6 lg:px-8">
						<span className="bg-background pr-3 font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase">
							Start
						</span>
						<span className="bg-background pl-3 font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase">
							Scale
						</span>
					</div>
				</div>

				<ul className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:gap-14 sm:px-6 lg:grid lg:h-145 lg:max-w-none lg:grid-cols-6 lg:gap-0 lg:px-6 xl:h-165">
					{displayServices.map((service, index) => (
						<ServiceSpecimen
							key={service.title}
							service={service}
							index={index}
							above={index % 2 === 0}
							focused={focusedIndex === index}
							dimmed={
								focusedIndex !== null && focusedIndex !== index
							}
							onFocusChange={(focusing) =>
								setFocusedIndex((current) => {
									if (focusing) return index;
									return current === index ? null : current;
								})
							}
						/>
					))}
				</ul>
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
