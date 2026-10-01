import gsap from 'gsap';
import type { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { sectionQueryParam } from '@/constants/scroll';

interface GlideProfile {
	minSeconds: number;
	maxSeconds: number;
	pxPerSecond: number;
	ease: string;
}

// A cinematic jump takes longer the further it travels, inside these bounds,
// so a short hop doesn't crawl and a long one doesn't rush. Slow away, slow
// in — a camera move rather than a jump.
const CINEMATIC: GlideProfile = {
	minSeconds: 1.4,
	maxSeconds: 3,
	pxPerSecond: 1100,
	ease: 'power3.inOut'
};
// A step — an arrow click on a rail — moves like a deliberate scroll: eased
// in and out rather than ScrollSmoother's instant-start catch-up, which reads
// as a jump when the whole distance is handed over at once.
const GLIDE: GlideProfile = {
	minSeconds: 1.2,
	maxSeconds: 2,
	pxPerSecond: 1000,
	ease: 'power2.inOut'
};
/** Controls that drive a glide themselves, so pressing one never stops it. */
const GLIDE_CONTROL_SELECTOR = '[data-glide-control]';
/** Any of these from the reader hands the scroll straight back to them. */
const INTERRUPT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

interface ScrollOptions {
	/**
	 * A long, eased move over up to a few seconds instead of the page's
	 * regular one-second catch-up — for a deliberate "take me there" cue.
	 */
	cinematic?: boolean;
	/** A shorter eased move, for stepping through something (rail arrows). */
	glide?: boolean;
	/** No easing at all — for landing on a page section, not travelling to it. */
	instant?: boolean;
}

let glideTween: gsap.core.Tween | null = null;
let glideTarget = 0;

function glideScroll(top: number, profile: GlideProfile) {
	glideTween?.kill();

	// From the native position — the one this tween drives.
	const from = window.scrollY;
	const position = { y: from };
	const duration = Math.min(
		Math.max(
			Math.abs(top - from) / profile.pxPerSecond,
			profile.minSeconds
		),
		profile.maxSeconds
	);

	const interrupt = (event: Event) => {
		// A glide control (a rail arrow) steps the glide on rather than
		// cancelling it, so repeated clicks stack from its destination.
		if (
			event.target instanceof Element &&
			event.target.closest(GLIDE_CONTROL_SELECTOR)
		) {
			return;
		}

		glideTween?.kill();
	};
	const release = () => {
		glideTween = null;
		INTERRUPT_EVENTS.forEach((type) =>
			window.removeEventListener(type, interrupt)
		);
	};

	INTERRUPT_EVENTS.forEach((type) =>
		window.addEventListener(type, interrupt, { passive: true })
	);

	// The native position is what's tweened; ScrollSmoother still eases the
	// content after it, which softens the landing further. Not through
	// `smoother.scrollTop()`: set every frame from inside a GSAP tween, that
	// leaves ScrollSmoother ignoring every later programmatic scroll — the
	// browser's back/forward restore included — so pins and scrubs froze
	// until the reader scrolled by hand.
	glideTarget = top;
	glideTween = gsap.to(position, {
		y: top,
		duration,
		ease: profile.ease,
		onUpdate: () => window.scrollTo(0, position.y),
		onComplete: release,
		onInterrupt: release
	});
}

/**
 * Where the page is heading: a glide's destination while one is in flight,
 * otherwise the current position. Step from this, so quick repeated clicks
 * add up instead of each restarting from mid-glide.
 */
export function pendingScrollTop(smoother: ScrollSmoother | null) {
	if (glideTween) return glideTarget;

	return smoother ? smoother.scrollTop() : window.scrollY;
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
	{ cinematic = false, glide = false, instant = false }: ScrollOptions = {}
) {
	if (instant) {
		if (smoother) smoother.scrollTop(top);
		else window.scrollTo({ top });
		return;
	}

	if ((cinematic || glide) && !prefersReducedMotion()) {
		glideScroll(top, cinematic ? CINEMATIC : GLIDE);
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

let refreshFrame = 0;
let refreshStale = false;
let refreshWatched = false;

/**
 * Asks for one full ScrollTrigger re-measure on the next frame, instead of a
 * synchronous `ScrollTrigger.refresh()`. A refresh reverts and re-measures
 * every trigger on the page — a full-document style and layout pass per
 * trigger — so a few components each refreshing as they mount stacked into
 * seconds of blocked main thread on load. Calls in the same frame share one
 * refresh, and it's skipped altogether if GSAP ran its own (pins queue one)
 * after the request.
 */
export function queueScrollRefresh() {
	if (!refreshWatched) {
		refreshWatched = true;
		ScrollTrigger.addEventListener('refresh', () => {
			refreshStale = false;
		});
	}

	refreshStale = true;
	if (refreshFrame) return;

	refreshFrame = requestAnimationFrame(() => {
		refreshFrame = 0;
		if (refreshStale) ScrollTrigger.refresh();
	});
}

/** Any of these means the reader has taken over the scroll themselves. */
const READER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
/** How long after a navigation the page keeps settling as it sets up. */
const NAVIGATION_SETTLE_MS = 2000;

/**
 * Settles the page after a navigation, once its triggers are measured:
 *
 * - With `?section=<id>` (see `sectionHref` in `utils/navigation.ts`) or a `#hash` on a full load,
 *   lands on that element, honouring its `scroll-mt-*`. ScrollSmoother moves
 *   the content with a transform, so the browser's own jump to an anchor
 *   can't be trusted — and the page shell resets to the top on every
 *   navigation — so it's done here.
 * - Otherwise, re-syncs ScrollSmoother to the native scroll. A back/forward
 *   restore moves the native position while the new page is still setting up,
 *   and the re-measure that follows cuts the smoother's ease short — left
 *   there, it sat mid-way with every pin and scrub stale until the reader
 *   scrolled by hand.
 *
 * Pins and reveals keep shifting things as they set up, so it re-settles
 * after each ScrollTrigger refresh (a frame later, never inside one) and once
 * more at the end, until the reader scrolls for themselves. Returns a cleanup.
 */
export function settleNavigation(smoother: ScrollSmoother | null) {
	const id =
		new URLSearchParams(window.location.search).get(sectionQueryParam) ??
		decodeURIComponent(window.location.hash.slice(1));
	const target = id ? document.getElementById(id) : null;
	const frames = new Set<number>();

	const settle = () => {
		if (target) {
			scrollToElement(smoother, target, { instant: true });
			return;
		}

		if (smoother && Math.abs(smoother.scrollTop() - window.scrollY) > 1) {
			smoother.scrollTop(window.scrollY);
		}
	};
	const settleSoon = () => {
		const frame = requestAnimationFrame(() => {
			frames.delete(frame);
			settle();
		});
		frames.add(frame);
	};

	const release = () => {
		frames.forEach((frame) => cancelAnimationFrame(frame));
		frames.clear();
		window.clearTimeout(timeout);
		ScrollTrigger.removeEventListener('refresh', settleSoon);
		READER_SCROLL_EVENTS.forEach((type) =>
			window.removeEventListener(type, release)
		);
	};
	const timeout = window.setTimeout(() => {
		settle();
		release();
	}, NAVIGATION_SETTLE_MS);

	settleSoon();
	ScrollTrigger.addEventListener('refresh', settleSoon);
	READER_SCROLL_EVENTS.forEach((type) =>
		window.addEventListener(type, release, { passive: true })
	);

	return release;
}
