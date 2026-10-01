'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { smoothScrollEase, smoothScrollSeconds } from '@/constants/scroll';
import { SmoothScrollContext } from '@/contexts/smooth-scroll-context';
import { applyAnimationSpeed, realTimeSeconds } from '@/utils/animation';
import { queueScrollRefresh, scrollToHash } from '@/utils/scroll';
import { usePrefersReducedMotion } from '@workspace/ui/hooks/use-prefers-reduced-motion';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);
// Every landing page renders inside this shell, so its module is the one
// place guaranteed to run before any page builds a tween.
applyAnimationSpeed();

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
				smooth: reducedMotion
					? 0
					: realTimeSeconds(smoothScrollSeconds),
				ease: smoothScrollEase,
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
		// re-measure every trigger against the new content — and land on the
		// section a `#hash` asks for, which the reset would otherwise lose.
		smoother.scrollTop(0);
		queueScrollRefresh();

		return scrollToHash(smoother);
	}, [pathname, smoother]);

	return (
		<SmoothScrollContext.Provider value={smoother}>
			{fixed}
			<div ref={wrapperRef}>
				{/* Opaque on purpose. The transform makes this its own
				    compositing group, so blend modes inside it (the heroes'
				    soft-light film grain) blend against this layer rather than
				    the body — left transparent, the grain renders as raw noise
				    and lifts every blended section off the page colour. */}
				<div
					ref={contentRef}
					className="bg-background"
				>
					{children}
				</div>
			</div>
		</SmoothScrollContext.Provider>
	);
}
