'use client';

/**
 * TEMPORARY DEV TOOL — see `theme-lab-config.ts`.
 *
 * Client component because `next/dynamic` with `ssr: false` is not allowed in a
 * Server Component, and the lab reads localStorage during render.
 */

import dynamic from 'next/dynamic';

// Lazy + client-only, so the tool never lands in the initial bundle and the
// whole module is skipped when the flag is off.
const ThemeLab = dynamic(
	() => import('./theme-lab').then((mod) => mod.ThemeLab),
	{ ssr: false }
);

export function ThemeLabMount() {
	if (process.env.NEXT_PUBLIC_ENABLE_THEME_LAB !== 'true') {
		return null;
	}

	return <ThemeLab />;
}
