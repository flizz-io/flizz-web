'use client';

import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { servicesRailLabels } from '@/constants/home';
import { RailCursorMode } from '@/enums/scroll';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';
import { cn } from '@workspace/ui/lib/utils';

/** How long the pointer rests before the drag badge fades back out. */
const IDLE_MS = 700;
/** How long the pointer must rest on a service before "view details" shows. */
const DETAILS_REST_MS = 3000;
/** Share of the gap to the pointer closed each frame — the badge trails a touch. */
const FOLLOW_EASE = 0.3;

const subscribeNever = () => () => {};

interface RailCursorProps {
	/** The strip whose pointer movement this badge follows. */
	targetRef: React.RefObject<HTMLElement | null>;
	canScrollPrevious: boolean;
	canScrollNext: boolean;
}

/**
 * A badge that trails the (untouched) native cursor over a scrolling strip.
 *
 * While the pointer moves it shows which way the strip can be dragged, then
 * fades out once the pointer rests. Over a specimen link it says the card
 * opens its details instead, next to the native pointer hand — but only once
 * the pointer has rested on it for `DETAILS_REST_MS`. Any movement or wheel
 * scroll hides it and starts the wait again, on every hover. A real CSS
 * cursor can't do either: it can't animate in or out, and it would replace
 * the pointer hand that marks a link as clickable.
 */
