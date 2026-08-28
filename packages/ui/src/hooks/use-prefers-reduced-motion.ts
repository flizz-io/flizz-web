'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onStoreChange: () => void) {
	const media = window.matchMedia(QUERY);
	media.addEventListener('change', onStoreChange);

	return () => media.removeEventListener('change', onStoreChange);
}

function getSnapshot() {
	return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
	return false;
}

/**
 * SSR-safe `prefers-reduced-motion`.
 *
 * Framer's `useReducedMotion` reads the media query during the first client
 * render, so any component that changes its markup on the result hydrates
 * against different HTML than the server sent. `useSyncExternalStore` hands
 * React the server value for hydration and re-renders afterwards instead.
 */
export function usePrefersReducedMotion() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
