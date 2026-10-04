/** Mirrors the API's `ContactScope` — the shape of work an enquiry is about. */
export enum ContactScope {
	NEW_BUILD = 'NEW_BUILD',
	REBUILD = 'REBUILD',
	SCALE = 'SCALE',
	FIX = 'FIX',
	UNDECIDED = 'UNDECIDED'
}

/** Mirrors the API's `ContactStart` — when the enquirer wants to begin. */
export enum ContactStart {
	IMMEDIATELY = 'IMMEDIATELY',
	THIS_QUARTER = 'THIS_QUARTER',
	NEXT_QUARTER = 'NEXT_QUARTER',
	EXPLORING = 'EXPLORING'
}

/** Mirrors the API's `ContactMessageStatus` — where a message sits. */
export enum ContactMessageStatus {
	NEW = 'NEW',
	READ = 'READ',
	REPLIED = 'REPLIED',
	ARCHIVED = 'ARCHIVED',
	SPAM = 'SPAM'
}

/** The inbox tabs — `?folder=` on `GET /api/contact-messages`. */
export enum ContactFolder {
	/** New, Read and Replied. */
	INBOX = 'INBOX',
	UNREAD = 'UNREAD',
	ARCHIVED = 'ARCHIVED',
	SPAM = 'SPAM',
	ALL = 'ALL'
}
