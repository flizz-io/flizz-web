/**
 * Converts any CSS colour the browser understands — hex, rgb, and the `oklch()`
 * values used in globals.css — into a plain hex string.
 *
 * Painting a single pixel to a canvas lets the browser's own parser do the
 * colour-space conversion, which keeps this working for any notation CSS gains
 * later without hand-rolling the maths.
 */
export function cssColorToHex(value: string, fallback = '#000000'): string {
	const trimmed = value.trim();

	if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
		return trimmed.toLowerCase();
	}

	if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
		const [, r, g, b] = trimmed;
		return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
	}

	if (typeof document === 'undefined' || !trimmed) {
		return fallback;
	}

	const canvas = document.createElement('canvas');
	canvas.width = 1;
	canvas.height = 1;

	const context = canvas.getContext('2d', { willReadFrequently: true });
	if (!context) return fallback;

	context.clearRect(0, 0, 1, 1);
	context.fillStyle = fallback;
	context.fillStyle = trimmed;
	context.fillRect(0, 0, 1, 1);

	const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data;

	return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

/** Reads a CSS custom property off `<html>` and returns it as hex. */
export function readThemeColor(variable: string, fallback: string): string {
	if (typeof document === 'undefined') return fallback;

	const raw = getComputedStyle(document.documentElement).getPropertyValue(
		variable
	);

	return cssColorToHex(raw, fallback);
}
