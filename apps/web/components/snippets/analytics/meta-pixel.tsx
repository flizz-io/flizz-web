'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

import { analyticsConfig } from '@/configs/analytics';
import { getMetaPixelScript } from '@/constants/analytics';

/** The Meta Pixel. Its base code sends the PageView for the first page. */
export function MetaPixel() {
	const { metaPixelId } = analyticsConfig;

	if (!metaPixelId) return null;

	return (
		<>
			<Script
				id="meta-pixel"
				strategy="afterInteractive"
			>
				{getMetaPixelScript(metaPixelId)}
			</Script>
			<MetaPixelPageViews />
		</>
	);
}

/**
 * The Pixel doesn't see App Router navigations, so each new path sends its
 * own PageView. The path it mounted on is skipped — the base code sent that.
 */
function MetaPixelPageViews() {
	const pathname = usePathname();
	const trackedPath = useRef(pathname);

	useEffect(() => {
		if (trackedPath.current === pathname) return;

		trackedPath.current = pathname;
		window.fbq?.('track', 'PageView');
	}, [pathname]);

	return null;
}
