import { AnalyticsEvent } from '@/enums/analytics';

export const gaScriptUrl = 'https://www.googletagmanager.com/gtag/js';

export const metaPixelScriptUrl =
	'https://connect.facebook.net/en_US/fbevents.js';

/** Fired on `window` once `gtag` / `fbq` exist, to send what was queued. */
export const gaReadyEvent = 'flizz:ga-ready';
export const pixelReadyEvent = 'flizz:pixel-ready';

/**
 * gtag's install snippet, minus the loader (a separate `<Script src>`). Only
 * ever runs after the visitor accepts, so it needs no Consent Mode defaults.
 * The ID goes through `JSON.stringify` so it lands as a quoted literal.
 */
export const getGaScript = (measurementId: string) =>
	`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(measurementId)});window.dispatchEvent(new Event('${gaReadyEvent}'));`;

/**
 * Meta's base code: queues `fbq`, adds its loader, sends the first PageView.
 */
export const getMetaPixelScript = (pixelId: string) =>
	`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','${metaPixelScriptUrl}');fbq('init',${JSON.stringify(pixelId)});fbq('track','PageView');window.dispatchEvent(new Event('${pixelReadyEvent}'));`;

/** GA's official per-property kill switch: `window['ga-disable-<id>']`. */
export const gaDisableKey = (measurementId: string) =>
	`ga-disable-${measurementId}` as const;

/** Cookies GA and the Pixel set — cleared when the visitor rejects later. */
export const trackingCookiePrefixes = ['_ga', '_gid', '_fbp', '_fbc'];

/** What each conversion is called in each tool; `null` → not sent there. */
export const analyticsEventNames: Record<
	AnalyticsEvent,
	{ ga: string; pixel: string | null }
> = {
	[AnalyticsEvent.LEAD]: { ga: 'generate_lead', pixel: 'Lead' },
	[AnalyticsEvent.SCHEDULE]: { ga: 'schedule_call', pixel: 'Schedule' },
	[AnalyticsEvent.CHAT_OPEN]: { ga: 'chat_open', pixel: null },
	[AnalyticsEvent.CONTENT_VIEW]: { ga: 'view_item', pixel: 'ViewContent' },
	[AnalyticsEvent.CTA_CLICK]: { ga: 'cta_click', pixel: null },
	[AnalyticsEvent.ARTICLE_READ]: { ga: 'article_read', pixel: null }
};

/** Marks a CTA for click tracking: `data-cta={CtaType.X}`. */
export const ctaSelector = '[data-cta]';

/** Marks a region whose CTAs report another location (header, mobile menu). */
export const ctaLocationSelector = '[data-cta-location]';

/** Longest CTA text sent to GA. */
export const CTA_TEXT_MAX_LENGTH = 100;

/** How far through an article's body counts as read, in percent. */
export const articleReadDepths = [50, 100] as const;

/** Calendly's message once a call is booked. */
export const calendlyScheduledEvent = 'calendly.event_scheduled';

/** Fired on `window` by the Crisp snippet whenever the chat opens. */
export const crispChatOpenedEvent = 'flizz:chat-opened';
