import { ServiceStatusBadge } from '@/components/features/services/service-status-badge';
import { FormField } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { publishStatusLabels, serviceFormMessages } from '@/constants/services';
import type { ServiceSectionProps } from '@/types/service-form';
import { PublishStatus } from '@workspace/api-services';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';

interface ServicePublishingSectionProps extends ServiceSectionProps {
	/** A new service is always created as a Draft. */
	isNew: boolean;
}

const { fields, sections } = serviceFormMessages;

/** Draft or Published — a service has no schedule. */
export function ServicePublishingSection({
	values,
	setField,
	errors,
	isNew
}: ServicePublishingSectionProps) {
	return (
		<SectionCard
			title={sections.publishing}
			description={sections.publishingLead}
		>
			<div className="flex items-end gap-4">
				<FormField
					id="service-status"
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
							id="service-status"
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
					<ServiceStatusBadge status={values.status} />
				</div>
			</div>
		</SectionCard>
	);
}
