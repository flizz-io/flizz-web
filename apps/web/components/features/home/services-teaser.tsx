'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { RailCursor } from '@/components/features/home/rail-cursor';
import { ServiceSpecimen } from '@/components/features/home/service-specimen';
import { SpineArrow } from '@/components/features/home/spine-arrow';
import { SectionHeader } from '@/components/snippets/section-header/section-header';
import { serviceCards, servicesRailLabels } from '@/constants/home';
import { ScrollDirection } from '@/enums/scroll';
import { useDragScroll } from '@/hooks/use-drag-scroll';
import { usePinnedRail } from '@/hooks/use-pinned-rail';
import { useScrollEdges } from '@/hooks/use-scroll-edges';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { cn } from '@workspace/ui/lib/utils';

/** Grace period before a popover closes, so crossing a gap doesn't flicker it. */
const HIDE_DELAY_MS = 1000;
/** Share of the visible strip an arrow click advances by (unpinned strip). */
const ARROW_STEP = 0.7;
/** Page scroll each service holds the pinned rail for, in viewport heights. */
const ITEM_SCROLL_VH = 60;
/** Quiet time after the rail's last move before hover counts again. */
const SCROLL_SETTLE_MS = 200;

interface ServicesTeaserProps {
	sectionIndex: number;
	totalSections?: number;
	className?: string;
	limit?: number;
	/** Opens a detail panel across the spine on hover. Off leaves the
	    focus/dim behaviour intact without the panel. */
	showPopover?: boolean;
	/**
	 * Pinned rail (large screens): how much page scroll each service holds
	 * the rail still for, in viewport heights (vh). Higher reads as a longer
	 * stop on each item; the whole run is this × the number of services.
	 */
	itemScrollVh?: number;
	/**
	 * Pinned rail (large screens): stop on each service as the page scrolls
	 * and open its popover while the rail rests there. Off, the rail pans
	 * 1:1 with the scroll and popovers open on hover only.
	 */
	stepOnScroll?: boolean;
	/**
	 * With `stepOnScroll`: whether scrolling back up opens popovers too.
	 * Off, they only open on the way down. The rail still stops on each
	 * service both ways — its position follows the page's, so it can't
	 * differ by direction without jumping.
	 */
	stepOnReverse?: boolean;
}

