'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmActionDialog } from '@/components/snippets/confirm-action-dialog/confirm-action-dialog';
import { articleFormMessages, articlesPath } from '@/constants/articles';
import { ApiError, deleteArticleService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

interface DeleteArticleButtonProps {
	uuid: string;
	title: string;
}

const messages = articleFormMessages.delete;

/** Soft-deletes after a confirm. */
export function DeleteArticleButton({ uuid, title }: DeleteArticleButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const confirm = async () => {
		try {
			await deleteArticleService(uuid);
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
			throw error;
		}
		toast.success(messages.deleted(title));
		router.push(articlesPath);
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
				title={messages.title(title)}
				description={messages.body}
				confirmLabel={messages.confirm}
				destructive
				onConfirm={confirm}
			/>
		</>
	);
}
