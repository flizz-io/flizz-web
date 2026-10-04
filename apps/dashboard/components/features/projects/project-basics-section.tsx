import {
	FormField,
	charCount
} from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	projectFieldLimits as limits,
	projectFormMessages,
	sectorLabels
} from '@/constants/projects';
import { serviceCategoryLabels } from '@/constants/services';
import type { ProjectSectionProps } from '@/types/project-form';
import {
	ProjectSector,
	PublishStatus,
	ServiceCategory,
	type ServiceOption
} from '@workspace/api-services';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';

interface ProjectBasicsSectionProps extends ProjectSectionProps {
	/** A published project's slug is in links already — warn before changing. */
	wasPublished: boolean;
	savedSlug: string | null;
	/** Every non-deleted service, for the Service dropdown. */
	serviceOptions: ServiceOption[];
}

const { fields, sections } = projectFormMessages;

/** Name, slug, client, sector, service, year and summary. */
export function ProjectBasicsSection({
	values,
	setField,
	errors,
	wasPublished,
	savedSlug,
	serviceOptions
}: ProjectBasicsSectionProps) {
	const slugChanged = savedSlug !== null && values.slug !== savedSlug;
	const servicesInCategory = serviceOptions.filter(
		(option) => option.category === values.serviceCategory
	);

	const chooseCategory = (category: ServiceCategory) => {
		setField('serviceCategory', category);
		const current = serviceOptions.find(
			(option) => option.uuid === values.serviceUuid
		);
		if (current?.category !== category) setField('serviceUuid', '');
	};

	return (
		<SectionCard
			title={sections.basics}
			description={sections.basicsLead}
		>
			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					id="project-name"
					label={fields.name}
					error={errors.name}
					aside={charCount(values.name, limits.name)}
				>
					<Input
						id="project-name"
						value={values.name}
						onChange={(event) =>
							setField('name', event.target.value)
						}
						maxLength={limits.name}
						required
						aria-invalid={Boolean(errors.name)}
					/>
				</FormField>
				<FormField
					id="project-slug"
					label={fields.slug}
					hint={
						wasPublished && slugChanged
							? fields.slugLiveWarning
							: fields.slugHint
					}
					error={errors.slug}
				>
					<Input
						id="project-slug"
						value={values.slug}
						onChange={(event) =>
							setField('slug', event.target.value.toLowerCase())
						}
						maxLength={limits.slug}
						placeholder={fields.slugPlaceholder}
						aria-invalid={Boolean(errors.slug)}
					/>
				</FormField>
			</div>

			<FormField
				id="project-client"
				label={fields.client}
				hint={fields.clientHint}
				error={errors.client}
				aside={charCount(values.client, limits.client)}
			>
				<Input
					id="project-client"
					value={values.client}
					onChange={(event) => setField('client', event.target.value)}
					maxLength={limits.client}
					required
					aria-invalid={Boolean(errors.client)}
				/>
			</FormField>

			<div className="grid gap-5 sm:grid-cols-3">
				<FormField
					id="project-sector"
					label={fields.sector}
					error={errors.sector}
				>
					<Select
						value={values.sector}
						onValueChange={(value) =>
							setField('sector', value as ProjectSector)
						}
					>
						<SelectTrigger
							id="project-sector"
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(ProjectSector).map((option) => (
								<SelectItem
									key={option}
									value={option}
								>
									{sectorLabels[option]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
				<FormField
					id="project-service-category"
					label={fields.serviceCategory}
					hint={fields.serviceCategoryHint}
				>
					<Select
						value={values.serviceCategory}
						onValueChange={(value) =>
							chooseCategory(value as ServiceCategory)
						}
					>
						<SelectTrigger
							id="project-service-category"
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(ServiceCategory).map((option) => (
								<SelectItem
									key={option}
									value={option}
								>
									{serviceCategoryLabels[option]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
				<FormField
					id="project-year"
					label={fields.year}
					error={errors.year}
				>
					<Input
						id="project-year"
						type="number"
						inputMode="numeric"
						min={limits.firstYear}
						max={new Date().getFullYear() + 1}
						value={values.year}
						onChange={(event) =>
							setField('year', event.target.value)
						}
						required
						aria-invalid={Boolean(errors.year)}
					/>
				</FormField>
			</div>

			<FormField
				id="project-service"
				label={fields.service}
				hint={
					servicesInCategory.length
						? fields.serviceHint
						: fields.noServicesInCategory
				}
				error={errors.serviceUuid}
			>
				<Select
					value={values.serviceUuid}
					onValueChange={(value) => setField('serviceUuid', value)}
					disabled={!servicesInCategory.length}
				>
					<SelectTrigger
						id="project-service"
						className="w-full"
						aria-invalid={Boolean(errors.serviceUuid)}
					>
						<SelectValue placeholder={fields.servicePlaceholder} />
					</SelectTrigger>
					<SelectContent>
						{servicesInCategory.map((option) => (
							<SelectItem
								key={option.uuid}
								value={option.uuid}
							>
								{option.status === PublishStatus.DRAFT
									? fields.serviceDraft(option.title)
									: option.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FormField>

			<FormField
				id="project-summary"
				label={fields.summary}
				hint={fields.summaryHint}
				error={errors.summary}
				aside={charCount(values.summary, limits.summary)}
			>
				<Textarea
					id="project-summary"
					value={values.summary}
					onChange={(event) =>
						setField('summary', event.target.value)
					}
					maxLength={limits.summary}
					rows={2}
					required
					aria-invalid={Boolean(errors.summary)}
				/>
			</FormField>

			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					id="project-duration"
					label={fields.duration}
					error={errors.duration}
				>
					<Input
						id="project-duration"
						value={values.duration}
						onChange={(event) =>
							setField('duration', event.target.value)
						}
						maxLength={limits.duration}
						placeholder={fields.durationPlaceholder}
						required
						aria-invalid={Boolean(errors.duration)}
					/>
				</FormField>
				<FormField
					id="project-team"
					label={fields.team}
					error={errors.team}
				>
					<Input
						id="project-team"
						value={values.team}
						onChange={(event) =>
							setField('team', event.target.value)
						}
						maxLength={limits.team}
						placeholder={fields.teamPlaceholder}
						required
						aria-invalid={Boolean(errors.team)}
					/>
				</FormField>
			</div>
		</SectionCard>
	);
}
