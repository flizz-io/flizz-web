import { prisma } from '../configs/database.js';
import { CONTACT_PAGE_SIZE } from '../constants/contact.js';
import { ContactFolder } from '../enums/contact-folder.js';
import type { Prisma } from '../generated/prisma/client.js';
import { ContactMessageStatus } from '../generated/prisma/enums.js';
import type {
	ListContactMessagesFilters,
	UpdateContactMessageInput
} from '../schemas/contact-schema.js';
import type {
	ContactMessageListItemResponse,
	ContactMessagePageResponse,
	ContactMessageResponse,
	ContactMessageSummaryResponse
} from '../types/contact.js';
import type { CurrentUser } from '../types/user.js';
import { HttpError } from '../utils/http-error.js';
import { toUserReference } from '../utils/user-display.js';

const EXCERPT_LENGTH = 160;

const referenceFields = {
	select: { uuid: true, email: true, firstName: true, lastName: true }
} as const;

const messageInclude = {
	readBy: referenceFields,
	updatedBy: referenceFields
} satisfies Prisma.ContactMessageInclude;

type ContactMessageRow = Prisma.ContactMessageGetPayload<{
	include: typeof messageInclude;
}>;

/** The statuses behind each inbox tab. */
const folderStatuses: Record<ContactFolder, ContactMessageStatus[] | null> = {
	[ContactFolder.INBOX]: [
		ContactMessageStatus.NEW,
		ContactMessageStatus.READ,
		ContactMessageStatus.REPLIED
	],
	[ContactFolder.UNREAD]: [ContactMessageStatus.NEW],
	[ContactFolder.ARCHIVED]: [ContactMessageStatus.ARCHIVED],
	[ContactFolder.SPAM]: [ContactMessageStatus.SPAM],
	[ContactFolder.ALL]: null
};

function folderWhere(folder: ContactFolder): Prisma.ContactMessageWhereInput {
	const statuses = folderStatuses[folder];

	return statuses ? { status: { in: statuses } } : {};
}

function excerptOf(message: string) {
	const flat = message.replace(/\s+/g, ' ').trim();

	return flat.length > EXCERPT_LENGTH
		? `${flat.slice(0, EXCERPT_LENGTH).trimEnd()}…`
		: flat;
}

function toListItem(
	message: Omit<ContactMessageRow, 'readBy' | 'updatedBy'>
): ContactMessageListItemResponse {
	return {
		uuid: message.uuid,
		name: message.name,
		company: message.company,
		email: message.email,
		scope: message.scope,
		start: message.start,
		excerpt: excerptOf(message.message),
		status: message.status,
		createdAt: message.createdAt.toISOString()
	};
}

function toMessageResponse(message: ContactMessageRow): ContactMessageResponse {
	return {
		...toListItem(message),
		message: message.message,
		internalNote: message.internalNote,
		sourcePath: message.sourcePath,
		readAt: message.readAt?.toISOString() ?? null,
		readBy: toUserReference(message.readBy),
		updatedAt: message.updatedAt.toISOString(),
		updatedBy: toUserReference(message.updatedBy)
	};
}

/** A live (not deleted) message by public id, or 404. */
async function findMessage(uuid: string) {
	const message = await prisma.contactMessage.findFirst({
		where: { uuid, deletedAt: null },
		include: messageInclude
	});
	if (!message) throw HttpError.notFound('No such message.');

	return message;
}

export async function listContactMessages(
	filters: ListContactMessagesFilters
): Promise<ContactMessagePageResponse> {
	const search: Prisma.ContactMessageWhereInput = filters.search
		? {
				OR: (['name', 'email', 'company', 'message'] as const).map(
					(field) => ({
						[field]: {
							contains: filters.search,
							mode: 'insensitive' as const
						}
					})
				)
			}
		: {};

	const where: Prisma.ContactMessageWhereInput = {
		AND: [{ deletedAt: null }, folderWhere(filters.folder), search]
	};

	const [total, messages] = await prisma.$transaction([
		prisma.contactMessage.count({ where }),
		prisma.contactMessage.findMany({
			where,
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			skip: (filters.page - 1) * CONTACT_PAGE_SIZE,
			take: CONTACT_PAGE_SIZE
		})
	]);

	return {
		items: messages.map(toListItem),
		total,
		page: filters.page,
		pageSize: CONTACT_PAGE_SIZE
	};
}

/** Counts per tab, from one grouped query. */
export async function summarizeContactMessages(): Promise<ContactMessageSummaryResponse> {
	const groups = await prisma.contactMessage.groupBy({
		by: ['status'],
		where: { deletedAt: null },
		_count: { _all: true }
	});

	const countOf = (statuses: ContactMessageStatus[] | null) =>
		groups
			.filter((group) => !statuses || statuses.includes(group.status))
			.reduce((sum, group) => sum + group._count._all, 0);

	return {
		unread: countOf(folderStatuses[ContactFolder.UNREAD]),
		inbox: countOf(folderStatuses[ContactFolder.INBOX]),
		archived: countOf(folderStatuses[ContactFolder.ARCHIVED]),
		spam: countOf(folderStatuses[ContactFolder.SPAM]),
		all: countOf(folderStatuses[ContactFolder.ALL])
	};
}

/**
 * One message. Opening a New one marks it read — `READ`, and on the very
 * first open, who opened it and when. Any other open changes nothing.
 */
export async function openContactMessage(
	actor: CurrentUser,
	uuid: string
): Promise<ContactMessageResponse> {
	const message = await findMessage(uuid);
	if (message.status !== ContactMessageStatus.NEW) {
		return toMessageResponse(message);
	}

	const updated = await prisma.contactMessage.update({
		where: { id: message.id },
		data: {
			status: ContactMessageStatus.READ,
			...(message.readAt
				? {}
				: { readAt: new Date(), readById: actor.id })
		},
		include: messageInclude
	});

	return toMessageResponse(updated);
}

export async function editContactMessage(
	actor: CurrentUser,
	uuid: string,
	input: UpdateContactMessageInput
): Promise<ContactMessageResponse> {
	const message = await findMessage(uuid);

	const updated = await prisma.contactMessage.update({
		where: { id: message.id },
		data: { ...input, updatedById: actor.id },
		include: messageInclude
	});

	return toMessageResponse(updated);
}

/** Soft delete — the row stays, hidden from every list. */
export async function removeContactMessage(actor: CurrentUser, uuid: string) {
	const message = await findMessage(uuid);

	await prisma.contactMessage.update({
		where: { id: message.id },
		data: {
			deletedAt: new Date(),
			deletedById: actor.id,
			updatedById: actor.id
		}
	});
}
