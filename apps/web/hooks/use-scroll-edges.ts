'use client';

import { useEffect, useState } from 'react';

export interface ScrollEdges {
	/** Items at least half past the left edge. */
	hiddenBefore: number;
	/** Items at least half past the right edge. */
	hiddenAfter: number;
}

const initialEdges: ScrollEdges = { hiddenBefore: 0, hiddenAfter: 0 };

/**
 * How many items of a horizontally scrolling list sit out of view on each
 * side — drives the edge arrows and the directional cursor.
 *
 * Counted from item geometry rather than `scrollLeft` alone, so the answer
 * stays right when a padded track leaves a sliver of scroll with nothing
 * actually hidden behind it.
 */
export function useScrollEdges(
	viewportRef: React.RefObject<HTMLElement | null>,
	listRef: React.RefObject<HTMLElement | null>
): ScrollEdges {
	const [edges, setEdges] = useState<ScrollEdges>(initialEdges);

	useEffect(() => {
		const viewport = viewportRef.current;
		const list = listRef.current;
		if (!viewport || !list) return;

		let frame: number | null = null;

		const measure = () => {
			frame = null;

			const bounds = viewport.getBoundingClientRect();
			let hiddenBefore = 0;
			let hiddenAfter = 0;

			for (const item of Array.from(list.children)) {
				const rect = item.getBoundingClientRect();
				const centre = rect.left + rect.width / 2;

				if (centre < bounds.left) hiddenBefore += 1;
				else if (centre > bounds.right) hiddenAfter += 1;
			}

			setEdges((previous) =>
				previous.hiddenBefore === hiddenBefore &&
				previous.hiddenAfter === hiddenAfter
					? previous
					: { hiddenBefore, hiddenAfter }
			);
		};

		const schedule = () => {
			if (frame === null) frame = requestAnimationFrame(measure);
		};

		const resizeObserver = new ResizeObserver(schedule);
		resizeObserver.observe(viewport);
		resizeObserver.observe(list);
		viewport.addEventListener('scroll', schedule, { passive: true });
		schedule();

		return () => {
			if (frame !== null) cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			viewport.removeEventListener('scroll', schedule);
		};
	}, [listRef, viewportRef]);

	return edges;
}
