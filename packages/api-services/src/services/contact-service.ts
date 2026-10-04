import { apiService } from './api-service';
import { HttpMethod } from '../enums/api';
import type { ApiContext } from '../models/api';
import type {
	ContactMessageListQuery,
	ContactMessagePage,
	ContactMessageRecord,
	ContactMessageSummary,
	SubmitContactPayload,
	SubmitContactResponse,
	UpdateContactMessagePayload
} from '../models/contact';

const messagePath = (uuid: string) =>
	`/contact-messages/${encodeURIComponent(uuid)}`;

// Dashboard — need a session with the CONTACT_MESSAGES grant.

export function getContactMessagesService(
	query: ContactMessageListQuery = {},
	context?: ApiContext
) {
	return apiService<ContactMessagePage>('/contact-messages', {
		query: { ...query },
		context
	});
}

export function getContactMessageSummaryService(context?: ApiContext) {
	return apiService<ContactMessageSummary>('/contact-messages/summary', {
		context
	});
}

/** The first open by anyone marks the message read. */
export function getContactMessageService(uuid: string, context?: ApiContext) {
	return apiService<ContactMessageRecord>(messagePath(uuid), { context });
}

export function updateContactMessageService(
	uuid: string,
	payload: UpdateContactMessagePayload,
	context?: ApiContext
) {
	return apiService<ContactMessageRecord>(messagePath(uuid), {
		method: HttpMethod.PATCH,
		body: payload,
		context
	});
}

/** Soft delete. */
export function deleteContactMessageService(
	uuid: string,
	context?: ApiContext
) {
	return apiService<void>(messagePath(uuid), {
		method: HttpMethod.DELETE,
		context
	});
}

// Public — the website's form; no session. Pass the API's origin as
// `context.baseUrl`: the website has no `/api` rewrite.

export function submitContactService(
	payload: SubmitContactPayload,
	context?: ApiContext
) {
	return apiService<SubmitContactResponse>('/public/contact', {
		method: HttpMethod.POST,
		body: payload,
		context
	});
}
