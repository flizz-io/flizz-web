import type { UserReference } from './auth';
import type {
	ContactFolder,
	ContactMessageStatus,
	ContactScope,
	ContactStart
} from '../enums/contact';

/** The website's form — `POST /api/public/contact`. */
export interface SubmitContactPayload {
	name: string;
	/** Blank or `null` is stored as no company. */
	company?: string | null;
	email: string;
	scope: ContactScope;
	start: ContactStart;
	message: string;
	/** The page it was sent from, e.g. `/contact`. */
	sourcePath?: string | null;
	/** The honeypot — always empty from a person. */
	website?: string;
	/** Cloudflare Turnstile's token, when the widget is on. */
	turnstileToken?: string;
}

export interface SubmitContactResponse {
	received: true;
}

/** A row in the inbox — `GET /api/contact-messages`. */
export interface ContactMessageListItem {
	uuid: string;
	name: string;
	company: string | null;
	email: string;
	scope: ContactScope;
	start: ContactStart;
	/** The start of the message, on one line. */
	excerpt: string;
	status: ContactMessageStatus;
	createdAt: string;
}

export interface ContactMessagePage {
	items: ContactMessageListItem[];
	total: number;
	page: number;
	pageSize: number;
}

/** One message — `GET /api/contact-messages/:uuid` (the first open marks it read). */
export interface ContactMessageRecord extends ContactMessageListItem {
	message: string;
	internalNote: string | null;
	sourcePath: string | null;
	readAt: string | null;
	readBy: UserReference | null;
	updatedAt: string;
	updatedBy: UserReference | null;
}

/** Counts per tab — `GET /api/contact-messages/summary`. */
export interface ContactMessageSummary {
	unread: number;
	inbox: number;
	archived: number;
	spam: number;
	all: number;
}

export interface ContactMessageListQuery {
	folder?: ContactFolder;
	search?: string;
	page?: number;
}

export interface UpdateContactMessagePayload {
	status?: ContactMessageStatus;
	/** Blank or `null` clears it. */
	internalNote?: string | null;
}
