'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { SmoothScrollContext } from '@/contexts/smooth-scroll-context';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

/** Seconds the content takes to catch up with the native scroll position. */
const SMOOTH_SECONDS = 1;

interface SmoothScrollProps {
	children: React.ReactNode;
	/**
	 * Rendered outside the smoothed content. ScrollSmoother moves the content
	 * with a transform, which turns `position: fixed` inside it into
	 * "fixed to the content" — so anything pinned to the screen lives here.
	 */
	fixed?: React.ReactNode;
}

/**
 * GSAP ScrollSmoother for the marketing pages.
 *
 * The browser keeps its native scroll position; ScrollSmoother only eases how
 * far the content has visually caught up with it. `position: sticky` can't
 * work inside the transformed content, so anything that sticks uses
 * `<Pinned>` (a ScrollTrigger pin) instead.
 */
export function SmoothScroll({ children, fixed }: SmoothScrollProps) {
	const reducedMotion = usePrefersReducedMotion();
	const pathname = usePathname();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [smoother, setSmoother] = useState<ScrollSmoother | null>(null);

	useGSAP(
		() => {
			const instance = ScrollSmoother.create({
				wrapper: wrapperRef.current,
				content: contentRef.current,
				// Reduced motion keeps the structure (pins still need it) but
				// drops the easing, so the page tracks the scroll exactly.
				smooth: reducedMotion ? 0 : SMOOTH_SECONDS,
				smoothTouch: false
			});

			setSmoother(instance);

			return () => {
				instance.kill();
				setSmoother(null);
			};
		},
		{ dependencies: [reducedMotion] }
	);

	useEffect(() => {
		if (!smoother) return;

		// The layout survives navigation, so the new page would otherwise be
		// eased up from wherever the last one was left. Jump instead, then
		// re-measure every trigger against the new content.
		smoother.scrollTop(0);
		const frame = requestAnimationFrame(() => ScrollTrigger.refresh());

		return () => cancelAnimationFrame(frame);
	}, [pathname, smoother]);

	return (
		<SmoothScrollContext.Provider value={smoother}>
			{fixed}
			<div ref={wrapperRef}>
				<div ref={contentRef}>{children}</div>
			</div>
		</SmoothScrollContext.Provider>
	);
}
