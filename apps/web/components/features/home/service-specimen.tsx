'use client';

import Link from 'next/link';

import type { Service } from '@/types/services';
import { ServiceVisual } from '@workspace/service-visuals';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceSpecimenProps {
	service: Service;
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

export function ServiceSpecimen({
	service,
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
			className={cn(
				// Fixed size on large screens: the height puts the edge facing
				// the spine at a known offset so the connector meets it
				// exactly, and the width lets any number of services extend
				// along the spine and scroll instead of wrapping to a second
				// row the spine no longer relates to.
				'relative lg:h-65 lg:w-65 lg:shrink-0 lg:px-4 xl:h-75 xl:w-75',
				above ? 'lg:self-start' : 'lg:self-end'
			)}
		>
			<Link
				href={`/services/${service.slug}`}
				onMouseEnter={() => onFocusChange(true)}
				onMouseLeave={() => onFocusChange(false)}
				onFocus={() => onFocusChange(true)}
				onBlur={() => onFocusChange(false)}
				className={cn(
					'group flex h-full items-center gap-5 pl-12 transition-[opacity,transform] duration-1500 ease-power-on lg:gap-3 lg:pl-0',
					// Specimen always ends up nearest the spine.
					above
						? 'lg:flex-col-reverse lg:justify-start'
						: 'lg:flex-col lg:justify-start',
					dimmed && 'opacity-70',
					focused && 'lg:-translate-y-0.5'
				)}
			>
				<ServiceVisual
					kind={service.visualKind}
					focused={focused}
					className={cn(
						'size-24 shrink-0 transition-transform duration-1500 ease-power-on sm:size-28 lg:size-40 xl:size-48',
						focused && 'scale-120'
					)}
				/>

				<div className="min-w-0 lg:w-full lg:text-center">
					<p className="font-mono text-sm tracking-[0.2em] text-primary uppercase">
						{String(index + 1).padStart(2, '0')} ·{' '}
						{service.category}
					</p>
					<h3
						className={cn(
							'mt-1.5 font-heading text-lg font-semibold tracking-tight text-foreground transition-colors sm:text-xl lg:text-base xl:text-2xl',
							'group-hover:text-primary'
						)}
					>
						{service.title}
					</h3>
					{/* Below the spine layout there's no hover to reveal a
					    caption, so the copy stays inline and always readable. */}
					<p className="mt-2 max-w-sm text-sm text-muted-foreground lg:hidden">
						{service.summary}
					</p>
				</div>
			</Link>

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
							'pointer-events-none absolute left-1/2 hidden h-7.5 w-px bg-primary transition-transform duration-400 ease-power-on lg:block',
							revealed ? 'scale-y-100' : 'scale-y-0',
							above
								? 'top-[calc(100%+30px)] origin-top'
								: 'bottom-[calc(100%+30px)] origin-bottom'
						)}
					/>

					{/* Absolutely positioned and fixed-size, so opening it can
					    never move anything. Duplicates copy already in the DOM
					    for the stacked layout, so it stays out of the a11y tree. */}
					<div
						aria-hidden
						className={cn(
							'pointer-events-none absolute left-1/2 hidden w-75 rounded-xl border border-primary/40 bg-card/95 px-5 py-4 shadow-2xl backdrop-blur-sm transition-[opacity,transform] duration-400 ease-power-on lg:block',
							revealed
								? '-translate-x-1/2 translate-y-0 opacity-100'
								: 'opacity-0',
							above
								? 'top-[calc(100%+60px)]'
								: 'bottom-[calc(100%+60px)]',
							// Emerges from the spine, so it travels outward.
							!revealed &&
								(above
									? '-translate-x-1/2 -translate-y-2'
									: '-translate-x-1/2 translate-y-2')
						)}
					>
						<p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
							{service.category}
						</p>
						<p className="mt-2 font-heading text-base font-semibold tracking-tight text-foreground">
							{service.title}
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							{service.summary}
						</p>
					</div>
				</>
			) : null}
		</li>
	);
}
