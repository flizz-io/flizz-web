const DAY_SECONDS = 86_400;

/** First-party cookie holding the visitor's choice — six months. */
export const consentCookie = {
	name: 'flizz_consent',
	maxAgeSeconds: 182 * DAY_SECONDS
} as const;

export const consentCopy = {
	title: 'Cookies',
	body: 'We’d like to use analytics and advertising cookies to see which pages help and to measure our ads. They stay off unless you accept.',
	policyLabel: 'Privacy policy',
	accept: 'Accept',
	reject: 'Reject',
	settingsLink: 'Cookie settings',
	current: (accepted: boolean) =>
		accepted
			? 'You’ve accepted analytics and advertising cookies.'
			: 'You’ve rejected analytics and advertising cookies.'
} as const;
