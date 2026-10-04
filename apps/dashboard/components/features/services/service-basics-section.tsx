import {
	FormField,
	charCount
} from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	serviceCategoryLabels,
	serviceFieldLimits as limits,
	serviceFormMessages
} from '@/constants/services';
import type { ServiceSectionProps } from '@/types/service-form';
import { ServiceCategory } from '@workspace/api-services';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';

const { fields, sections } = serviceFormMessages;

/** Title, slug, category and summary. */
export function ServiceBasicsSection({
	values,
	setField,
	errors
}: ServiceSectionProps) {
	return (
		<SectionCard
			title={sections.basics}
			description={sections.basicsLead}
		>
			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					id="service-title"
					label={fields.title}
					hint={fields.titleHint}
					error={errors.title}
					aside={charCount(values.title, limits.title)}
				>
					<Input
						id="service-title"
						value={values.title}
						onChange={(event) =>
							setField('title', event.target.value)
						}
						maxLength={limits.title}
						required
						aria-invalid={Boolean(errors.title)}
					/>
				</FormField>
				<FormField
					id="service-slug"
					label={fields.slug}
					hint={fields.slugHint}
					error={errors.slug}
				>
					<Input
						id="service-slug"
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
				id="service-category"
				label={fields.category}
				hint={fields.categoryHint}
				error={errors.category}
				className="sm:max-w-xs"
			>
				<Select
					value={values.category}
					onValueChange={(value) =>
						setField('category', value as ServiceCategory)
					}
				>
					<SelectTrigger
						id="service-category"
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
				id="service-summary"
				label={fields.summary}
				hint={fields.summaryHint}
				error={errors.summary}
				aside={charCount(values.summary, limits.summary)}
			>
				<Textarea
					id="service-summary"
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
		</SectionCard>
	);
}
