import {
	FormField,
	charCount
} from '@/components/features/projects/form-field';
import { SectionCard } from '@/components/features/projects/section-card';
import {
	projectFieldLimits as limits,
	projectFormMessages
} from '@/constants/projects';
import type { ProjectSectionProps } from '@/types/project-form';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';

const { fields, sections } = projectFormMessages;

/** Optional — both parts or neither. */
export function ProjectQuoteSection({
	values,
	setField,
	errors
}: ProjectSectionProps) {
	return (
		<SectionCard
			title={sections.quote}
			description={sections.quoteLead}
		>
			<FormField
				id="project-quote-text"
				label={fields.quoteText}
				error={errors['quote.text'] ?? errors.quote}
				aside={charCount(values.quoteText, limits.quoteText)}
			>
				<Textarea
					id="project-quote-text"
					value={values.quoteText}
					onChange={(event) =>
						setField('quoteText', event.target.value)
					}
					maxLength={limits.quoteText}
					rows={3}
					aria-invalid={Boolean(errors['quote.text'])}
				/>
			</FormField>
			<FormField
				id="project-quote-attribution"
				label={fields.quoteAttribution}
				error={errors['quote.attribution']}
				className="sm:max-w-md"
			>
				<Input
					id="project-quote-attribution"
					value={values.quoteAttribution}
					onChange={(event) =>
						setField('quoteAttribution', event.target.value)
					}
					maxLength={limits.quoteAttribution}
					placeholder={fields.quoteAttributionPlaceholder}
					aria-invalid={Boolean(errors['quote.attribution'])}
				/>
			</FormField>
		</SectionCard>
	);
}
