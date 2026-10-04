'use client';

import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';

import { contactIntegrations } from '@/configs/contact';
import {
	CALENDLY_DEFAULT_HEIGHT,
	CALENDLY_PRELOAD_MARGIN,
	contactCalendlyTitle
} from '@/constants/contact';
import { useContactPrefill } from '@/contexts/contact-prefill-context';
import { buildCalendlyUrl } from '@/utils/calendly';
import { cn } from '@workspace/ui/lib/utils';

const CALENDLY_ORIGIN = 'https://calendly.com';

interface CalendlyHeightMessage {
	event?: string;
	payload?: { height?: string | number };
}

/**
 * Calendly's scheduler, inline. Nothing loads from Calendly until the slot
 * is near the screen; at that moment it takes the name and email typed into
 * the form above, if any. The frame follows the site's theme and grows to
 * the height Calendly reports, so its own scrollbar never appears.
 */
export function ContactCalendly({ className }: { className?: string }) {
	const slotRef = useRef<HTMLDivElement>(null);
	const { getPrefill } = useContactPrefill();
	const { resolvedTheme } = useTheme();
	const [near, setNear] = useState(false);
	const [height, setHeight] = useState(CALENDLY_DEFAULT_HEIGHT);

	// Built once the slot is near — so the prefill is whatever was typed by
	// then — and again only if the theme changes.
	const src = useMemo(
		() =>
			near && resolvedTheme
				? buildCalendlyUrl(contactIntegrations.calendlyUrl, {
						prefill: getPrefill(),
						dark: resolvedTheme === 'dark',
						pageSearch: window.location.search,
						embedDomain: window.location.host
					})
				: null,
		[near, resolvedTheme, getPrefill]
	);

	useEffect(() => {
		const slot = slotRef.current;
		if (!slot) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setNear(true);
					observer.disconnect();
				}
			},
			{ rootMargin: CALENDLY_PRELOAD_MARGIN }
		);
		observer.observe(slot);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const onMessage = (event: MessageEvent<CalendlyHeightMessage>) => {
			if (event.origin !== CALENDLY_ORIGIN) return;
			if (event.data?.event !== 'calendly.page_height') return;

			const next = Number.parseInt(
				String(event.data.payload?.height ?? ''),
				10
			);
			if (Number.isFinite(next) && next > 0) setHeight(next);
		};
		window.addEventListener('message', onMessage);

		return () => window.removeEventListener('message', onMessage);
	}, []);

	return (
		<div
			ref={slotRef}
			className={cn(
				'overflow-hidden rounded-xl border border-border bg-card/40',
				className
			)}
			style={{ minHeight: CALENDLY_DEFAULT_HEIGHT }}
		>
			{src ? (
				<iframe
					src={src}
					title={contactCalendlyTitle}
					className="block w-full"
					style={{ height }}
				/>
			) : null}
		</div>
	);
}
