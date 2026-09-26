'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

import { useSmoother } from '@/contexts/smooth-scroll-context';
import { PinOffset } from '@/enums/scroll';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** `top-28`, the floating header's clearance. */
const HEADER_CLEARANCE_REM = 7;
/** Tailwind `lg`. */
const DESKTOP_QUERY = '(min-width: 1024px)';

interface PinnedProps extends React.HTMLAttributes<HTMLDivElement> {
	offset?: PinOffset;
	/** Pin on large screens only, like `lg:sticky`. */
	desktopOnly?: boolean;
}

function offsetPx(offset: PinOffset, element: HTMLElement) {
	switch (offset) {
		case PinOffset.BELOW_HEADER:
			return (
				HEADER_CLEARANCE_REM *
				parseFloat(getComputedStyle(document.documentElement).fontSize)
			);
		case PinOffset.CENTER:
			return Math.max(0, (window.innerHeight - element.offsetHeight) / 2);
		default:
			return 0;
	}
}

/**
 * `position: sticky`, rebuilt as a ScrollTrigger pin.
 *
 * Sticky can't work inside ScrollSmoother's transformed content, so this pins
 * by the same rules instead: it holds once its top reaches the offset, and
 * lets go when its parent's bottom arrives at its own bottom — so, as with
 * sticky, the parent sets the travel. No pin spacing is added, again matching
 * sticky, which never changes the parent's height.
 */
export function Pinned({
	offset = PinOffset.TOP,
	desktopOnly = false,
	children,
	...props
}: PinnedProps) {
	const ref = useRef<HTMLDivElement>(null);
	const smoother = useSmoother();

	useGSAP(
		() => {
			const element = ref.current;
			const container = element?.parentElement;
			// Wait for the smoother, so the pin is measured inside it rather
			// than against the untransformed page and then left stale.
			if (!element || !container || !smoother) return;

			const media = gsap.matchMedia();

			media.add(desktopOnly ? DESKTOP_QUERY : 'all', () => {
				ScrollTrigger.create({
					trigger: element,
					pin: true,
					pinSpacing: false,
					start: () => `top top+=${offsetPx(offset, element)}`,
					endTrigger: container,
					end: () =>
						`bottom top+=${offsetPx(offset, element) + element.offsetHeight}`,
					invalidateOnRefresh: true
				});
			});

			return () => media.revert();
		},
		{ dependencies: [smoother, offset, desktopOnly] }
	);

	return (
		<div
			ref={ref}
			{...props}
		>
			{children}
		</div>
	);
}
