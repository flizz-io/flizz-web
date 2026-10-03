import { ServiceVisualPreview } from '@/components/features/services/service-visual-preview';
import { FieldError } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { serviceFormMessages } from '@/constants/services';
import type { ServiceSectionProps } from '@/types/service-form';
import { serviceVisualList } from '@workspace/service-visuals';
import { Label } from '@workspace/ui/components/label';
import {
	ToggleGroup,
	ToggleGroupItem
} from '@workspace/ui/components/toggle-group';

const { fields, sections } = serviceFormMessages;

/** Picks the scene from `@workspace/service-visuals`, with a live preview. */
export function ServiceVisualSection({
	values,
	setField,
	errors
}: ServiceSectionProps) {
	return (
		<SectionCard
			title={sections.visual}
			description={sections.visualLead}
		>
			<div className="grid gap-5 md:grid-cols-[1fr_18rem]">
				<div className="flex flex-col gap-2">
					<Label id="service-visual-label">{fields.visualKind}</Label>
					<ToggleGroup
						type="single"
						variant="outline"
						value={values.visualKind}
						onValueChange={(value) => {
							const picked = serviceVisualList.find(
								(visual) => visual.id === value
							);
							if (picked) setField('visualKind', picked.id);
						}}
						aria-labelledby="service-visual-label"
						className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3"
					>
						{serviceVisualList.map((visual) => (
							<ToggleGroupItem
								key={visual.id}
								value={visual.id}
								className="h-auto justify-start rounded-md border px-3 py-2 text-left text-sm data-[state=on]:border-primary"
							>
								{visual.label}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
					<FieldError message={errors.visualKind} />
				</div>
				<div className="flex flex-col gap-2">
					<Label>{fields.visualPreview}</Label>
					<ServiceVisualPreview kind={values.visualKind} />
				</div>
			</div>
		</SectionCard>
	);
}
