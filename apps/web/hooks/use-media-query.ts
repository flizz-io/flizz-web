'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * SSR-safe media query, in the same shape as `usePrefersReducedMotion`.
 *
 * Returns `false` on the server and for the hydration pass, then the real
 * value — so a component that changes its markup on the result never hydrates
 * against different HTML than the server sent.
 */
export function useMediaQuery(query: string): boolean {
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			const media = window.matchMedia(query);
			media.addEventListener('change', onStoreChange);

			return () => media.removeEventListener('change', onStoreChange);
		},
		[query]
	);

	const getSnapshot = useCallback(
		() => window.matchMedia(query).matches,
		[query]
	);

	return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
