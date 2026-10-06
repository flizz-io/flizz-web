'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmActionDialog } from '@/components/snippets/confirm-action-dialog/confirm-action-dialog';
import {
	testimonialFormMessages,
	testimonialsPath
} from '@/constants/testimonials';
import { ApiError, deleteTestimonialService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

interface DeleteTestimonialButtonProps {
	uuid: string;
	authorName: string;
}

const messages = testimonialFormMessages.delete;

/** Soft-deletes after a confirm — a testimonial is never blocked. */
export function DeleteTestimonialButton({
	uuid,
	authorName
}: DeleteTestimonialButtonProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const confirm = async () => {
		try {
			await deleteTestimonialService(uuid);
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
			throw error;
		}
		toast.success(messages.deleted(authorName));
		router.push(testimonialsPath);
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
				title={messages.title(authorName)}
				description={messages.body}
				confirmLabel={messages.confirm}
				destructive
				onConfirm={confirm}
			/>
		</>
	);
}
