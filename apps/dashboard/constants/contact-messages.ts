import {
	ContactFolder,
	ContactMessageStatus,
	ContactScope,
	ContactStart
} from '@workspace/api-services';

export const messagesPath = '/messages';
export const messagePath = (uuid: string) => `${messagesPath}/${uuid}`;

/** Fired after a change that moves the unread count — the sidebar refetches. */
export const contactMessagesChangedEvent = 'contact-messages-changed';

/** The inbox tabs, in order. */
export const contactFolderOrder: ContactFolder[] = [
	ContactFolder.INBOX,
	ContactFolder.UNREAD,
	ContactFolder.ARCHIVED,
	ContactFolder.SPAM,
	ContactFolder.ALL
];

export const contactFolderLabels: Record<ContactFolder, string> = {
	[ContactFolder.INBOX]: 'Inbox',
	[ContactFolder.UNREAD]: 'Unread',
	[ContactFolder.ARCHIVED]: 'Archived',
	[ContactFolder.SPAM]: 'Spam',
	[ContactFolder.ALL]: 'All'
};

export const contactStatusLabels: Record<ContactMessageStatus, string> = {
	[ContactMessageStatus.NEW]: 'New',
	[ContactMessageStatus.READ]: 'Read',
	[ContactMessageStatus.REPLIED]: 'Replied',
	[ContactMessageStatus.ARCHIVED]: 'Archived',
	[ContactMessageStatus.SPAM]: 'Spam'
};

/** Same wording as the website's form (labelled variations). */
export const contactScopeLabels: Record<ContactScope, string> = {
	[ContactScope.NEW_BUILD]: 'Building something new',
	[ContactScope.REBUILD]: 'Replacing a system',
	[ContactScope.SCALE]: 'Scaling what works',
	[ContactScope.FIX]: 'Fixing what is broken',
	[ContactScope.UNDECIDED]: 'Still working it out'
};

export const contactStartLabels: Record<ContactStart, string> = {
	[ContactStart.IMMEDIATELY]: 'As soon as possible',
	[ContactStart.THIS_QUARTER]: 'This quarter',
	[ContactStart.NEXT_QUARTER]: 'Next quarter',
	[ContactStart.EXPLORING]: 'No date yet'
};

/** The API's limit on the team note. */
export const INTERNAL_NOTE_MAX = 2000;

export const contactMessagesMessages = {
	title: 'Messages',
	lead: 'Enquiries from the website’s contact form. Opening one marks it read; reply by email, then mark it replied.',
	searchPlaceholder: 'Search name, email, company or message',
	search: 'Search',
	clearSearch: 'Clear',
	empty: {
		[ContactFolder.INBOX]: 'Nothing waiting. New messages land here.',
		[ContactFolder.UNREAD]: 'All caught up — nothing unread.',
		[ContactFolder.ARCHIVED]: 'No archived messages.',
		[ContactFolder.SPAM]: 'No spam.',
		[ContactFolder.ALL]: 'No messages yet.'
	} satisfies Record<ContactFolder, string>,
	noResults: (query: string) => `No messages match “${query}”.`,
	unread: 'Unread',
	unreadCount: (count: number) => `${count} unread`,
	pageOf: (page: number, pages: number) => `Page ${page} of ${pages}`,
	previous: 'Previous',
	next: 'Next',
	columns: {
		from: 'From',
		project: 'Project',
		message: 'Message',
		received: 'Received',
		status: 'Status'
	}
} as const;

export const contactMessageMessages = {
	backToList: 'All messages',
	readOnly: 'You can read messages but not change them.',
	reply: 'Reply by email',
	replySubject: 'Re: your enquiry to Flizz',
	fields: {
		email: 'Email',
		company: 'Company',
		project: 'Project',
		start: 'Start',
		received: 'Received',
		source: 'Sent from',
		readBy: 'First opened'
	},
	noCompany: '—',
	readBy: (name: string, when: string) => `${name} · ${when}`,
	message: 'Message',
	actions: {
		title: 'Status',
		markReplied: 'Mark as replied',
		archive: 'Archive',
		markSpam: 'Mark as spam',
		moveToInbox: 'Move to inbox',
		markUnread: 'Mark as unread',
		changed: (status: string) => `Marked ${status.toLowerCase()}.`
	},
	note: {
		title: 'Team note',
		lead: 'Only the team sees this — never the sender.',
		label: 'Note',
		placeholder: 'e.g. Called back on Tuesday, proposal due Friday.',
		save: 'Save note',
		saving: 'Saving…',
		saved: 'Note saved.'
	},
	delete: {
		button: 'Delete',
		title: (name: string) => `Delete the message from ${name}?`,
		body: 'It leaves the inbox for everyone. Use Archive to keep it out of the way instead.',
		confirm: 'Delete',
		deleted: 'Message deleted.'
	}
} as const;
