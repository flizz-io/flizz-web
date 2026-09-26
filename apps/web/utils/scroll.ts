import type { ScrollSmoother } from 'gsap/ScrollSmoother';

/**
 * Glides to an absolute scroll position — through ScrollSmoother where it is
 * mounted so the motion matches the rest of the page.
 */
export function scrollToPosition(smoother: ScrollSmoother | null, top: number) {
	if (smoother) {
		smoother.scrollTo(top, true);
		return;
	}

	window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Glides an element to the top of the viewport. ScrollSmoother doesn't read
 * `scroll-margin-top`, so the target's own `scroll-mt-*` is applied here —
 * header clearance stays declared on the target, same as native scrolling.
 */
export function scrollToElement(
	smoother: ScrollSmoother | null,
	target: HTMLElement
) {
	if (!smoother) {
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		return;
	}

	const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
	smoother.scrollTo(smoother.offset(target, 'top top') - margin, true);
}
