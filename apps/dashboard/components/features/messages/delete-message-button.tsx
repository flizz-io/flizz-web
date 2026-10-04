'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmActionDialog } from '@/components/snippets/confirm-action-dialog/confirm-action-dialog';
import {
	contactMessageMessages,
	messagesPath
} from '@/constants/contact-messages';
import { announceContactMessagesChanged } from '@/utils/contact-messages';
import { ApiError, deleteContactMessageService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

const messages = contactMessageMessages.delete;

interface DeleteMessageButtonProps {
	uuid: string;
	name: string;
}

/** Soft-deletes after a confirm, then goes back to the inbox. */
export function DeleteMessageButton({ uuid, name }: DeleteMessageButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const confirm = async () => {
		try {
			await deleteContactMessageService(uuid);
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
			throw error;
		}
		announceContactMessagesChanged();
		toast.success(messages.deleted);
		router.push(messagesPath);
		router.refresh();
	};

	return (
		<>
			<Button
				type="button"
				variant="outline"
				className="text-destructive"
				onClick={() => setOpen(true)}
			>
				<Trash2 />
				{messages.button}
			</Button>
			<ConfirmActionDialog
				open={open}
				onOpenChange={setOpen}
				title={messages.title(name)}
				description={messages.body}
				confirmLabel={messages.confirm}
				destructive
				onConfirm={confirm}
			/>
		</>
	);
}
