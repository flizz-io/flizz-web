import {
	FormField,
	charCount
} from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	testimonialFieldLimits as limits,
	testimonialFormMessages
} from '@/constants/testimonials';
import type { TestimonialSectionProps } from '@/types/testimonial-form';
import { toOneLine } from '@/utils/testimonial-form';
import { Textarea } from '@workspace/ui/components/textarea';

const { fields, sections } = testimonialFormMessages;

/** The quote itself — one paragraph. */
export function TestimonialQuoteSection({
	values,
	setField,
	errors
}: TestimonialSectionProps) {
	return (
		<SectionCard
			title={sections.quote}
			description={sections.quoteLead}
		>
			<FormField
				id="testimonial-quote"
				label={fields.quote}
				hint={fields.quoteHint}
				error={errors.quote}
				aside={charCount(values.quote, limits.quote)}
			>
				<Textarea
					id="testimonial-quote"
					value={values.quote}
					onChange={(event) =>
						setField('quote', toOneLine(event.target.value))
					}
					maxLength={limits.quote}
					rows={4}
					required
					aria-invalid={Boolean(errors.quote)}
				/>
			</FormField>
		</SectionCard>
	);
}
