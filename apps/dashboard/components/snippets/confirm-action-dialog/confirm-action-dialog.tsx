'use client';

import { useState } from 'react';

import { commonMessages } from '@/constants/messages';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@workspace/ui/components/alert-dialog';
import { buttonVariants } from '@workspace/ui/components/button';

interface ConfirmActionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	confirmLabel: string;
	destructive?: boolean;
	/** Resolves when done; the dialog stays open (and busy) until then. */
	onConfirm: () => Promise<void>;
}

/** "Are you sure?" before an action that is hard to undo. */
export function ConfirmActionDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel,
	destructive = false,
	onConfirm
}: ConfirmActionDialogProps) {
	const [pending, setPending] = useState(false);

	const confirm = async (event: React.MouseEvent) => {
		// Keep the dialog open until the request settles.
		event.preventDefault();
		setPending(true);
		try {
			await onConfirm();
			onOpenChange(false);
		} finally {
			setPending(false);
		}
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => !pending && onOpenChange(next)}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>
						{commonMessages.cancel}
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={pending}
						onClick={confirm}
						className={
							destructive
								? buttonVariants({ variant: 'destructive' })
								: undefined
						}
					>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
