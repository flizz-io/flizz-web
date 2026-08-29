'use client';

import Link from 'next/link';

import type { ServiceCard } from '@/types/home';
import { ServiceVisual } from '@workspace/service-visuals';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceSpecimenProps {
	service: ServiceCard;
	index: number;
	/** This one is under the pointer or keyboard focus. */
	focused: boolean;
	/** Some *other* one is, so this recedes. */
	dimmed: boolean;
	/** Even items sit above the spine, odd ones below (large screens only). */
	above: boolean;
	onFocusChange: (focusing: boolean) => void;
}

export function ServiceSpecimen({
	service,
	index,
	focused,
	dimmed,
	above,
	onFocusChange
}: ServiceSpecimenProps) {
	return (
		<li
			className={cn(
				// Fixed height on large screens so the edge facing the spine
				// sits at a known offset and the connector can meet it exactly.
				'relative lg:h-65 lg:px-4 xl:h-75',
				above ? 'lg:self-start' : 'lg:self-end'
			)}
		>
			<Link
				href="/services"
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
					<p className="font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">
						{String(index + 1).padStart(2, '0')} ·{' '}
						{service.category}
					</p>
					<h3
						className={cn(
							'mt-1.5 font-heading text-lg font-semibold tracking-tight text-foreground transition-colors sm:text-xl lg:text-base xl:text-lg',
							'group-hover:text-primary'
						)}
					>
						{service.title}
					</h3>
					{/* Below the spine layout there's no hover to reveal a
					    caption, so the copy stays inline and always readable. */}
					<p className="mt-2 max-w-sm text-sm text-muted-foreground lg:hidden">
						{service.description}
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
		</li>
	);
}
