import type { UserReference } from './team.js';
import type {
	ContactMessageStatus,
	ContactScope,
	ContactStart
} from '../generated/prisma/enums.js';

/** A row in the dashboard inbox. */
export interface ContactMessageListItemResponse {
	uuid: string;
	name: string;
	company: string | null;
	email: string;
	scope: ContactScope;
	start: ContactStart;
	/** The first line or so of the message. */
	excerpt: string;
	status: ContactMessageStatus;
	createdAt: string;
}

/** One page of the inbox. */
export interface ContactMessagePageResponse {
	items: ContactMessageListItemResponse[];
	total: number;
	page: number;
	pageSize: number;
}

/** One message with everything, as the detail view shows it. */
export interface ContactMessageResponse extends ContactMessageListItemResponse {
	message: string;
	internalNote: string | null;
	sourcePath: string | null;
	readAt: string | null;
	readBy: UserReference | null;
	updatedAt: string;
	updatedBy: UserReference | null;
}

/** Counts per tab, and the sidebar's unread badge. */
export interface ContactMessageSummaryResponse {
	unread: number;
	inbox: number;
	archived: number;
	spam: number;
	all: number;
}
