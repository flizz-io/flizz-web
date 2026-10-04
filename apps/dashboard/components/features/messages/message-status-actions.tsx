'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
	contactMessageMessages,
	contactStatusLabels,
	messagesPath
} from '@/constants/contact-messages';
import { announceContactMessagesChanged } from '@/utils/contact-messages';
import {
	ApiError,
	ContactMessageStatus,
	updateContactMessageService
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

const messages = contactMessageMessages.actions;

interface StatusAction {
	label: string;
	status: ContactMessageStatus;
	/** Hidden while the message already has this status, or these. */
	hiddenWhen: ContactMessageStatus[];
}

const actions: StatusAction[] = [
	{
		label: messages.markReplied,
		status: ContactMessageStatus.REPLIED,
		hiddenWhen: [ContactMessageStatus.REPLIED]
	},
	{
		label: messages.moveToInbox,
		status: ContactMessageStatus.READ,
		hiddenWhen: [
			ContactMessageStatus.NEW,
			ContactMessageStatus.READ,
			ContactMessageStatus.REPLIED
		]
	},
	{
		label: messages.archive,
		status: ContactMessageStatus.ARCHIVED,
		hiddenWhen: [ContactMessageStatus.ARCHIVED]
	},
	{
		label: messages.markSpam,
		status: ContactMessageStatus.SPAM,
		hiddenWhen: [ContactMessageStatus.SPAM]
	},
	{
		label: messages.markUnread,
		status: ContactMessageStatus.NEW,
		hiddenWhen: [ContactMessageStatus.NEW]
	}
];

interface MessageStatusActionsProps {
	uuid: string;
	status: ContactMessageStatus;
}

/**
 * One button per move the message can make. Marking it unread goes back to
 * the inbox — staying would open it again, and opening marks it read.
 */
export function MessageStatusActions({
	uuid,
	status
}: MessageStatusActionsProps) {
	const router = useRouter();
	const [pending, setPending] = useState<ContactMessageStatus | null>(null);

	const change = async (next: ContactMessageStatus) => {
		setPending(next);
		try {
			await updateContactMessageService(uuid, { status: next });
			announceContactMessagesChanged();
			toast.success(messages.changed(contactStatusLabels[next]));
			if (next === ContactMessageStatus.NEW) {
				router.push(messagesPath);
			}
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
		} finally {
			setPending(null);
		}
	};

	return (
		<div className="flex flex-wrap gap-2">
			{actions
				.filter((action) => !action.hiddenWhen.includes(status))
				.map((action) => (
					<Button
						key={action.status}
						type="button"
						variant="outline"
						size="sm"
						disabled={pending !== null}
						onClick={() => change(action.status)}
					>
						{action.label}
					</Button>
				))}
		</div>
	);
}
