'use client';

import {
	useEffect,
	useRef,
	type PointerEvent as ReactPointerEvent
} from 'react';

import type { SmoothScroller } from '@/hooks/use-smooth-scroll';

const DRAG_THRESHOLD = 6;
/** Only pointer movement this recent counts toward the release velocity. */
const VELOCITY_WINDOW_MS = 100;
/** How far a flick carries, as ms of travel at the release velocity. */
const MOMENTUM_MS = 320;
/** Pixels per line, for wheels that report in lines (Firefox, some mice). */
const LINE_HEIGHT_PX = 16;

interface DragScrollOptions {
	/**
	 * Routes drag, flick momentum and horizontal wheel/trackpad input
	 * through an eased scroller instead of writing `scrollLeft` directly,
	 * so the strip glides rather than tracking input pixel for pixel.
	 */
	scroller?: SmoothScroller;
}

interface PointerSample {
	x: number;
	time: number;
}

/**
 * Drag-to-pan for a horizontally scrolling container, for anyone without a
 * horizontal wheel.
 *
 * Two things this gets right that a naive version doesn't: pointer capture is
 * taken only once the pointer has actually travelled, because capturing on
 * pointerdown retargets the click and breaks every link inside; and scroll
 * snapping is switched off for the duration of a pan, because mandatory
 * snapping re-snaps after each `scrollLeft` write and fights the drag frame by
 * frame.
 *
 * While a pan is live the container carries `data-panning`, for styling a
 * grabbing cursor.
 */
export function useDragScroll(
	ref: React.RefObject<HTMLElement | null>,
	{ scroller }: DragScrollOptions = {}
) {
	const samples = useRef<PointerSample[]>([]);
	const dragRef = useRef({
		active: false,
		panning: false,
		startX: 0,
		startLeft: 0,
		moved: 0
	});

	const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
		const node = ref.current;
		if (event.pointerType !== 'mouse' || !node) return;

		// Grabbing a gliding strip catches it where it is.
		scroller?.stop();
		samples.current = [{ x: event.clientX, time: event.timeStamp }];

		dragRef.current = {
			active: true,
			panning: false,
			startX: event.clientX,
			startLeft: node.scrollLeft,
			moved: 0
		};
	};

	const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
		const drag = dragRef.current;
		const node = ref.current;
		if (!drag.active || !node) return;

		const travelled = event.clientX - drag.startX;
		drag.moved = Math.max(drag.moved, Math.abs(travelled));

		if (!drag.panning) {
			if (drag.moved <= DRAG_THRESHOLD) return;

			drag.panning = true;
			node.setPointerCapture(event.pointerId);
			node.style.scrollSnapType = 'none';
			node.dataset.panning = 'true';
		}

		samples.current.push({ x: event.clientX, time: event.timeStamp });
		samples.current = samples.current.filter(
			(sample) => event.timeStamp - sample.time <= VELOCITY_WINDOW_MS
		);

		if (scroller) scroller.scrollTo(drag.startLeft - travelled);
		else node.scrollLeft = drag.startLeft - travelled;
	};

	/** Pointer speed over the last few moves, in px per ms. */
	const releaseVelocity = (releaseTime: number) => {
		const recent = samples.current.filter(
			(sample) => releaseTime - sample.time <= VELOCITY_WINDOW_MS
		);
		const first = recent[0];
		const last = recent[recent.length - 1];
		if (!first || !last || last.time === first.time) return 0;

		return (last.x - first.x) / (last.time - first.time);
	};

	const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
		const drag = dragRef.current;
		const node = ref.current;
		if (!drag.active || !node) return;

		drag.active = false;

		if (!drag.panning) return;

		drag.panning = false;
		node.style.scrollSnapType = '';
		delete node.dataset.panning;

		// Carry the flick on past the release so a drag ends in a glide
		// rather than a dead stop.
		scroller?.scrollBy(-releaseVelocity(event.timeStamp) * MOMENTUM_MS);

		if (node.hasPointerCapture(event.pointerId)) {
			node.releasePointerCapture(event.pointerId);
		}
	};

	useEffect(() => {
		const node = ref.current;
		if (!node || !scroller) return;

		// Native and non-passive, because the default has to be cancelled:
		// left alone, the browser would scroll the strip instantly underneath
		// the glide. Only clearly horizontal intent is claimed — a trackpad
		// swipe, a tilt wheel, or shift+wheel — so vertical and diagonal
		// scrolling always stays with the page.
		const onWheel = (event: WheelEvent) => {
			if (node.scrollWidth <= node.clientWidth) return;

			const horizontal =
				event.shiftKey && event.deltaX === 0
					? event.deltaY
					: Math.abs(event.deltaX) > Math.abs(event.deltaY)
						? event.deltaX
						: 0;
			if (horizontal === 0) return;

			event.preventDefault();
			scroller.scrollBy(
				event.deltaMode === WheelEvent.DOM_DELTA_LINE
					? horizontal * LINE_HEIGHT_PX
					: horizontal
			);
		};

		node.addEventListener('wheel', onWheel, { passive: false });

		return () => node.removeEventListener('wheel', onWheel);
	}, [ref, scroller]);

	/** A drag that ended over a link shouldn't also open it. */
	const onClickCapture = (
		event: ReactPointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>
	) => {
		if (dragRef.current.moved > DRAG_THRESHOLD) {
			event.preventDefault();
			event.stopPropagation();
		}

		dragRef.current.moved = 0;
	};

	return {
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerLeave: onPointerUp,
		onClickCapture
	};
}
