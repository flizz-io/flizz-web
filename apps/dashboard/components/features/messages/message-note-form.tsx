'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { FormField } from '@/components/snippets/form-field/form-field';
import {
	contactMessageMessages,
	INTERNAL_NOTE_MAX
} from '@/constants/contact-messages';
import { ApiError, updateContactMessageService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';

const messages = contactMessageMessages.note;
const NOTE_FIELD_ID = 'internal-note';

interface MessageNoteFormProps {
	uuid: string;
	note: string | null;
	canEdit: boolean;
}

/** The team's note on a message — saved on its own, blank clears it. */
export function MessageNoteForm({ uuid, note, canEdit }: MessageNoteFormProps) {
	const router = useRouter();
	const [saved, setSaved] = useState(note ?? '');
	const [value, setValue] = useState(saved);
	const [saving, setSaving] = useState(false);
	const dirty = value.trim() !== saved.trim();

	const save = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		try {
			const updated = await updateContactMessageService(uuid, {
				internalNote: value
			});
			const next = updated.internalNote ?? '';
			setSaved(next);
			setValue(next);
			toast.success(messages.saved);
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<form
			onSubmit={save}
			className="flex flex-col gap-3"
		>
			<FormField
				id={NOTE_FIELD_ID}
				label={messages.label}
				hint={messages.lead}
				aside={`${value.length} / ${INTERNAL_NOTE_MAX}`}
			>
				<Textarea
					id={NOTE_FIELD_ID}
					value={value}
					maxLength={INTERNAL_NOTE_MAX}
					placeholder={messages.placeholder}
					readOnly={!canEdit}
					onChange={(event) => setValue(event.target.value)}
					className="min-h-28"
				/>
			</FormField>
			{canEdit ? (
				<Button
					type="submit"
					size="sm"
					className="self-start"
					disabled={!dirty || saving}
				>
					{saving ? messages.saving : messages.save}
				</Button>
			) : null}
		</form>
	);
}
