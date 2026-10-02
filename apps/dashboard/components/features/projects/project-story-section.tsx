import { SectionCard } from '@/components/features/projects/section-card';
import { StoryListField } from '@/components/features/projects/story-list-field';
import { projectFormMessages } from '@/constants/projects';
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
				<StoryListField
					key={name}
					name={name}
					label={label}
					items={values[name]}
					onChange={(items) => setField(name, items)}
					errors={errors}
				/>
			))}
		</SectionCard>
	);
}
