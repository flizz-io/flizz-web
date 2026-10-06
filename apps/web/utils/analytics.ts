import { analyticsConfig } from '@/configs/analytics';
import {
	analyticsEventNames,
	CTA_TEXT_MAX_LENGTH,
	ctaLocationSelector,
	ctaSelector,
	gaDisableKey,
	trackingCookiePrefixes
} from '@/constants/analytics';
import {
	AnalyticsEvent,
	type ContentType,
	CtaLocation
} from '@/enums/analytics';
import { ConsentChoice } from '@/enums/consent';
import { readConsent } from '@/utils/consent';

type EventParams = Record<string, unknown>;

interface TrackParams {
	ga?: EventParams;
	pixel?: EventParams;
}

/**
 * Calls made before a tool's snippet has run — on the page where the visitor
 * accepts, or on a first load, where a page's effects can beat the scripts.
 * Sent by `flushGa()` / `flushPixel()` once the snippet says it's ready.
 */
const pendingGa: unknown[][] = [];
const pendingPixel: unknown[][] = [];

function callGa(...args: unknown[]) {
	if (!analyticsConfig.gaMeasurementId) return;
	if (window.gtag) window.gtag(...args);
	else pendingGa.push(args);
}

function callPixel(...args: unknown[]) {
	if (!analyticsConfig.metaPixelId) return;
	if (window.fbq) window.fbq(...args);
	else pendingPixel.push(args);
}

export function flushGa() {
	const { gtag } = window;
	if (gtag) pendingGa.splice(0).forEach((args) => gtag(...args));
}

export function flushPixel() {
	const { fbq } = window;
	if (fbq) pendingPixel.splice(0).forEach((args) => fbq(...args));
}

/**
 * Sends one event to both tools (or just GA, where the Pixel has no
 * equivalent). A no-op without consent. Never pass personal data (name,
 * email, message).
 */
export function trackEvent(event: AnalyticsEvent, params: TrackParams = {}) {
	if (readConsent() !== ConsentChoice.ACCEPTED) return;

	const names = analyticsEventNames[event];
	callGa('event', names.ga, params.ga ?? {});
	if (names.pixel) callPixel('track', names.pixel, params.pixel ?? {});
}

/** A service, article or project detail page was viewed. */
export function trackContentView(type: ContentType, id: string, name: string) {
	trackEvent(AnalyticsEvent.CONTENT_VIEW, {
		ga: {
			items: [{ item_id: id, item_name: name, item_category: type }]
		},
		pixel: {
			content_ids: [id],
			content_name: name,
			content_category: type
		}
	});
}

/**
 * Tracks a click on any `data-cta` element — one listener for the whole
 * site, so CTAs need only the attribute.
 */
export function trackCtaClick(event: MouseEvent) {
	if (!(event.target instanceof Element)) return;

	const cta = event.target.closest<HTMLElement>(ctaSelector);
	if (!cta) return;

	const region = cta.closest<HTMLElement>(ctaLocationSelector);
	trackEvent(AnalyticsEvent.CTA_CLICK, {
		ga: {
			cta_type: cta.dataset.cta,
			cta_text: (cta.textContent ?? '')
				.trim()
				.slice(0, CTA_TEXT_MAX_LENGTH),
			cta_location: region?.dataset.ctaLocation ?? CtaLocation.PAGE
		}
	});
}

/**
 * Turns both tools on or off without a reload, for a visitor who changes
 * their mind in "Cookie settings" after the scripts have loaded.
 */
export function setTrackingAllowed(allowed: boolean) {
	const { gaMeasurementId } = analyticsConfig;
	if (gaMeasurementId) window[gaDisableKey(gaMeasurementId)] = !allowed;
	window.fbq?.('consent', allowed ? 'grant' : 'revoke');
	if (!allowed) {
		pendingGa.length = 0;
		pendingPixel.length = 0;
		clearTrackingCookies();
	}
}

/**
 * GA and the Pixel set their cookies on the widest domain they can (e.g.
 * `.flizz.io` from `www.flizz.io`), so each one is expired on every parent
 * domain as well as the host itself.
 */
function clearTrackingCookies() {
	const labels = window.location.hostname.split('.');
	const domains = labels
		.map((_, index) => labels.slice(index).join('.'))
		.filter((domain) => domain.includes('.'));
	const names = document.cookie
		.split('; ')
		.map((part) => part.split('=')[0] ?? '')
		.filter((name) =>
			trackingCookiePrefixes.some((prefix) => name.startsWith(prefix))
		);

	for (const name of names) {
		const expired = `${name}=; Max-Age=0; Path=/`;
		document.cookie = expired;
		domains.forEach((domain) => {
			document.cookie = `${expired}; Domain=${domain}`;
		});
	}
}
