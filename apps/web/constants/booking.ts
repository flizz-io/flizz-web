/** Where every booking button goes when the popup can't open. */
export const bookCallFallbackHref = '/contact';

export const bookCallDialogCopy = {
	title: 'Book a discovery call',
	description: 'Thirty minutes with an engineer. Pick a time that suits you.',
	loading: 'Loading the calendar…',
	frameTitle: 'Book a call with Flizz — Calendly',
	close: 'Close'
} as const;

/** The booking card on the contact page. */
export const bookCallCardCopy = {
	eyebrow: '30 min · video call',
	title: 'Pick a time that suits you',
	description:
		'The calendar opens right here. You get a confirmation and a meeting link the moment you book.',
	action: 'Schedule a call'
} as const;

/** Calendly's messages that mean the scheduler has drawn something. */
export const calendlyReadyEvents: string[] = [
	'calendly.event_type_viewed',
	'calendly.profile_page_viewed',
	'calendly.date_and_time_selected'
];

export const CALENDLY_ORIGIN = 'https://calendly.com';

/** Reveal the frame anyway if Calendly never says it's ready, in ms. */
export const CALENDLY_READY_FALLBACK_MS = 2500;
