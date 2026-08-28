'use client';

import { useMotionValue } from 'framer-motion';
import { useEffect, type RefObject } from 'react';

/**
 * How far a tall element has been scrolled through, as 0 → 1.
 *
 * Measured from the element's own rect on every frame rather than from
 * Framer's `useScroll`: Lenis owns the scroll position here, and the values
 * `useScroll` reports under it stay pinned at 0. The loop only runs while the
 * element is on screen.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
	const progress = useMotionValue(0);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		let frame = 0;

		const measure = () => {
			const rect = node.getBoundingClientRect();
			// The travel available while the sticky child stays pinned.
			const travel = rect.height - window.innerHeight;
			const value = travel > 0 ? -rect.top / travel : 0;

			progress.set(Math.min(1, Math.max(0, value)));
			frame = requestAnimationFrame(measure);
		};

		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				if (!frame) frame = requestAnimationFrame(measure);
				return;
			}

			if (frame) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		});

		observer.observe(node);

		return () => {
			observer.disconnect();
			if (frame) cancelAnimationFrame(frame);
		};
	}, [ref, progress]);

	return progress;
}
