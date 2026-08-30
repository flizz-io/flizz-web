'use client';

import { useLenis } from 'lenis/react';
import { useCallback } from 'react';

/**
 * Scrolls to an element by id, through Lenis where it is mounted so the motion
 * matches the rest of the page. Header clearance comes from the target's own
 * `scroll-mt-*`.
 */
export function useScrollToId() {
	const lenis = useLenis();

	return useCallback(
		(id: string) => {
			const target = document.getElementById(id);
			if (!target) return;

			if (lenis) {
				lenis.scrollTo(target);
				return;
			}

			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		},
		[lenis]
	);
}
