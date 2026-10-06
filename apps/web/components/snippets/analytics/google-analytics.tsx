import Script from 'next/script';

import { analyticsConfig } from '@/configs/analytics';
import { gaScriptUrl, getGaScript } from '@/constants/analytics';

/**
 * GA4. Enhanced measurement (on in the GA stream settings) counts client-side
 * navigations itself — never send `page_view` by hand, or pages count twice.
 */
export function GoogleAnalytics() {
	const { gaMeasurementId } = analyticsConfig;

	if (!gaMeasurementId) return null;

	return (
		<>
			<Script
				id="ga-loader"
				src={`${gaScriptUrl}?id=${encodeURIComponent(gaMeasurementId)}`}
				strategy="afterInteractive"
			/>
			<Script
				id="ga-init"
				strategy="afterInteractive"
			>
				{getGaScript(gaMeasurementId)}
			</Script>
		</>
	);
}
