import {
	FormField,
	charCount
} from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { TextListField } from '@/components/snippets/text-list-field/text-list-field';
import {
	serviceFieldLimits as limits,
	serviceFormMessages
} from '@/constants/services';
import type { ServiceSectionProps } from '@/types/service-form';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';

const { fields, sections } = serviceFormMessages;

/** Intro, problem, deliverables, outcomes and engagement — the detail page. */
export function ServiceCopySection({
	values,
	setField,
	errors
}: ServiceSectionProps) {
	return (
		<SectionCard
			title={sections.copy}
			description={sections.copyLead}
		>
			<FormField
				id="service-intro"
				label={fields.intro}
				hint={fields.introHint}
				error={errors.intro}
				aside={charCount(values.intro, limits.intro)}
			>
				<Textarea
					id="service-intro"
					value={values.intro}
					onChange={(event) => setField('intro', event.target.value)}
					maxLength={limits.intro}
					rows={3}
					required
					aria-invalid={Boolean(errors.intro)}
				/>
			</FormField>
			<FormField
				id="service-problem"
				label={fields.problem}
				hint={fields.problemHint}
				error={errors.problem}
				aside={charCount(values.problem, limits.problem)}
			>
				<Textarea
					id="service-problem"
					value={values.problem}
					onChange={(event) =>
						setField('problem', event.target.value)
					}
					maxLength={limits.problem}
					rows={5}
					required
					aria-invalid={Boolean(errors.problem)}
				/>
			</FormField>
			<TextListField
				name="deliverables"
				idPrefix="service"
				label={fields.deliverables}
				hint={fields.deliverablesHint}
				items={values.deliverables}
				onChange={(items) => setField('deliverables', items)}
				errors={errors}
				maxLength={limits.listItem}
				maxItems={limits.deliverablesMax}
				addLabel={fields.addItem}
				rows={2}
			/>
			<TextListField
				name="outcomes"
				idPrefix="service"
				label={fields.outcomes}
				hint={fields.outcomesHint}
				items={values.outcomes}
				onChange={(items) => setField('outcomes', items)}
				errors={errors}
				maxLength={limits.listItem}
				maxItems={limits.outcomesMax}
				addLabel={fields.addItem}
				rows={2}
			/>
			<FormField
				id="service-engagement"
				label={fields.engagement}
				hint={fields.engagementHint}
				error={errors.engagement}
			>
				<Input
					id="service-engagement"
					value={values.engagement}
					onChange={(event) =>
						setField('engagement', event.target.value)
					}
					maxLength={limits.engagement}
					placeholder={fields.engagementPlaceholder}
					aria-invalid={Boolean(errors.engagement)}
				/>
			</FormField>
		</SectionCard>
	);
}
