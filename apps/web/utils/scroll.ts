import gsap from 'gsap';
import type { ScrollSmoother } from 'gsap/ScrollSmoother';

// A cinematic jump takes longer the further it travels, inside these bounds,
// so a short hop doesn't crawl and a long one doesn't rush.
const CINEMATIC_MIN_SECONDS = 1.4;
const CINEMATIC_MAX_SECONDS = 3;
const CINEMATIC_PX_PER_SECOND = 1100;
// Slow away, slow in — a camera move rather than a jump.
const CINEMATIC_EASE = 'power3.inOut';
/** Any of these from the reader hands the scroll straight back to them. */
const INTERRUPT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

interface ScrollOptions {
	/**
	 * A long, eased move over up to a few seconds instead of the page's
	 * regular one-second catch-up — for a deliberate "take me there" cue.
	 */
	cinematic?: boolean;
}

let cinematicTween: gsap.core.Tween | null = null;

function cinematicScroll(smoother: ScrollSmoother | null, top: number) {
	cinematicTween?.kill();

	const from = smoother ? smoother.scrollTop() : window.scrollY;
	const position = { y: from };
	const duration = Math.min(
		Math.max(
			Math.abs(top - from) / CINEMATIC_PX_PER_SECOND,
			CINEMATIC_MIN_SECONDS
		),
		CINEMATIC_MAX_SECONDS
	);

	const interrupt = () => cinematicTween?.kill();
	const release = () =>
		INTERRUPT_EVENTS.forEach((type) =>
			window.removeEventListener(type, interrupt)
		);

	INTERRUPT_EVENTS.forEach((type) =>
		window.addEventListener(type, interrupt, { passive: true })
	);

	// The native position is what's tweened; ScrollSmoother still eases the
	// content after it, which softens the landing further.
	cinematicTween = gsap.to(position, {
		y: top,
		duration,
		ease: CINEMATIC_EASE,
		onUpdate: () => {
			if (smoother) smoother.scrollTop(position.y);
			else window.scrollTo(0, position.y);
		},
		onComplete: release,
		onInterrupt: release
	});
}

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Glides to an absolute scroll position — through ScrollSmoother where it is
 * mounted so the motion matches the rest of the page.
 */
export function scrollToPosition(
	smoother: ScrollSmoother | null,
	top: number,
	{ cinematic = false }: ScrollOptions = {}
) {
	if (cinematic && !prefersReducedMotion()) {
		cinematicScroll(smoother, top);
		return;
	}

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
	target: HTMLElement,
	options: ScrollOptions = {}
) {
	const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
	const top = smoother
		? smoother.offset(target, 'top top')
		: target.getBoundingClientRect().top + window.scrollY;

	scrollToPosition(smoother, top - margin, options);
}
