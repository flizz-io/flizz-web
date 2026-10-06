'use client';

import { useEffect, useRef } from 'react';

import { articleReadDepths } from '@/constants/analytics';
import { AnalyticsEvent } from '@/enums/analytics';
import { trackEvent } from '@/utils/analytics';

/**
 * Sends `article_read` as the reader reaches each of `articleReadDepths`
 * through the article's body — once per depth per visit to the page. Its
 * markers sit inside the body, which must be `relative`; it works under
 * ScrollSmoother, as the observer follows the transformed position.
 */
export function ArticleReadDepth({ slug }: { slug: string }) {
	const markers = useRef<(HTMLSpanElement | null)[]>([]);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;

				observer.unobserve(entry.target);
				trackEvent(AnalyticsEvent.ARTICLE_READ, {
					ga: {
						article_slug: slug,
						percent_read: Number(
							(entry.target as HTMLElement).dataset.depth
						)
					}
				});
			}
		});
		markers.current.forEach((marker) => marker && observer.observe(marker));

		return () => observer.disconnect();
	}, [slug]);

	return articleReadDepths.map((depth, index) => (
		<span
			key={depth}
			ref={(marker) => {
				markers.current[index] = marker;
			}}
			aria-hidden
			data-depth={depth}
			className="pointer-events-none absolute left-0 h-px w-px"
			style={{ top: `calc(${depth}% - 1px)` }}
		/>
	));
}
