import { VisibilityBadge } from '@/components/features/projects/visibility-badge';
import { FormField } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	noProjectValue,
	testimonialFormMessages
} from '@/constants/testimonials';
import type { TestimonialSectionProps } from '@/types/testimonial-form';
import type { TestimonialProject } from '@workspace/api-services';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';

interface TestimonialProjectSectionProps extends TestimonialSectionProps {
	projects: TestimonialProject[];
}

const { fields, sections } = testimonialFormMessages;

/** The project the quote came from — optional. */
export function TestimonialProjectSection({
	values,
	setField,
	errors,
	projects
}: TestimonialProjectSectionProps) {
	const linked = projects.find((project) => project.uuid === values.project);

	return (
		<SectionCard
			title={sections.project}
			description={sections.projectLead}
		>
			<div className="flex flex-wrap items-end gap-4">
				<FormField
					id="testimonial-project"
					label={fields.project}
					error={errors.projectUuid}
					className="w-full sm:w-80"
				>
					<Select
						value={values.project}
						onValueChange={(value) => setField('project', value)}
					>
						<SelectTrigger
							id="testimonial-project"
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={noProjectValue}>
								{fields.noProject}
							</SelectItem>
							{projects.map((project) => (
								<SelectItem
									key={project.uuid}
									value={project.uuid}
								>
									{project.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
				{linked ? (
					<div className="pb-2">
						<VisibilityBadge visibility={linked.visibility} />
					</div>
				) : null}
			</div>
		</SectionCard>
	);
}
