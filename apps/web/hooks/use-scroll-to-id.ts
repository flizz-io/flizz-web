'use client';

import { useCallback } from 'react';

import { useSmoother } from '@/contexts/smooth-scroll-context';
import { scrollToElement } from '@/utils/scroll';

/**
 * Scrolls to an element by id, through ScrollSmoother where it is mounted so the motion
 * matches the rest of the page. Header clearance comes from the target's own
 * `scroll-mt-*`.
 */
export function useScrollToId() {
	const smoother = useSmoother();

	return useCallback(
		(id: string) => {
			const target = document.getElementById(id);
			if (!target) return;

			scrollToElement(smoother, target);
		},
		[smoother]
	);
}
