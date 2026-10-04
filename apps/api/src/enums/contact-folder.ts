/** The dashboard inbox's tabs — each a set of statuses. */
export enum ContactFolder {
	/** Still being worked on: New, Read and Replied. */
	INBOX = 'INBOX',
	/** New only — nobody has opened them. */
	UNREAD = 'UNREAD',
	ARCHIVED = 'ARCHIVED',
	SPAM = 'SPAM',
	ALL = 'ALL'
}