export function RailCursor({
	targetRef,
	canScrollPrevious,
	canScrollNext
}: RailCursorProps) {
	const reducedMotion = usePrefersReducedMotion();
	const followerRef = useRef<HTMLDivElement>(null);
	const [mode, setMode] = useState(RailCursorMode.IDLE);
	const [held, setHeld] = useState(false);
	// Portal target only exists on the client; this flips after hydration.
	const mounted = useSyncExternalStore(
		subscribeNever,
		() => true,
		() => false
	);

	useEffect(() => {
		const target = targetRef.current;
		if (!target) return;

		const pointer = { x: 0, y: 0 };
		const position = { x: 0, y: 0 };
		let placed = false;
		let frame: number | null = null;
		let idleTimer: number | null = null;
		let restTimer: number | null = null;

		const follow = () => {
			frame = null;
			const node = followerRef.current;
			if (!node) return;

			const ease = reducedMotion ? 1 : FOLLOW_EASE;
			position.x += (pointer.x - position.x) * ease;
			position.y += (pointer.y - position.y) * ease;
			node.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;

			if (
				Math.abs(pointer.x - position.x) > 0.1 ||
				Math.abs(pointer.y - position.y) > 0.1
			) {
				frame = requestAnimationFrame(follow);
			}
		};

		const clearIdle = () => {
			if (idleTimer === null) return;

			window.clearTimeout(idleTimer);
			idleTimer = null;
		};

		const clearRest = () => {
			if (restTimer === null) return;

			window.clearTimeout(restTimer);
			restTimer = null;
		};

		// Checked when the wait ends, not when it starts: a scroll can carry a
		// different service (or none) under a pointer that never moved.
		const pointerOnLink = () => {
			const element = document.elementFromPoint(pointer.x, pointer.y);
			const link = element?.closest('a[href]');

			return !!link && target.contains(link);
		};

		const scheduleRest = () => {
			clearRest();
			restTimer = window.setTimeout(() => {
				restTimer = null;
				if (!target.dataset.panning && pointerOnLink()) {
					setMode(RailCursorMode.DETAILS);
				}
			}, DETAILS_REST_MS);
		};

		const scheduleIdle = () => {
			clearIdle();
			idleTimer = window.setTimeout(() => {
				idleTimer = null;
				if (!target.dataset.panning) setMode(RailCursorMode.IDLE);
			}, IDLE_MS);
		};

		const onMove = (event: PointerEvent) => {
			if (event.pointerType !== 'mouse') return;

			pointer.x = event.clientX;
			pointer.y = event.clientY;

			// First contact places the badge on the pointer rather than
			// sweeping it in from wherever it was last left.
			if (!placed) {
				position.x = pointer.x;
				position.y = pointer.y;
				placed = true;
			}

			if (frame === null) frame = requestAnimationFrame(follow);

			const overLink =
				!target.dataset.panning &&
				event.target instanceof Element &&
				event.target.closest('a[href]') !== null;

			if (overLink) {
				clearIdle();
				setMode(RailCursorMode.IDLE);
				scheduleRest();
				return;
			}

			clearRest();
			setMode(RailCursorMode.DRAG);
			scheduleIdle();
		};

		// The page scroll pans the rail under a still pointer, so a wheel
		// counts as movement: hide the prompt and wait for a fresh rest.
		const onWheel = () => {
			if (!placed) return;

			setMode((current) =>
				current === RailCursorMode.DETAILS
					? RailCursorMode.IDLE
					: current
			);
			if (pointerOnLink()) scheduleRest();
		};

		const onLeave = () => {
			clearIdle();
			clearRest();
			placed = false;
			setHeld(false);
			setMode(RailCursorMode.IDLE);
		};

		const onDown = (event: PointerEvent) => {
			if (event.pointerType === 'mouse') setHeld(true);
		};

		const onUp = () => {
			setHeld(false);
			scheduleIdle();
		};

		target.addEventListener('pointermove', onMove);
		target.addEventListener('pointerleave', onLeave);
		target.addEventListener('pointerdown', onDown);
		target.addEventListener('pointerup', onUp);
		target.addEventListener('wheel', onWheel, { passive: true });

		return () => {
			clearIdle();
			clearRest();
			if (frame !== null) cancelAnimationFrame(frame);
			target.removeEventListener('pointermove', onMove);
			target.removeEventListener('pointerleave', onLeave);
			target.removeEventListener('pointerdown', onDown);
			target.removeEventListener('pointerup', onUp);
			target.removeEventListener('wheel', onWheel);
		};
	}, [reducedMotion, targetRef]);

	if (!mounted) return null;

	const canScroll = canScrollPrevious || canScrollNext;
	const showDrag = mode === RailCursorMode.DRAG && canScroll;
	const showDetails = mode === RailCursorMode.DETAILS;

	// Portalled to the body: `fixed` inside the page would be pinned to any
	// transformed ancestor instead of the viewport.
	return createPortal(
		<div
			ref={followerRef}
			aria-hidden
			className="pointer-events-none fixed top-0 left-0 z-100"
		>
			{/* Offset down-right so the badge sits beside the pointer tip
			    rather than under it. */}
			<div className="relative translate-x-5 translate-y-5">
				<span
					className={cn(
						'absolute top-0 left-0 flex size-12 origin-top-left items-center justify-center rounded-full border border-primary/60 bg-background/70 text-foreground backdrop-blur-md transition-[opacity,scale,filter,background-color,color] duration-500 ease-power-on motion-reduce:transition-none',
						showDrag
							? 'scale-100 opacity-100 blur-none'
							: 'scale-50 opacity-0 blur-sm',
						held &&
							showDrag &&
							'scale-90 border-primary bg-primary text-primary-foreground'
					)}
				>
					{/* Both chevrons always, the blocked one dimmed — the
					    pair reads as "drag" at a glance, the contrast as
					    which way. */}
					<ChevronLeft
						className={cn(
							'-mr-0.5 size-4 transition-opacity duration-500',
							canScrollPrevious ? 'opacity-100' : 'opacity-25'
						)}
					/>
					<ChevronRight
						className={cn(
							'-ml-0.5 size-4 transition-opacity duration-500',
							canScrollNext ? 'opacity-100' : 'opacity-25'
						)}
					/>
				</span>

				<span
					className={cn(
						'absolute top-0 left-0 flex origin-top-left items-center gap-2 rounded-full bg-primary px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] whitespace-nowrap text-primary-foreground uppercase transition-[opacity,scale,filter] duration-500 ease-power-on motion-reduce:transition-none',
						showDetails
							? 'scale-100 opacity-100 blur-none'
							: 'scale-75 opacity-0 blur-sm'
					)}
				>
					{servicesRailLabels.viewDetails}
					<ArrowUpRight className="size-3.5" />
				</span>
			</div>
		</div>,
		document.body
	);
}
