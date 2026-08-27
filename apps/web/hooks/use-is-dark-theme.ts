'use client';

import { useSyncExternalStore } from 'react';

const DARK_CLASS = 'dark';

function subscribe(onStoreChange: () => void) {
	const observer = new MutationObserver(onStoreChange);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class']
	});

	return () => observer.disconnect();
}

function getSnapshot() {
	return document.documentElement.classList.contains(DARK_CLASS);
}

function getServerSnapshot() {
	return false;
}

/**
 * Reads the active theme straight off the `dark` class that next-themes writes
 * to `<html>`, so components can branch on it without a mount-flag round trip.
 */
export function useIsDarkTheme() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
