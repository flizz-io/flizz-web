'use client';

import { useRef, type PointerEvent as ReactPointerEvent } from 'react';

const DRAG_THRESHOLD = 6;

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
 */
export function useDragScroll(ref: React.RefObject<HTMLElement | null>) {
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
		}

		node.scrollLeft = drag.startLeft - travelled;
	};

	const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
		const drag = dragRef.current;
		const node = ref.current;
		if (!drag.active || !node) return;

		drag.active = false;

		if (!drag.panning) return;

		drag.panning = false;
		node.style.scrollSnapType = '';

		if (node.hasPointerCapture(event.pointerId)) {
			node.releasePointerCapture(event.pointerId);
		}
	};

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

	/**
	 * Horizontal wheel and trackpad gestures, handled here rather than left to
	 * the browser.
	 *
	 * The obvious approach — `data-lenis-prevent` — makes Lenis ignore the
	 * element entirely, so vertical scrolling over it becomes native and
	 * instant while the rest of the page eases, and Lenis keeps reasserting its
	 * own position every frame. The two fight, which reads as flicker. Letting
	 * Lenis keep the vertical axis everywhere and claiming only clearly
	 * horizontal gestures here keeps one smooth scroll for the whole page.
	 */
	const onWheel = (event: React.WheelEvent<HTMLElement>) => {
		const node = ref.current;
		if (!node) return;

		// Vertical intent belongs to the page; anything diagonal stays there
		// too, so a slightly-off vertical swipe never hijacks the strip.
		if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

		node.scrollLeft += event.deltaX;
	};

	return {
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerLeave: onPointerUp,
		onClickCapture,
		onWheel
	};
}