export function ServicesTeaser({
	className,
	sectionIndex,
	totalSections,
	limit = 8,
	showPopover = true,
	itemScrollVh = ITEM_SCROLL_VH,
	stepOnScroll = true,
	stepOnReverse = true
}: ServicesTeaserProps) {
	// One shared index rather than per-item state: focusing one has to dim its
	// siblings too, which only a common owner can coordinate.
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	// The service the page's scroll has reached while the rail is pinned.
	const [scrolledIndex, setScrolledIndex] = useState<number | null>(null);
	// The page is scrolling the rail right now — the scroll's service wins.
	const [scrolling, setScrolling] = useState(false);
	const scrollingRef = useRef(false);
	const settleTimer = useRef<number | null>(null);
	const railRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const hideTimer = useRef<number | null>(null);
	const stripScroller = useSmoothScroll(viewportRef);

	const displayServices = useMemo(
		() => (limit ? serviceCards.slice(0, limit) : serviceCards),
		[limit]
	);

	const clearHideTimer = () => {
		if (hideTimer.current === null) return;

		window.clearTimeout(hideTimer.current);
		hideTimer.current = null;
	};

	/** Hover is set aside while the rail moves, and waits for a real pointer
	    move afterwards — a pointer parked on the rail never takes over. */
	const markScrolling = useCallback(() => {
		if (!scrollingRef.current) {
			scrollingRef.current = true;
			setScrolling(true);
			clearHideTimer();
			setHoveredIndex(null);
		}

		if (settleTimer.current !== null) {
			window.clearTimeout(settleTimer.current);
		}
		settleTimer.current = window.setTimeout(() => {
			settleTimer.current = null;
			scrollingRef.current = false;
			setScrolling(false);
		}, SCROLL_SETTLE_MS);
	}, []);

	// The rail rests on one service at a time, so its popover is open for as
	// long as the rail holds there; it hands over halfway through the move.
	const handleRailPosition = useCallback(
		(position: number | null, direction: number) => {
			if (position === null) {
				setScrolledIndex(null);
				return;
			}

			markScrolling();
			setScrolledIndex(
				direction < 0 && !stepOnReverse ? null : Math.round(position)
			);
		},
		[markScrolling, stepOnReverse]
	);

	// Large screens: the page's vertical scroll walks the rail one service at
	// a time, and drag, arrows and wheel all move the page. Elsewhere the
	// strip scrolls itself.
	const railScroller = usePinnedRail(railRef, viewportRef, {
		steps: displayServices.length,
		stepped: stepOnScroll,
		stepScrollVh: itemScrollVh,
		onPosition: stepOnScroll ? handleRailPosition : undefined
	});
	const scroller = railScroller ?? stripScroller;
	const dragHandlers = useDragScroll(viewportRef, { scroller });
	const { hiddenBefore, hiddenAfter } = useScrollEdges(viewportRef, listRef);
	// While the page scrolls the rail, the scroll's service wins; at rest, a
	// hovered (or keyboard-focused) service does.
	const focusedIndex = scrolling
		? scrolledIndex
		: (hoveredIndex ?? scrolledIndex);

	const handleFocusChange = useCallback(
		(index: number, focusing: boolean) => {
			// Mid-scroll the rail is sliding under a still pointer — that
			// isn't the reader choosing a service.
			if (focusing && scrollingRef.current) return;

			// Entering anything cancels a pending close, so moving between
			// services swaps the popover rather than blinking it off and on.
			clearHideTimer();

			if (focusing) {
				setHoveredIndex(index);
				return;
			}

			hideTimer.current = window.setTimeout(() => {
				hideTimer.current = null;
				setHoveredIndex((current) =>
					current === index ? null : current
				);
			}, HIDE_DELAY_MS);
		},
		[]
	);

	const handleArrowClick = useCallback(
		(direction: ScrollDirection) => {
			const sign = direction === ScrollDirection.NEXT ? 1 : -1;

			// Pinned, an arrow glides the page on to the next stop; the free
			// strip already eases every move on its own.
			if (railScroller) {
				railScroller.stepBy(sign);
				return;
			}

			const width = viewportRef.current?.clientWidth ?? 0;
			scroller.scrollBy(sign * width * ARROW_STEP);
		},
		[railScroller, scroller]
	);

	useEffect(
		() => () => {
			clearHideTimer();
			if (settleTimer.current !== null) {
				window.clearTimeout(settleTimer.current);
			}
		},
		[]
	);

	return (
		<section
			data-section-reveal
			data-section-hold
			className={cn(className, 'overflow-x-clip py-20 sm:py-28')}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<SectionHeader
					index={sectionIndex}
					total={totalSections}
					eyebrow="What We Build"
					title="Services for wherever your business is going"
					// title="Services for every build stage"
					description="A snapshot of what we do — the full list lives on the Services page."
					seeAllLabel="View all services"
					seeAllHref="/services"
				/>
			</div>

			<div
				ref={railRef}
				data-pinned
				className="relative mt-16 lg:mt-24"
			>
				{/* Stacked layout keeps its spine on the left; the scrolling
				    layout carries its own inside the track, so the spine spans
				    every item rather than stopping at the viewport edge. */}
				<span
					aria-hidden
					className="absolute top-0 bottom-0 left-6 w-px bg-border sm:left-8 lg:hidden"
				/>

				{/* Edge fades as overlays rather than a mask on the scroller:
				    a mask would also fade any popover that opened near an edge.
				    They deepen while that side hides something, seating the
				    arrow in shadow like a frame edge. */}
				<span
					aria-hidden
					className={cn(
						'pointer-events-none absolute inset-y-0 left-0 z-20 hidden bg-linear-to-r from-background to-transparent transition-[width] duration-700 ease-power-on lg:block',
						hiddenBefore > 0 ? 'w-48' : 'w-14'
					)}
				/>
				<span
					aria-hidden
					className={cn(
						'pointer-events-none absolute inset-y-0 right-0 z-20 hidden bg-linear-to-l from-background to-transparent transition-[width] duration-700 ease-power-on lg:block',
						hiddenAfter > 0 ? 'w-48' : 'w-14'
					)}
				/>

				<SpineArrow
					direction={ScrollDirection.PREVIOUS}
					count={hiddenBefore}
					label={servicesRailLabels.moreBefore}
					ariaLabel={servicesRailLabels.previousAria}
					onClick={() => handleArrowClick(ScrollDirection.PREVIOUS)}
				/>
				<SpineArrow
					direction={ScrollDirection.NEXT}
					count={hiddenAfter}
					label={servicesRailLabels.moreAfter}
					ariaLabel={servicesRailLabels.nextAria}
					onClick={() => handleArrowClick(ScrollDirection.NEXT)}
				/>

				<RailCursor
					targetRef={viewportRef}
					canScrollPrevious={hiddenBefore > 0}
					canScrollNext={hiddenAfter > 0}
				/>

				<div
					ref={viewportRef}
					{...dragHandlers}
					// `overflow-x: auto` computes `overflow-y` from visible to auto, so a
					// focused specimen's scale transform made this a vertical scroll
					// container too and the wheel got captured mid-page.
					// Mid-pan the grab wins over each specimen's link pointer.
					className="lg:scrollbar-none select-none lg:overflow-x-auto lg:overflow-y-hidden lg:[-ms-overflow-style:none] lg:data-panning:cursor-grabbing lg:data-panning:[&_*]:cursor-grabbing lg:[&::-webkit-scrollbar]:hidden"
				>
					<div className="relative lg:w-max lg:min-w-full lg:px-20">
						<span
							aria-hidden
							className="absolute inset-x-0 top-1/2 hidden h-px bg-foreground/40 lg:block"
						/>
						{/* Inset past the edge fade so neither end label sits
						    under it and half-disappears. */}
						<span
							aria-hidden
							className="absolute top-1/2 left-16 hidden -translate-y-1/2 bg-background pr-3 font-mono text-sm tracking-[0.3em] text-foreground/70 uppercase lg:block"
						>
							Start
						</span>
						<span
							aria-hidden
							className="absolute top-1/2 right-16 hidden -translate-y-1/2 bg-background pl-3 font-mono text-sm tracking-[0.3em] text-foreground/70 uppercase lg:block"
						>
							Scale
						</span>

						{/* `w-max` + `mx-auto`: a short list centres on the
						    spine, a long one fills the track and scrolls. */}
						<ul
							ref={listRef}
							className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:gap-14 sm:px-6 lg:h-145 lg:w-max lg:max-w-none lg:flex-row lg:gap-0 lg:px-0 xl:h-165"
						>
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
