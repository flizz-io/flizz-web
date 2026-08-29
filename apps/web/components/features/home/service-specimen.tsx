'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/snippets/reveal/reveal';
import type { ServiceCard } from '@/types/home';
import { ServiceVisual } from '@workspace/service-visuals';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceSpecimenProps {
	service: ServiceCard;
	index: number;
	/** This card is the one under the pointer/focus. */
	focused: boolean;
	/** Some *other* card is focused, so this one recedes. */
	dimmed: boolean;
	revealDelay?: number;
	onHoverChange: (hovering: boolean) => void;
}

export function ServiceSpecimen({
	service,
	index,
	focused,
	dimmed,
	revealDelay = 0,
	onHoverChange
}: ServiceSpecimenProps) {
	return (
		<Reveal delay={revealDelay}>
			<Link
				href="/services"
				onMouseEnter={() => onHoverChange(true)}
				onMouseLeave={() => onHoverChange(false)}
				onFocus={() => onHoverChange(true)}
				onBlur={() => onHoverChange(false)}
				className={cn(
					'group relative block rounded-xl border border-border bg-card p-5 transition-[opacity,transform,border-color] duration-500 ease-power-on',
					focused && 'border-primary/50',
					dimmed && 'opacity-45 sm:scale-[0.98]'
				)}
			>
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500"
					style={{
						opacity: focused ? 1 : 0,
						background:
							'radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 70%)'
					}}
				/>

				<div className="relative aspect-square overflow-hidden rounded-lg border border-border/70 bg-background/40">
					<span
						aria-hidden
						className="pointer-events-none absolute inset-0 opacity-[0.06]"
						style={{
							backgroundImage:
								'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
							backgroundSize: '14px 14px'
						}}
					/>
					<ServiceVisual
						kind={service.visualKind}
						focused={focused}
						className="absolute inset-0"
					/>
				</div>

				<div className="relative mt-5 flex items-start justify-between gap-3">
					<div>
						<span className="font-mono text-xs text-muted-foreground">
							{String(index + 1).padStart(2, '0')}
						</span>
						<p className="mt-1 font-mono text-[0.6rem] tracking-[0.2em] text-primary uppercase">
							{service.category}
						</p>
						<h3 className="mt-1 font-heading text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
							{service.title}
						</h3>
					</div>
					<ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
				</div>
				<p className="relative mt-2 text-sm text-muted-foreground">
					{service.description}
				</p>
			</Link>
		</Reveal>
	);
}
