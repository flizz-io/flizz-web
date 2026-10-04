import {
	contactMessagesChangedEvent,
	messagesPath
} from '@/constants/contact-messages';
import { ContactFolder } from '@workspace/api-services';

export interface InboxParams {
	folder: ContactFolder;
	search: string;
	page: number;
}

const folders = new Set<string>(Object.values(ContactFolder));

/** The inbox's URL state, tolerant of anything typed into the address bar. */
export function parseInboxParams(
	params: Record<string, string | string[] | undefined>
): InboxParams {
	const first = (value: string | string[] | undefined) =>
		(Array.isArray(value) ? value[0] : value) ?? '';

	const folder = first(params.folder);
	const page = Number.parseInt(first(params.page), 10);

	return {
		folder: folders.has(folder)
			? (folder as ContactFolder)
			: ContactFolder.INBOX,
		search: first(params.search).trim(),
		page: Number.isFinite(page) && page > 0 ? page : 1
	};
}

/** A link to the inbox with these settings; defaults are left out. */
export function inboxHref({ folder, search, page }: Partial<InboxParams>) {
	const query = new URLSearchParams();
	if (folder && folder !== ContactFolder.INBOX) query.set('folder', folder);
	if (search) query.set('search', search);
	if (page && page > 1) query.set('page', String(page));
	const text = query.toString();

	return text ? `${messagesPath}?${text}` : messagesPath;
}

/** Tells the sidebar's unread badge to refetch. */
export function announceContactMessagesChanged() {
	window.dispatchEvent(new Event(contactMessagesChangedEvent));
}
