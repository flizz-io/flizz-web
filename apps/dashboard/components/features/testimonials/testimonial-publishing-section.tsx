import { TestimonialStatusBadge } from '@/components/features/testimonials/testimonial-status-badge';
import { FormField } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { publishStatusLabels } from '@/constants/services';
import { testimonialFormMessages } from '@/constants/testimonials';
import type { TestimonialSectionProps } from '@/types/testimonial-form';
import { PublishStatus } from '@workspace/api-services';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';

interface TestimonialPublishingSectionProps extends TestimonialSectionProps {
	/** A new testimonial is always created as a Draft. */
	isNew: boolean;
}

const { fields, sections } = testimonialFormMessages;

/** Draft or Published — a testimonial has no schedule. */
export function TestimonialPublishingSection({
	values,
	setField,
	errors,
	isNew
}: TestimonialPublishingSectionProps) {
	return (
		<SectionCard
			title={sections.publishing}
			description={sections.publishingLead}
		>
			<div className="flex items-end gap-4">
				<FormField
					id="testimonial-status"
					label={fields.status}
					error={errors.status}
					className="w-56"
				>
					<Select
						value={values.status}
						onValueChange={(value) =>
							setField('status', value as PublishStatus)
						}
						disabled={isNew}
					>
						<SelectTrigger
							id="testimonial-status"
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(PublishStatus).map((option) => (
								<SelectItem
									key={option}
									value={option}
								>
									{publishStatusLabels[option]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
				<div className="pb-2">
					<TestimonialStatusBadge status={values.status} />
				</div>
			</div>
		</SectionCard>
	);
}
