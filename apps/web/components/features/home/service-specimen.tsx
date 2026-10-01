'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { servicesRailLabels } from '@/constants/home';
import { serviceCategoryAnchors } from '@/enums/services';
import type { ServiceCategoryCard } from '@/types/home';
import { ServiceVisual } from '@workspace/service-visuals';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceSpecimenProps {
	card: ServiceCategoryCard;
	index: number;
	/** This one is under the pointer or keyboard focus. */
	focused: boolean;
	/** Some *other* one is, so this recedes. */
	dimmed: boolean;
	/** Even items sit above the spine, odd ones below (large screens only). */
	above: boolean;
	/** Whether hovering opens the detail popover across the spine. */
	showPopover: boolean;
	onFocusChange: (focusing: boolean) => void;
}

/** A real pointer move — not the synthetic one a browser sends after scroll. */
function movedPointer(event: React.MouseEvent) {
	return event.movementX !== 0 || event.movementY !== 0;
}

/** The category's services as links to their detail pages. */
function ServiceChips({ card }: { card: ServiceCategoryCard }) {
	return (
		<ul className="flex flex-wrap gap-2">
			{card.services.map((service) => (
				<li key={service.slug}>
					<Link
						href={`/services/${service.slug}`}
						className="inline-flex rounded-full border border-border px-3 py-1 text-xs text-foreground/85 transition-colors hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary focus-visible:outline-none"
					>
						{service.title}
					</Link>
				</li>
			))}
		</ul>
	);
}

/** The way on to the category's group on the Services page. */
function ExploreLink({
	card,
	className
}: {
	card: ServiceCategoryCard;
	className?: string;
}) {
	return (
		<Link
			href={`/services#${serviceCategoryAnchors[card.category]}`}
			className={cn(
				'group/explore inline-flex items-center gap-2 text-sm font-medium text-primary',
				className
			)}
		>
			{servicesRailLabels.explore} {card.title}
			<ArrowRight className="size-4 transition-transform duration-300 ease-power-on group-hover/explore:translate-x-1" />
		</Link>
	);
}

/**
 * One service category on the rail. The card opens the category's group on
 * the Services page; on large screens its popover — opened by hover, focus
 * or the pinned scroll — lists the category's services as links, plus a link
 * on to the group. Small screens have no hover, so the same content sits
 * inline under the card instead.
 */
