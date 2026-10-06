'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { TestimonialAuthorSection } from '@/components/features/testimonials/testimonial-author-section';
import { TestimonialHighlightsSection } from '@/components/features/testimonials/testimonial-highlights-section';
import { TestimonialProjectSection } from '@/components/features/testimonials/testimonial-project-section';
import { TestimonialPublishingSection } from '@/components/features/testimonials/testimonial-publishing-section';
import { TestimonialQuoteSection } from '@/components/features/testimonials/testimonial-quote-section';
import {
	testimonialFormMessages,
	testimonialPath
} from '@/constants/testimonials';
import type {
	SetTestimonialField,
	TestimonialFormValues
} from '@/types/testimonial-form';
import {
	emptyTestimonialValues,
	missingHighlights,
	testimonialToValues,
	toCreateTestimonialPayload,
	toUpdateTestimonialPayload
} from '@/utils/testimonial-form';
import {
	ApiError,
	createTestimonialService,
	updateTestimonialService,
	type TestimonialProject,
	type TestimonialRecord
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

interface TestimonialFormProps {
	/** Omitted for a new testimonial. */
	testimonial?: TestimonialRecord;
	/** The Project dropdown's options. */
	projects: TestimonialProject[];
	/** Edit (or Create, for a new one). Without it the form is read-only. */
	canSave: boolean;
}

const messages = testimonialFormMessages;

/** The whole testimonial on one page, saved together with Save. */
export function TestimonialForm({
	testimonial,
	projects,
	canSave
}: TestimonialFormProps) {
	const router = useRouter();
	const [saved, setSaved] = useState(testimonial);
	const [values, setValues] = useState<TestimonialFormValues>(() =>
		testimonial
			? testimonialToValues(testimonial)
			: emptyTestimonialValues()
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [pending, setPending] = useState(false);
	const readOnly = !canSave;
	// A stranded highlight would only be refused by the API — catch it here.
	const stranded = missingHighlights(values.quote, values.highlights).length;

	const setField = useCallback<SetTestimonialField>((field, value) => {
		setValues((current) => ({ ...current, [field]: value }));
	}, []);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (readOnly || stranded) return;
		setPending(true);
		setErrors({});
		try {
			if (saved) {
				const next = await updateTestimonialService(
					saved.uuid,
					toUpdateTestimonialPayload(values)
				);
				setSaved(next);
				setValues(testimonialToValues(next));
				toast.success(messages.saved(next.authorName));
				router.refresh();
			} else {
				const created = await createTestimonialService(
					toCreateTestimonialPayload(values)
				);
				toast.success(messages.created(created.authorName));
				router.push(testimonialPath(created.uuid));
			}
		} catch (error) {
			if (!(error instanceof ApiError)) throw error;
			setErrors(error.fieldErrors);
			toast.error(
				Object.keys(error.fieldErrors).length
					? messages.fixErrors
					: error.message
			);
		} finally {
			setPending(false);
		}
	};

	const sectionProps = { values, setField, errors };

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			className="flex max-w-4xl flex-col gap-6"
		>
			<fieldset
				disabled={readOnly || pending}
				className="flex min-w-0 flex-col gap-6"
			>
				<TestimonialQuoteSection {...sectionProps} />
				<TestimonialHighlightsSection
					{...sectionProps}
					readOnly={readOnly}
				/>
				<TestimonialAuthorSection {...sectionProps} />
				<TestimonialProjectSection
					{...sectionProps}
					projects={projects}
				/>
				<TestimonialPublishingSection
					{...sectionProps}
					isNew={!saved}
				/>
			</fieldset>

			{readOnly ? null : (
				<div className="flex flex-col items-end gap-2">
					{stranded ? (
						<p className="text-sm text-destructive">
							{messages.fixHighlights}
						</p>
					) : null}
					<Button
						type="submit"
						disabled={pending || stranded > 0}
					>
						{pending
							? messages.saving
							: saved
								? messages.save
								: messages.create}
					</Button>
				</div>
			)}
		</form>
	);
}
