'use client';

import { VisibilityBadge } from '@/components/features/projects/visibility-badge';
import { FormField } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { projectFormMessages, statusLabels } from '@/constants/projects';
import { useIsClient } from '@/hooks/use-is-client';
import type { ProjectSectionProps } from '@/types/project-form';
import { isoToLocalInput, localInputToIso } from '@/utils/local-date-time';
import { ProjectStatus, ProjectVisibility } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';

interface ProjectPublishingSectionProps extends ProjectSectionProps {
	/** A new project is always created as a Draft. */
	isNew: boolean;
}

const { fields, sections } = projectFormMessages;

const ORDER_MAX = 10_000;

/** What the website would do with these values — before saving. */
function previewVisibility(status: ProjectStatus, publishAt: string) {
	if (status === ProjectStatus.DRAFT) return ProjectVisibility.DRAFT;

	return publishAt && new Date(publishAt).getTime() > Date.now()
		? ProjectVisibility.SCHEDULED
		: ProjectVisibility.LIVE;
}

interface PlacementFieldProps {
	id: string;
	label: string;
	hint: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	orderLabel: string;
	order: string;
	onOrderChange: (order: string) => void;
	orderError?: string;
}

/** A checkbox plus the order it places the project in. */
function PlacementField({
	id,
	label,
	hint,
	checked,
	onCheckedChange,
	orderLabel,
	order,
	onOrderChange,
	orderError
}: PlacementFieldProps) {
	return (
		<div className="flex flex-col gap-3 rounded-lg border p-4">
			<div className="flex items-start gap-3">
				<Checkbox
					id={id}
					checked={checked}
					onCheckedChange={(value) => onCheckedChange(value === true)}
					className="mt-0.5"
				/>
				<div className="flex flex-col gap-1">
					<Label htmlFor={id}>{label}</Label>
					<p className="text-xs text-muted-foreground">{hint}</p>
				</div>
			</div>
			{checked ? (
				<FormField
					id={`${id}-order`}
					label={orderLabel}
					hint={fields.orderHint}
					error={orderError}
					className="max-w-40"
				>
					<Input
						id={`${id}-order`}
						type="number"
						inputMode="numeric"
						min={0}
						max={ORDER_MAX}
						value={order}
						onChange={(event) => onOrderChange(event.target.value)}
						aria-invalid={Boolean(orderError)}
					/>
				</FormField>
			) : null}
		</div>
	);
}

/** Status, publish date, and the reel / home strip placement. */
export function ProjectPublishingSection({
	values,
	setField,
	errors,
	isNew
}: ProjectPublishingSectionProps) {
	// The date input shows local time, which the server can't know.
	const isClient = useIsClient();

	return (
		<SectionCard
			title={sections.publishing}
			description={sections.publishingLead}
		>
			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					id="project-status"
					label={fields.status}
					error={errors.status}
					aside={
						<VisibilityBadge
							visibility={previewVisibility(
								values.status,
								values.publishAt
							)}
						/>
					}
				>
					<Select
						value={values.status}
						onValueChange={(value) =>
							setField('status', value as ProjectStatus)
						}
						disabled={isNew}
					>
						<SelectTrigger
							id="project-status"
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(ProjectStatus).map((option) => (
								<SelectItem
									key={option}
									value={option}
								>
									{statusLabels[option]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
				<FormField
					id="project-publish-at"
					label={fields.publishAt}
					hint={fields.publishAtHint}
					error={errors.publishAt}
				>
					<div className="flex gap-2">
						<Input
							id="project-publish-at"
							type="datetime-local"
							value={
								isClient
									? isoToLocalInput(values.publishAt)
									: ''
							}
							onChange={(event) =>
								setField(
									'publishAt',
									localInputToIso(event.target.value)
								)
							}
							aria-invalid={Boolean(errors.publishAt)}
						/>
						{values.publishAt ? (
							<Button
								type="button"
								variant="ghost"
								onClick={() => setField('publishAt', '')}
							>
								{fields.clearDate}
							</Button>
						) : null}
					</div>
				</FormField>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<PlacementField
					id="project-featured"
					label={fields.featured}
					hint={fields.featuredHint}
					checked={values.featured}
					onCheckedChange={(checked) => setField('featured', checked)}
					orderLabel={fields.featuredOrder}
					order={values.featuredOrder}
					onOrderChange={(order) => setField('featuredOrder', order)}
					orderError={errors.featuredOrder}
				/>
				<PlacementField
					id="project-show-on-home"
					label={fields.showOnHome}
					hint={fields.showOnHomeHint}
					checked={values.showOnHome}
					onCheckedChange={(checked) =>
						setField('showOnHome', checked)
					}
					orderLabel={fields.homeOrder}
					order={values.homeOrder}
					onOrderChange={(order) => setField('homeOrder', order)}
					orderError={errors.homeOrder}
				/>
			</div>
		</SectionCard>
	);
}
