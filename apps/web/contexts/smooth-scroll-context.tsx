'use client';

import type { ScrollSmoother } from 'gsap/ScrollSmoother';
import { createContext, useContext } from 'react';

/** The page's ScrollSmoother, or `null` before it exists or outside it. */
export const SmoothScrollContext = createContext<ScrollSmoother | null>(null);

export function useSmoother() {
	return useContext(SmoothScrollContext);
}
