import { noProjectValue } from '@/constants/testimonials';
import type {
	QuotePart,
	TestimonialFormValues
} from '@/types/testimonial-form';
import {
	PublishStatus,
	type CreateTestimonialPayload,
	type TestimonialRecord,
	type UpdateTestimonialPayload
} from '@workspace/api-services';

export function emptyTestimonialValues(): TestimonialFormValues {
	return {
		quote: '',
		highlights: [],
		authorName: '',
		authorRole: '',
		project: noProjectValue,
		status: PublishStatus.DRAFT
	};
}

export function testimonialToValues(
	testimonial: TestimonialRecord
): TestimonialFormValues {
	return {
		quote: testimonial.quote,
		highlights: testimonial.highlights,
		authorName: testimonial.authorName,
		authorRole: testimonial.authorRole,
		project: testimonial.project?.uuid ?? noProjectValue,
		status: testimonial.status
	};
}

function contentPayload(values: TestimonialFormValues) {
	return {
		quote: values.quote,
		highlights: values.highlights,
		authorName: values.authorName,
		authorRole: values.authorRole,
		projectUuid: values.project === noProjectValue ? null : values.project
	};
}

/** A new testimonial — always a Draft. */
export function toCreateTestimonialPayload(
	values: TestimonialFormValues
): CreateTestimonialPayload {
	return contentPayload(values);
}

/** Every field — the form always saves the whole testimonial. */
export function toUpdateTestimonialPayload(
	values: TestimonialFormValues
): UpdateTestimonialPayload {
	return { ...contentPayload(values), status: values.status };
}

/** Quotes are one paragraph — line breaks become spaces as they're typed. */
export function toOneLine(text: string) {
	return text.replace(/[\r\n]+/g, ' ');
}

/** Whether `phrase` is in `quote`, ignoring case — as the site matches. */
export function quoteContains(quote: string, phrase: string) {
	return quote.toLowerCase().includes(phrase.toLowerCase());
}

/** Highlights an edit of the quote has stranded. */
export function missingHighlights(quote: string, highlights: string[]) {
	return highlights.filter((phrase) => !quoteContains(quote, phrase));
}

/**
 * Splits a quote around its highlights, as the home page does: longest
 * first, so a phrase containing another lights whole.
 */
export function splitOnHighlights(
	quote: string,
	highlights: string[]
): QuotePart[] {
	const phrases = highlights.filter((phrase) => phrase.trim());
	if (!phrases.length) return [{ text: quote, lit: false }];

	const pattern = new RegExp(
		`(${[...phrases]
			.sort((a, b) => b.length - a.length)
			.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
			.join('|')})`,
		'gi'
	);

	return quote
		.split(pattern)
		.filter(Boolean)
		.map((text) => ({
			text,
			lit: phrases.some(
				(phrase) => phrase.toLowerCase() === text.toLowerCase()
			)
		}));
}
