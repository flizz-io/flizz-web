'use client';

import { useEffect } from 'react';

import { GoogleAnalytics } from '@/components/snippets/analytics/google-analytics';
import { MetaPixel } from '@/components/snippets/analytics/meta-pixel';
import { WithConsent } from '@/components/snippets/consent/with-consent';
import {
	crispChatOpenedEvent,
	gaReadyEvent,
	pixelReadyEvent
} from '@/constants/analytics';
import { useConsent } from '@/contexts/consent-context';
import { AnalyticsEvent } from '@/enums/analytics';
import { ConsentChoice } from '@/enums/consent';
import {
	flushGa,
	flushPixel,
	setTrackingAllowed,
	trackCtaClick,
	trackEvent
} from '@/utils/analytics';

/**
 * GA4 and the Meta Pixel (docs/guides/analytics.md). Neither loads until the
 * visitor accepts cookies. A later change in "Cookie settings" switches both
 * on or off in place — once loaded, a script can't be unloaded. Also the one
 * listener for chat openings and for clicks on every `data-cta` element.
 */
export function Analytics() {
	const { choice } = useConsent();

	useEffect(() => {
		if (choice) setTrackingAllowed(choice === ConsentChoice.ACCEPTED);
	}, [choice]);

	useEffect(() => {
		const onChatOpened = () => trackEvent(AnalyticsEvent.CHAT_OPEN);

		window.addEventListener(gaReadyEvent, flushGa);
		window.addEventListener(pixelReadyEvent, flushPixel);
		window.addEventListener(crispChatOpenedEvent, onChatOpened);
		// Capture phase: a CTA that opens a popup cancels its own click.
		document.addEventListener('click', trackCtaClick, true);

		return () => {
			window.removeEventListener(gaReadyEvent, flushGa);
			window.removeEventListener(pixelReadyEvent, flushPixel);
			window.removeEventListener(crispChatOpenedEvent, onChatOpened);
			document.removeEventListener('click', trackCtaClick, true);
		};
	}, []);

	return (
		<WithConsent>
			<GoogleAnalytics />
			<MetaPixel />
		</WithConsent>
	);
}
