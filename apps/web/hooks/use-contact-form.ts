'use client';

import { useCallback, useMemo, useState } from 'react';

import { ContactField, ContactFormStatus } from '@/enums/contact';
import { contactFormSchema } from '@/schemas/contact';
import type { ContactFieldErrors, ContactFormValues } from '@/types/contact';

const emptyContactForm: ContactFormValues = {
	name: '',
	company: '',
	email: '',
	scope: '',
	start: '',
	message: ''
};

/** Company is the only field the schema will accept blank. */
const requiredFields: ContactField[] = [
	ContactField.NAME,
	ContactField.EMAIL,
	ContactField.SCOPE,
	ContactField.START,
	ContactField.MESSAGE
];

/**
 * Everything the three form variations have in common. They differ only in how
 * a field is presented — the state, the validation and what a submission does
 * are identical, so swapping variation can never change what gets sent.
 */
export function useContactForm() {
	const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
	const [errors, setErrors] = useState<ContactFieldErrors>({});
	const [status, setStatus] = useState<ContactFormStatus>(
		ContactFormStatus.IDLE
	);

	const setField = useCallback(
		<TField extends keyof ContactFormValues>(
			field: TField,
			value: ContactFormValues[TField]
		) => {
			setValues((current) => ({ ...current, [field]: value }));

			// Clear this field's error on the first keystroke. Re-validating as
			// it is typed would call every half-written address broken.
			setErrors((current) => {
				if (!current[field]) return current;

				const next = { ...current };
				delete next[field];
				return next;
			});
		},
		[]
	);

	const completedCount = useMemo(
		() =>
			requiredFields.filter((field) => values[field].trim().length > 0)
				.length,
		[values]
	);

	const submit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const parsed = contactFormSchema.safeParse(values);

			if (!parsed.success) {
				const nextErrors: ContactFieldErrors = {};

				for (const issue of parsed.error.issues) {
					const [field] = issue.path;
					if (typeof field !== 'string') continue;

					const key = field as keyof ContactFormValues;
					// One message per field — the first is the useful one.
					if (!nextErrors[key]) nextErrors[key] = issue.message;
				}

				setErrors(nextErrors);
				setStatus(ContactFormStatus.IDLE);
				return;
			}

			setErrors({});
			setStatus(ContactFormStatus.SUBMITTING);

			try {
				// TODO: POST `parsed.data` to the contact endpoint once it
				// exists. Nothing leaves the browser yet — the pause below
				// stands in for the round trip.
				await new Promise((resolve) => setTimeout(resolve, 900));
				setStatus(ContactFormStatus.SUCCESS);
			} catch {
				setStatus(ContactFormStatus.ERROR);
			}
		},
		[values]
	);

	const reset = useCallback(() => {
		setValues(emptyContactForm);
		setErrors({});
		setStatus(ContactFormStatus.IDLE);
	}, []);

	return {
		values,
		errors,
		status,
		setField,
		submit,
		reset,
		completedCount,
		requiredCount: requiredFields.length
	};
}
