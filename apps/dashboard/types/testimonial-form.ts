import type { PublishStatus } from '@workspace/api-services';

/** Everything the testimonial form edits, as the inputs hold it. */
export interface TestimonialFormValues {
	quote: string;
	highlights: string[];
	authorName: string;
	authorRole: string;
	/** A project uuid, or `noProjectValue`. */
	project: string;
	status: PublishStatus;
}

/** Updates one field of the form. */
export type SetTestimonialField = <K extends keyof TestimonialFormValues>(
	field: K,
	value: TestimonialFormValues[K]
) => void;

/** Props every form section takes. */
export interface TestimonialSectionProps {
	values: TestimonialFormValues;
	setField: SetTestimonialField;
	/** API messages keyed by field — `quote`, `highlights`, `projectUuid`. */
	errors: Record<string, string>;
}

/** A run of the quote, lit when it's one of the highlights. */
export interface QuotePart {
	text: string;
	lit: boolean;
}
