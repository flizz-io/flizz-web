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

	return {
		onPointerDown,
		onPointerMove,
		onPointerUp,
		onPointerLeave: onPointerUp,
		onClickCapture
	};
}
