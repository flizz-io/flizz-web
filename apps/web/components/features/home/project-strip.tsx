'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { projectCards } from '@/constants/home';
import type { ProjectCard } from '@/types/home';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { cn } from '@workspace/ui/lib/utils';

const DRAG_THRESHOLD = 6;

/**
 * The slot a real screenshot will drop into. Marked as pending rather than
 * filled with invented cover art — this is a portfolio, and the placeholder
 * shouldn't be mistakeable for work we've done.
 */
function PendingShot({ project }: { project: ProjectCard }) {
	return (
		<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
			<span
				aria-hidden
				className="absolute inset-0 opacity-[0.1]"
				style={{
					backgroundImage:
						'radial-gradient(var(--color-foreground) 1px, transparent 1px)',
					backgroundSize: '16px 16px'
				}}
			/>

			{/* Registration marks — the conventions of an unfilled image slot,
			    so it reads as reserved rather than broken. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-4 border border-dashed border-border"
			/>
			{[
				'top-3 left-3 border-t border-l',
				'top-3 right-3 border-t border-r',
				'bottom-3 left-3 border-b border-l',
				'right-3 bottom-3 border-b border-r'
			].map((corner) => (
				<span
					key={corner}
					aria-hidden
					className={cn(
						'pointer-events-none absolute size-6 border-primary/50',
						corner
					)}
				/>
			))}
			<span
				aria-hidden
				className="pointer-events-none absolute top-1/2 left-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 bg-border"
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute top-1/2 left-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-border"
			/>

			<p className="relative bg-card px-3 font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
				Screenshot pending
			</p>
			<p className="relative font-heading text-base text-muted-foreground/70">
				{project.category}
			</p>
		</div>
	);
}

export function ProjectStrip({ className }: { className?: string }) {
	const reduceMotion = usePrefersReducedMotion();
	const viewportRef = useRef<HTMLDivElement>(null);
	const railRef = useRef<HTMLSpanElement>(null);
	const [edges, setEdges] = useState({ start: true, end: false });
	const [entered, setEntered] = useState<number[]>([]);

	const readScroll = useCallback(() => {
		const viewport = viewportRef.current;
		const rail = railRef.current;
		if (!viewport) return;

		const travel = viewport.scrollWidth - viewport.clientWidth;
		const ratio = travel > 0 ? viewport.scrollLeft / travel : 0;

		if (rail) {
			rail.style.setProperty('--progress', String(ratio));
			rail.style.setProperty(
				'--visible',
				String(
					viewport.scrollWidth > 0
						? viewport.clientWidth / viewport.scrollWidth
						: 1
				)
			);
		}

		// Only re-render when an arrow actually needs to change state.
		setEdges((current) => {
			const next = {
				start: viewport.scrollLeft <= 2,
				end: viewport.scrollLeft >= travel - 2
			};

			return current.start === next.start && current.end === next.end
				? current
				: next;
		});
	}, []);

	const step = useCallback((direction: 1 | -1) => {
		const viewport = viewportRef.current;
		if (!viewport) return;

		// Measured from the cards themselves, so the gap can change with the
		// breakpoint without this needing to know about it.
		const cards = viewport.querySelectorAll<HTMLElement>('[data-card]');
		const distance =
			cards.length > 1 && cards[0] && cards[1]
				? cards[1].offsetLeft - cards[0].offsetLeft
				: viewport.clientWidth * 0.8;

		viewport.scrollBy({ left: distance * direction, behavior: 'smooth' });
	}, []);

	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;

		readScroll();
		window.addEventListener('resize', readScroll);

		// Cards rise into place as they cross into the strip, the way the
		// reference lifts them on entry.
		const observer = new IntersectionObserver(
			(entries) => {
				const arrivals = entries
					.filter((entry) => entry.isIntersecting)
					.map((entry) =>
						Number(
							(entry.target as HTMLElement).dataset.index ?? '0'
						)
					);

				if (!arrivals.length) return;

				setEntered((current) =>
					Array.from(new Set([...current, ...arrivals]))
				);
			},
			{ root: viewport, threshold: 0.25 }
		);

		viewport
			.querySelectorAll('[data-card]')
			.forEach((card) => observer.observe(card));

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', readScroll);
		};
	}, [readScroll]);

	// --- drag to pan, for anyone without a horizontal wheel ------------------
	const dragRef = useRef({
		active: false,
		panning: false,
		startX: 0,
		startLeft: 0,
		moved: 0
	});

	const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		const viewport = viewportRef.current;
		if (event.pointerType !== 'mouse' || !viewport) return;

		// Nothing is captured yet: capturing here would retarget the click away
		// from the card's link and break plain clicks entirely.
		dragRef.current = {
			active: true,
			panning: false,
			startX: event.clientX,
			startLeft: viewport.scrollLeft,
			moved: 0
		};
	};

	const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		const drag = dragRef.current;
		const viewport = viewportRef.current;
		if (!drag.active || !viewport) return;

		const travelled = event.clientX - drag.startX;
		drag.moved = Math.max(drag.moved, Math.abs(travelled));

		if (!drag.panning) {
			if (drag.moved <= DRAG_THRESHOLD) return;

			drag.panning = true;
			viewport.setPointerCapture(event.pointerId);
			// Mandatory snapping re-snaps after every scrollLeft write, which
			// fights the pan frame by frame. It comes back on release so the
			// strip still settles on a card.
			viewport.style.scrollSnapType = 'none';
		}

		viewport.scrollLeft = drag.startLeft - travelled;
	};

	const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
		const drag = dragRef.current;
		const viewport = viewportRef.current;
		if (!drag.active || !viewport) return;

		drag.active = false;

		if (!drag.panning) return;

		drag.panning = false;
		viewport.style.scrollSnapType = '';

		if (viewport.hasPointerCapture(event.pointerId)) {
			viewport.releasePointerCapture(event.pointerId);
		}
	};

	/**
	 * Horizontal gestures are claimed here rather than via `data-lenis-prevent`:
	 * that attribute makes Lenis ignore the element, so vertical scrolling over
	 * the strip turns native and instant while the rest of the page eases, and
	 * Lenis reasserts its own position every frame. The two fight, and it reads
	 * as flicker.
	 */
	const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
		const viewport = viewportRef.current;
		if (!viewport) return;

		// Vertical and diagonal intent stays with the page.
		if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

		viewport.scrollLeft += event.deltaX;
	};

	// A drag that ended over a card shouldn't also open it.
	const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
		if (dragRef.current.moved > DRAG_THRESHOLD) {
			event.preventDefault();
			event.stopPropagation();
		}

		dragRef.current.moved = 0;
	};

	return (
		<div
			className={cn(
				// `--strip-pad` tracks the header container's own `px-*`, so
				// `--gutter` below lands on the title's text edge rather than
				// on the edge of the box holding it.
				'relative [--strip-pad:1rem] sm:[--strip-pad:1.5rem] lg:[--strip-pad:2rem]',
				className
			)}
			style={
				{
					'--card-w': 'min(85vw, 620px)',
					'--shot-h': 'calc(min(85vw, 620px) / 1.6)',
					// Lines the first card up with the header, then lets the
					// rest of the strip run to the viewport edges as it scrolls.
					'--gutter':
						'calc(max(0px, (100% - 72rem) / 2) + var(--strip-pad))'
				} as React.CSSProperties
			}
		>
			<div className="mx-auto flex max-w-7xl items-center justify-end border-b border-border px-4 pb-4 sm:px-6 lg:px-8">
				<span
					aria-hidden
					className="relative h-0.5 w-32 overflow-hidden rounded-full bg-border sm:w-40"
				>
					<span
						ref={railRef}
						className="absolute inset-y-0 rounded-full bg-primary"
						style={{
							width: 'calc(var(--visible, 1) * 100%)',
							left: 'calc(var(--progress, 0) * (100% - var(--visible, 1) * 100%))'
						}}
					/>
				</span>
			</div>

			<div className="relative mt-10">
				<div
					ref={viewportRef}
					onScroll={readScroll}
					onWheel={onWheel}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={endDrag}
					onPointerLeave={endDrag}
					onClickCapture={onClickCapture}
					// `overflow-x: auto` turns `overflow-y` into auto as well, and the
					// cards' 36px entrance transform overflowed it — which made the
					// strip a vertical scroll container that stole the wheel.
					className="scrollbar-none snap-x snap-mandatory scroll-px-(--gutter) overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
					style={{
						maskImage:
							'linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)',
						WebkitMaskImage:
							'linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)'
					}}
				>
					{/* Bottom padding gives the entrance transform somewhere to go, so
					    hiding vertical overflow clips nothing. */}
					<div className="flex w-max gap-8 pb-9 pl-(--gutter) sm:gap-12 lg:gap-16">
						{projectCards.map((project, index) => (
							<article
								key={project.name}
								data-card
								data-index={index}
								className={cn(
									'w-(--card-w) shrink-0 snap-start transition-[opacity,transform] duration-700 ease-power-on',
									reduceMotion || entered.includes(index)
										? 'translate-y-0 opacity-100'
										: 'translate-y-9 opacity-0'
								)}
							>
								<Link
									href="/portfolio"
									// Native link dragging would cancel the
									// pointer stream mid-pan.
									draggable={false}
									className="group block"
								>
									<div className="relative aspect-620/388 overflow-hidden rounded-lg border border-border bg-card">
										{project.image ? (
											<Image
												src={project.image}
												alt={`${project.name} — ${project.category}`}
												fill
												sizes="(max-width: 640px) 85vw, 620px"
												className="object-cover transition-transform duration-700 ease-power-on group-hover:scale-[1.03]"
											/>
										) : (
											<PendingShot project={project} />
										)}
									</div>

									<div className="mt-5 flex items-start gap-4">
										<span className="mt-1.5 font-mono text-xs text-muted-foreground">
											{String(index + 1).padStart(2, '0')}
										</span>
										<div>
											<h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
												{project.name}
											</h3>
											<p className="mt-2 max-w-md font-serif text-base text-muted-foreground italic sm:text-lg">
												{project.summary}
											</p>
											<div className="mt-4 flex flex-wrap items-center gap-2">
												<span className="rounded-full bg-primary/15 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.15em] text-primary uppercase">
													{project.category}
												</span>
												<span className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground uppercase">
													{project.sector}
												</span>
												<span className="font-mono text-[0.6rem] text-muted-foreground">
													{project.year}
												</span>
											</div>
										</div>
									</div>
								</Link>
							</article>
						))}
					</div>
				</div>

				{[
					{
						direction: -1 as const,
						side: 'left',
						disabled: edges.start
					},
					{
						direction: 1 as const,
						side: 'right',
						disabled: edges.end
					}
				].map((control) => (
					<button
						key={control.side}
						type="button"
						onClick={() => step(control.direction)}
						disabled={control.disabled}
						aria-label={
							control.direction === 1
								? 'Next projects'
								: 'Previous projects'
						}
						className={cn(
							'absolute grid size-11 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md transition-[opacity,color,border-color] hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-0',
							control.side === 'left' ? 'left-4' : 'right-4'
						)}
						style={{ top: 'calc(var(--shot-h) / 2)' }}
					>
						{control.direction === 1 ? (
							<ArrowRight className="size-4" />
						) : (
							<ArrowLeft className="size-4" />
						)}
					</button>
				))}
			</div>
		</div>
	);
}
