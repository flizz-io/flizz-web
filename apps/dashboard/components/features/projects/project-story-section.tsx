import { SectionCard } from '@/components/snippets/section-card/section-card';
import { TextListField } from '@/components/snippets/text-list-field/text-list-field';
import {
	projectFieldLimits as limits,
	projectFormMessages
} from '@/constants/projects';
import type { ProjectSectionProps, StoryField } from '@/types/project-form';

const { fields, sections } = projectFormMessages;

const storyFields: { name: StoryField; label: string }[] = [
	{ name: 'brief', label: fields.brief },
	{ name: 'constraints', label: fields.constraints },
	{ name: 'approach', label: fields.approach },
	{ name: 'built', label: fields.built }
];

/** Brief, Constraints, Approach and What we built. */
export function ProjectStorySection({
	values,
	setField,
	errors
}: ProjectSectionProps) {
	return (
		<SectionCard
			title={sections.story}
			description={sections.storyLead}
		>
			{storyFields.map(({ name, label }) => (
				<TextListField
					key={name}
					name={name}
					idPrefix="project"
					label={label}
					items={values[name]}
					onChange={(items) => setField(name, items)}
					errors={errors}
					maxLength={limits.storyItem}
					maxItems={limits.storyItemsMax}
					addLabel={fields.addParagraph}
				/>
			))}
		</SectionCard>
	);
}
