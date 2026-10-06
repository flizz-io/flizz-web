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
import { Input } from '@workspace/ui/components/input';

const { fields, sections } = testimonialFormMessages;

/** Name and role. */
export function TestimonialAuthorSection({
	values,
	setField,
	errors
}: TestimonialSectionProps) {
	return (
		<SectionCard
			title={sections.author}
			description={sections.authorLead}
		>
			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					id="testimonial-author-name"
					label={fields.authorName}
					error={errors.authorName}
					aside={charCount(values.authorName, limits.authorName)}
				>
					<Input
						id="testimonial-author-name"
						value={values.authorName}
						onChange={(event) =>
							setField('authorName', event.target.value)
						}
						maxLength={limits.authorName}
						required
						aria-invalid={Boolean(errors.authorName)}
					/>
				</FormField>
				<FormField
					id="testimonial-author-role"
					label={fields.authorRole}
					hint={fields.authorRoleHint}
					error={errors.authorRole}
					aside={charCount(values.authorRole, limits.authorRole)}
				>
					<Input
						id="testimonial-author-role"
						value={values.authorRole}
						onChange={(event) =>
							setField('authorRole', event.target.value)
						}
						maxLength={limits.authorRole}
						required
						aria-invalid={Boolean(errors.authorRole)}
					/>
				</FormField>
			</div>
		</SectionCard>
	);
}
