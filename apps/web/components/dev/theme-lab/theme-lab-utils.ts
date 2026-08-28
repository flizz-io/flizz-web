/** TEMPORARY DEV TOOL — see `theme-lab-config.ts`. */

import {
	THEME_LAB_STORAGE_KEY,
	THEME_LAB_STYLE_ID,
	type ThemeOverrides
} from './theme-lab-config';

const EMPTY_OVERRIDES: ThemeOverrides = { light: {}, dark: {} };

function toCssBlock(selector: string, values: Record<string, string>) {
	const entries = Object.entries(values);
	if (entries.length === 0) return '';

	const declarations = entries
		.map(([name, value]) => `\t--${name}: ${value};`)
		.join('\n');

	return `${selector} {\n${declarations}\n}`;
}

/**
 * Light overrides are scoped to `:root:not(.dark)` and dark to `:root.dark`.
 * Both globals.css selectors (`:root` and `.dark`) have equal specificity, so a
 * plain `:root` override injected later would also win *inside* dark mode and
 * leak light values across. The extra compound raises specificity above both.
 */
export function buildOverridesCss(overrides: ThemeOverrides): string {
	return [
		toCssBlock(':root:not(.dark)', overrides.light),
		toCssBlock(':root.dark', overrides.dark)
	]
		.filter(Boolean)
		.join('\n\n');
}

export function applyThemeOverrides(overrides: ThemeOverrides) {
	if (typeof document === 'undefined') return;

	let styleElement = document.getElementById(
		THEME_LAB_STYLE_ID
	) as HTMLStyleElement | null;

	if (!styleElement) {
		styleElement = document.createElement('style');
		styleElement.id = THEME_LAB_STYLE_ID;
		document.head.appendChild(styleElement);
	}

	styleElement.textContent = buildOverridesCss(overrides);
}

export function removeThemeOverrides() {
	document.getElementById(THEME_LAB_STYLE_ID)?.remove();
}

export function loadThemeOverrides(): ThemeOverrides {
	if (typeof window === 'undefined') return EMPTY_OVERRIDES;

	try {
		const raw = window.localStorage.getItem(THEME_LAB_STORAGE_KEY);
		if (!raw) return EMPTY_OVERRIDES;

		const parsed = JSON.parse(raw) as Partial<ThemeOverrides>;

		return {
			light: parsed.light ?? {},
			dark: parsed.dark ?? {}
		};
	} catch {
		// Corrupt or unreadable storage should never break the page.
		return EMPTY_OVERRIDES;
	}
}

export function saveThemeOverrides(overrides: ThemeOverrides) {
	if (typeof window === 'undefined') return;

	try {
		window.localStorage.setItem(
			THEME_LAB_STORAGE_KEY,
			JSON.stringify(overrides)
		);
	} catch {
		// Private-mode storage failures are not worth surfacing here.
	}
}

export function clearStoredThemeOverrides() {
	if (typeof window === 'undefined') return;

	try {
		window.localStorage.removeItem(THEME_LAB_STORAGE_KEY);
	} catch {
		// Ignore — nothing to clean up if storage is unavailable.
	}
}
