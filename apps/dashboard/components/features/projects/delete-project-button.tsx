'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmActionDialog } from '@/components/snippets/confirm-action-dialog/confirm-action-dialog';
import { projectFormMessages, projectsPath } from '@/constants/projects';
import { ApiError, deleteProjectService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

interface DeleteProjectButtonProps {
	uuid: string;
	name: string;
}

/** Soft-deletes after a confirm, then goes back to the list. */
export function DeleteProjectButton({ uuid, name }: DeleteProjectButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const messages = projectFormMessages.delete;

	const confirm = async () => {
		try {
			await deleteProjectService(uuid);
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
			throw error;
		}
		toast.success(messages.deleted(name));
		router.push(projectsPath);
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
