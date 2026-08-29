'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ServiceSpecimen } from '@/components/features/home/service-specimen';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { serviceCards } from '@/constants/home';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { cn } from '@workspace/ui/lib/utils';

/** Grace period before a popover closes, so crossing a gap doesn't flicker it. */
const HIDE_DELAY_MS = 1000;

interface ServicesTeaserProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
	limit?: number;
	/** Opens a detail panel across the spine on hover. Off leaves the
	    focus/dim behaviour intact without the panel. */
	showPopover?: boolean;
}

export function ServicesTeaser({
	className,
	sectionIndex,
	totalSections,
	limit = 8,
	showPopover = true
}: ServicesTeaserProps) {
	// One shared index rather than per-item state: focusing one has to dim its
	// siblings too, which only a common owner can coordinate.
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const hideTimer = useRef<number | null>(null);
	const dragHandlers = useDragScroll(viewportRef);

	const displayServices = useMemo(
		() => (limit ? serviceCards.slice(0, limit) : serviceCards),
		[limit]
	);

	const clearHideTimer = () => {
		if (hideTimer.current === null) return;

		window.clearTimeout(hideTimer.current);
		hideTimer.current = null;
	};

	const handleFocusChange = useCallback(
		(index: number, focusing: boolean) => {
			// Entering anything cancels a pending close, so moving between
			// services swaps the popover rather than blinking it off and on.
			clearHideTimer();

			if (focusing) {
				setFocusedIndex(index);
				return;
			}

			hideTimer.current = window.setTimeout(() => {
				hideTimer.current = null;
				setFocusedIndex((current) =>
					current === index ? null : current
				);
			}, HIDE_DELAY_MS);
		},
		[]
	);

	useEffect(() => clearHideTimer, []);

	return (
		<section className={cn(className, 'overflow-x-clip py-20 sm:py-28')}>
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="What We Build"
					title="Services for every build stage"
					description="A snapshot of what we do — the full list lives on the Services page."
					seeAllLabel="View all services"
					seeAllHref="/services"
				/>
			</div>

			<div className="relative mt-16 lg:mt-24">
				{/* Stacked layout keeps its spine on the left; the scrolling
				    layout carries its own inside the track, so the spine spans
				    every item rather than stopping at the viewport edge. */}
				<span
					aria-hidden
					className="absolute top-0 bottom-0 left-6 w-px bg-border sm:left-8 lg:hidden"
				/>

				{/* Edge fades as overlays rather than a mask on the scroller:
				    a mask would also fade any popover that opened near an edge. */}
				<span
					aria-hidden
					className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-14 bg-gradient-to-r from-background to-transparent lg:block"
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-14 bg-gradient-to-l from-background to-transparent lg:block"
				/>

				<div
					ref={viewportRef}
					{...dragHandlers}
					// `overflow-x: auto` computes `overflow-y` from visible to auto, so a
					// focused specimen's scale transform made this a vertical scroll
					// container too and the wheel got captured mid-page.
					className="lg:overflow-x-auto lg:overflow-y-hidden lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
				>
					<div className="relative lg:w-max lg:min-w-full lg:px-20">
						<span
							aria-hidden
							className="absolute inset-x-0 top-1/2 hidden h-px bg-border lg:block"
						/>
						{/* Inset past the edge fade so neither end label sits
						    under it and half-disappears. */}
						<span
							aria-hidden
							className="absolute top-1/2 left-16 hidden -translate-y-1/2 bg-background pr-3 font-mono text-[0.65rem] tracking-[0.3em] text-foreground/70 uppercase lg:block"
						>
							Start
						</span>
						<span
							aria-hidden
							className="absolute top-1/2 right-16 hidden -translate-y-1/2 bg-background pl-3 font-mono text-[0.65rem] tracking-[0.3em] text-foreground/70 uppercase lg:block"
						>
							Scale
						</span>

						{/* `w-max` + `mx-auto`: a short list centres on the
						    spine, a long one fills the track and scrolls. */}
						<ul className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:gap-14 sm:px-6 lg:h-145 lg:w-max lg:max-w-none lg:flex-row lg:gap-0 lg:px-0 xl:h-165">
							{displayServices.map((service, index) => (
								<ServiceSpecimen
									key={`${service.title}-${index}`}
									service={service}
									index={index}
									above={index % 2 === 0}
									showPopover={showPopover}
									focused={focusedIndex === index}
									dimmed={
										focusedIndex !== null &&
										focusedIndex !== index
									}
									onFocusChange={(focusing) =>
										handleFocusChange(index, focusing)
									}
								/>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
