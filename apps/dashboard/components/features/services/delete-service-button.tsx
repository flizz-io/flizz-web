'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmActionDialog } from '@/components/snippets/confirm-action-dialog/confirm-action-dialog';
import { serviceFormMessages, servicesPath } from '@/constants/services';
import { ApiError, deleteServiceService } from '@workspace/api-services';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';

interface DeleteServiceButtonProps {
	uuid: string;
	title: string;
	/** Linked projects — while above 0 the API refuses, so say so up front. */
	projectCount: number;
}

const messages = serviceFormMessages.delete;

/** Soft-deletes after a confirm — or explains why it can't yet. */
export function DeleteServiceButton({
	uuid,
	title,
	projectCount
}: DeleteServiceButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const blocked = projectCount > 0;

	const confirm = async () => {
		try {
			await deleteServiceService(uuid);
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
			throw error;
		}
		toast.success(messages.deleted(title));
		router.push(servicesPath);
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
			{blocked ? (
				<AlertDialog
					open={open}
					onOpenChange={setOpen}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{messages.blockedTitle(title)}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{messages.blockedBody(projectCount)}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogAction>
								{messages.close}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			) : (
				<ConfirmActionDialog
					open={open}
					onOpenChange={setOpen}
					title={messages.title(title)}
					description={messages.body}
					confirmLabel={messages.confirm}
					destructive
					onConfirm={confirm}
				/>
			)}
		</>
	);
}
