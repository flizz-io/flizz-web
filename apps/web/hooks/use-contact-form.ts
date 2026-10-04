'use client';

import { useCallback, useMemo, useState } from 'react';

import { contactIntegrations } from '@/configs/contact';
import { contactHoneypotField, contactSubmitErrors } from '@/constants/contact';
import { useContactPrefill } from '@/contexts/contact-prefill-context';
import { ContactField, ContactFormStatus } from '@/enums/contact';
import { useTurnstile } from '@/hooks/use-turnstile';
import { contactFormSchema } from '@/schemas/contact';
import type { ContactFieldErrors, ContactFormValues } from '@/types/contact';
import {
	ApiError,
	ApiErrorCode,
	submitContactService
} from '@workspace/api-services';

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

const formFields = new Set<string>(Object.values(ContactField));

/** The API's field messages for fields the form shows; the rest are dropped. */
function fieldErrorsOf(error: ApiError): ContactFieldErrors {
	return Object.fromEntries(
		Object.entries(error.fieldErrors).filter(([field]) =>
			formFields.has(field)
		)
	);
}

/** The sentence beside the button when a send fails as a whole. */
function submitErrorOf(error: unknown) {
	if (error instanceof ApiError) {
		if (error.code === ApiErrorCode.RATE_LIMITED)
			return contactSubmitErrors.rateLimited;
		if (error.fieldErrors.turnstileToken)
			return contactSubmitErrors.captcha;
	}

	return contactSubmitErrors.generic;
}

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
	const [submitError, setSubmitError] = useState<string | null>(null);
	const { containerRef: turnstileRef, getToken } = useTurnstile(
		contactIntegrations.turnstileSiteKey
	);
	const { setPrefill } = useContactPrefill();

	const setField = useCallback(
		<TField extends keyof ContactFormValues>(
			field: TField,
			value: ContactFormValues[TField]
		) => {
			setValues((current) => ({ ...current, [field]: value }));
			// The booking embed below offers these, so they aren't typed twice.
			if (field === ContactField.NAME || field === ContactField.EMAIL) {
				setPrefill({ [field]: value });
			}

			// Clear this field's error on the first keystroke. Re-validating as
			// it is typed would call every half-written address broken.
			setErrors((current) => {
				if (!current[field]) return current;

				const next = { ...current };
				delete next[field];
				return next;
			});
		},
		[setPrefill]
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

			const honeypot = new FormData(event.currentTarget).get(
				contactHoneypotField
			);

			setErrors({});
			setSubmitError(null);
			setStatus(ContactFormStatus.SUBMITTING);

			try {
				const turnstileToken = await getToken().catch(() => {
					throw new ApiError(
						400,
						ApiErrorCode.VALIDATION_FAILED,
						'',
						{
							turnstileToken: contactSubmitErrors.captcha
						}
					);
				});

				await submitContactService(
					{
						...parsed.data,
						sourcePath: window.location.pathname,
						website: typeof honeypot === 'string' ? honeypot : '',
						turnstileToken
					},
					{ baseUrl: contactIntegrations.apiUrl }
				);
				setStatus(ContactFormStatus.SUCCESS);
			} catch (error) {
				if (error instanceof ApiError) setErrors(fieldErrorsOf(error));
				setSubmitError(submitErrorOf(error));
				setStatus(ContactFormStatus.ERROR);
			}
		},
		[values, getToken]
	);

	const reset = useCallback(() => {
		setValues(emptyContactForm);
		setErrors({});
		setSubmitError(null);
		setStatus(ContactFormStatus.IDLE);
	}, []);

	return {
		values,
		errors,
		status,
		submitError,
		turnstileRef,
		setField,
		submit,
		reset,
		completedCount,
		requiredCount: requiredFields.length
	};
}
