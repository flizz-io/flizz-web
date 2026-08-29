'use client';

import { useEffect, useRef, useState } from 'react';

import { readThemeColor } from '../lib/css-color.js';

/**
 * A counter that increments whenever the resolved value of any watched CSS
 * colour variable changes — whether from a theme class flip or from a
 * stylesheet injected at runtime (the Theme Lab keeps its overrides in a
 * `<style>` element whose contents it rewrites in place).
 *
 * Canvas scenes sample their colours once, when they build. Including this in
 * their effect deps is what makes them rebuild against the new palette instead
 * of holding the colours they happened to start with.
 */
export function useThemeColorVersion(variables: readonly string[]): number {
	const [version, setVersion] = useState(0);
	// Joined so the effect keys off the contents, not the array identity —
	// callers shouldn't have to memoise the list they pass in.
	const key = variables.join('|');
	const lastRef = useRef<string | null>(null);

	useEffect(() => {
		const names = key.split('|');
		const read = () =>
			names.map((name) => readThemeColor(name, '')).join('|');

		lastRef.current = read();

		const check = () => {
			const next = read();
			if (next === lastRef.current) return;

			lastRef.current = next;
			setVersion((current) => current + 1);
		};

		const observer = new MutationObserver(check);

		// The theme class lands on <html>; runtime overrides land in <head>.
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'style']
		});
		observer.observe(document.head, {
			childList: true,
			subtree: true,
			characterData: true
		});

		return () => observer.disconnect();
	}, [key]);

	return version;
}