export function ServiceSpecimen({
	card,
	index,
	focused,
	dimmed,
	above,
	showPopover,
	onFocusChange
}: ServiceSpecimenProps) {
	const revealed = showPopover && focused;

	return (
		<li
			// On the item, not the card: the popover holds links now, so the
			// pointer (or focus) moving from the card into it must keep it open.
			// The gap between the two is bridged by the teaser's close delay.
			onMouseEnter={() => onFocusChange(true)}
			// Re-claims focus once the reader moves the pointer again after a
			// scroll, which ignores hover while it runs.
			onMouseMove={(event) => movedPointer(event) && onFocusChange(true)}
			onMouseLeave={() => onFocusChange(false)}
			onFocus={() => onFocusChange(true)}
			onBlur={() => onFocusChange(false)}
			className={cn(
				// Fixed size on large screens: the height puts the edge facing
				// the spine at a known offset so the connector meets it
				// exactly, and the width lets any number of categories extend
				// along the spine and scroll instead of wrapping to a second
				// row the spine no longer relates to.
				'relative lg:h-65 lg:w-65 lg:shrink-0 lg:px-4 xl:h-75 xl:w-75',
				above ? 'lg:self-start' : 'lg:self-end'
			)}
		>
			<Link
				href={`/services#${serviceCategoryAnchors[card.category]}`}
				className={cn(
					// `translate` listed on its own: Tailwind's translate
					// utilities set that property, not `transform`.
					'group flex items-center gap-5 pl-12 transition-[opacity,translate] duration-1500 ease-power-on lg:h-full lg:gap-3 lg:pl-0',
					// Specimen always ends up nearest the spine.
					above
						? 'lg:flex-col-reverse lg:justify-start'
						: 'lg:flex-col lg:justify-start',
					dimmed && 'opacity-70',
					focused && 'lg:-translate-y-0.5'
				)}
			>
				<ServiceVisual
					kind={card.visualKind}
					focused={focused}
					className={cn(
						'size-24 shrink-0 transition-transform duration-1500 ease-power-on sm:size-28 lg:size-40 xl:size-48',
						focused && 'scale-120'
					)}
				/>

				<div className="min-w-0 lg:w-full lg:text-center">
					<p className="font-mono text-sm tracking-[0.2em] text-primary uppercase">
						{String(index + 1).padStart(2, '0')} ·{' '}
						{servicesRailLabels.servicesCount(card.services.length)}
					</p>
					<h3
						className={cn(
							'mt-1.5 font-heading text-lg font-semibold tracking-tight text-foreground transition-colors sm:text-xl lg:text-base xl:text-2xl',
							'group-hover:text-primary'
						)}
					>
						{card.title}
					</h3>
				</div>
			</Link>

			{/* Below the spine layout there's no hover to reveal a popover, so
			    its content stays inline and always readable. */}
			<div className="mt-4 space-y-4 pl-12 lg:hidden">
				<p className="max-w-sm text-sm text-muted-foreground">
					{card.summary}
				</p>
				<ServiceChips card={card} />
				<ExploreLink card={card} />
			</div>

			{/* Connector and node, bridging the fixed 30px gap to the spine. */}
			<span
				aria-hidden
				className={cn(
					'pointer-events-none absolute left-1/2 hidden h-7.5 w-px transition-colors duration-1500 lg:block',
					focused ? 'bg-primary' : 'bg-border',
					above ? 'top-full' : 'bottom-full'
				)}
			/>
			<span
				aria-hidden
				className={cn(
					'pointer-events-none absolute left-1/2 hidden size-1.5 -translate-x-1/2 rounded-full transition-colors duration-500 lg:block',
					focused ? 'bg-primary' : 'bg-muted-foreground/40',
					above
						? 'top-[calc(100%+30px)] -translate-y-1/2'
						: 'bottom-[calc(100%+30px)] translate-y-1/2'
				)}
			/>

			{showPopover ? (
				<>
					{/* The same thread continued through the spine: it grows
					    outward from the node to meet the panel. */}
					<span
						aria-hidden
						className={cn(
							'pointer-events-none absolute left-1/2 hidden h-7.5 w-px bg-primary transition-transform ease-power-on lg:block',
							revealed
								? 'scale-y-100 duration-700'
								: 'scale-y-0 duration-300',
							above
								? 'top-[calc(100%+30px)] origin-top'
								: 'bottom-[calc(100%+30px)] origin-bottom'
						)}
					/>

					{/* Absolutely positioned and fixed-size, so opening it can
					    never move anything. `lg:block` only — below that the
					    inline copy above stands in, so only one of the two is
					    ever in the page. Closed, it's `invisible` (after its
					    fade) so its links can't be tabbed to or clicked.
					    Opens slow and soft, a beat after the thread starts;
					    closes quicker, so a hand-over overlaps into a
					    cross-fade instead of one panel punching out as the
					    next punches in. */}
					<div
						className={cn(
							'absolute left-1/2 z-10 hidden w-80 -translate-x-1/2 rounded-xl border border-primary/40 bg-card/95 px-5 py-4 text-left shadow-2xl backdrop-blur-sm transition-[opacity,translate,scale,filter,visibility] lg:block',
							revealed
								? 'visible translate-y-0 scale-100 opacity-100 blur-none delay-100 duration-700 ease-power-on'
								: 'invisible scale-98 opacity-0 blur-[3px] duration-300 ease-out',
							above
								? 'top-[calc(100%+60px)] origin-top'
								: 'bottom-[calc(100%+60px)] origin-bottom',
							// Emerges from the spine, so it travels outward.
							!revealed &&
								(above ? '-translate-y-1.5' : 'translate-y-1.5')
						)}
					>
						<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
							{String(index + 1).padStart(2, '0')} · {card.title}
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							{card.summary}
						</p>
						<div className="mt-4">
							<ServiceChips card={card} />
						</div>
						<ExploreLink
							card={card}
							className="mt-4"
						/>
					</div>
				</>
			) : null}
		</li>
	);
}
