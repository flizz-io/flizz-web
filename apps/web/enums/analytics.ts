/** What's sent to GA4 and the Meta Pixel through `trackEvent()`. */
export enum AnalyticsEvent {
	LEAD = 'LEAD',
	SCHEDULE = 'SCHEDULE',
	CHAT_OPEN = 'CHAT_OPEN',
	CONTENT_VIEW = 'CONTENT_VIEW',
	CTA_CLICK = 'CTA_CLICK',
	ARTICLE_READ = 'ARTICLE_READ'
}

/** The kinds of detail page whose views are counted. Sent as-is to GA and Meta. */
export enum ContentType {
	SERVICE = 'service',
	ARTICLE = 'article',
	PROJECT = 'project'
}

/** What a CTA does — its `data-cta` value, sent as-is to GA. */
export enum CtaType {
	BOOK_CALL = 'book_call',
	START_CHAT = 'start_chat',
	CONTACT = 'contact'
}

/** Where a CTA sits — `data-cta-location` on an ancestor, else `PAGE`. */
export enum CtaLocation {
	HEADER = 'header',
	PAGE = 'page'
}
