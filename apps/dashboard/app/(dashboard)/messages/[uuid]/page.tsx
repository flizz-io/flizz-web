import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { DeleteMessageButton } from '@/components/features/messages/delete-message-button';
import { MessageDetails } from '@/components/features/messages/message-details';
import { MessageNoteForm } from '@/components/features/messages/message-note-form';
import { MessageStatusActions } from '@/components/features/messages/message-status-actions';
import { MessageStatusBadge } from '@/components/features/messages/message-status-badge';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { homePath } from '@/constants/auth';
import {
	contactMessageMessages,
	contactMessagesMessages,
	messagesPath
} from '@/constants/contact-messages';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import {
	ApiError,
	Feature,
	getContactMessageService
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;

interface MessagePageProps {
	params: Promise<{ uuid: string }>;
}

export const metadata: Metadata = { title: contactMessagesMessages.title };

/** Opening marks it read (the API does that). A deleted or unknown id is a 404. */
async function loadMessage(uuid: string) {
	try {
		return await serverCall(
			getContactMessageService(uuid, await serverApiContext())
		);
	} catch (error) {
		if (
			error instanceof ApiError &&
			(error.status === NOT_FOUND_STATUS ||
				error.status === BAD_REQUEST_STATUS)
		) {
			notFound();
		}
		throw error;
	}
}

/** Needs Contact messages › View; Edit for status and note, Delete to delete. */
export default async function MessagePage({ params }: MessagePageProps) {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.CONTACT_MESSAGES];
	if (!grant?.view) redirect(homePath);

	const message = await loadMessage((await params).uuid);

	return (
		<>
			<div className="flex flex-col gap-2">
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="self-start"
				>
					<Link href={messagesPath}>
						<ArrowLeft />
						{contactMessageMessages.backToList}
					</Link>
				</Button>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-semibold tracking-tight">
								{message.name}
							</h1>
							<MessageStatusBadge status={message.status} />
						</div>
						{message.company ? (
							<p className="text-sm text-muted-foreground">
								{message.company}
							</p>
						) : null}
						{grant.edit ? null : (
							<p className="text-sm text-muted-foreground">
								{contactMessageMessages.readOnly}
							</p>
						)}
					</div>
					{grant.delete ? (
						<DeleteMessageButton
							uuid={message.uuid}
							name={message.name}
						/>
					) : null}
				</div>
			</div>
			<div className="grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="flex flex-col gap-6">
					<MessageDetails message={message} />
				</div>
				<div className="flex flex-col gap-6">
					{grant.edit ? (
						<SectionCard
							title={contactMessageMessages.actions.title}
						>
							<MessageStatusActions
								uuid={message.uuid}
								status={message.status}
							/>
						</SectionCard>
					) : null}
					<SectionCard title={contactMessageMessages.note.title}>
						<MessageNoteForm
							uuid={message.uuid}
							note={message.internalNote}
							canEdit={grant.edit}
						/>
					</SectionCard>
				</div>
			</div>
		</>
	);
}
