import type { ReactNode } from 'react';

import { SearchResultPreview } from '@/components/features/services/search-result-preview';
import { FormField } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	searchSnippetTargets as targets,
	serviceFieldLimits as limits,
	serviceFormMessages,
	serviceSiteUrl
} from '@/constants/services';
import type { ServiceSectionProps } from '@/types/service-form';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

interface ServiceSeoSectionProps extends ServiceSectionProps {
	/** The share image controls — only once the service exists. */
	shareImage: ReactNode;
}

const { fields, sections } = serviceFormMessages;

/** "58 / 70", red once search results would cut it. */
function Counter({
	length,
	max,
	warn
}: {
	length: number;
	max: number;
	warn: boolean;
}) {
	return (
		<span className={cn(warn && 'font-medium text-destructive')}>
			{length} / {max}
		</span>
	);
}

/** SEO title and description, a search preview, and the share image. */
export function ServiceSeoSection({
	values,
	setField,
	errors,
	shareImage
}: ServiceSeoSectionProps) {
	const titleLength = values.seoTitle.trim().length;
	const descriptionLength = values.seoDescription.trim().length;

	return (
		<SectionCard
			title={sections.seo}
			description={sections.seoLead}
		>
			<FormField
				id="service-seo-title"
				label={fields.seoTitle}
				hint={fields.seoTitleHint(targets.titleMax)}
				error={errors.seoTitle}
				aside={
					<Counter
						length={titleLength}
						max={limits.seoTitle}
						warn={titleLength > targets.titleMax}
					/>
				}
			>
				<Input
					id="service-seo-title"
					value={values.seoTitle}
					onChange={(event) =>
						setField('seoTitle', event.target.value)
					}
					maxLength={limits.seoTitle}
					placeholder={values.title}
					aria-invalid={Boolean(errors.seoTitle)}
				/>
			</FormField>
			<FormField
				id="service-seo-description"
				label={fields.seoDescription}
				hint={fields.seoDescriptionHint(
					targets.descriptionMin,
					targets.descriptionMax
				)}
				error={errors.seoDescription}
				aside={
					<Counter
						length={descriptionLength}
						max={limits.seoDescription}
						warn={
							descriptionLength > 0 &&
							(descriptionLength < targets.descriptionMin ||
								descriptionLength > targets.descriptionMax)
						}
					/>
				}
			>
				<Textarea
					id="service-seo-description"
					value={values.seoDescription}
					onChange={(event) =>
						setField('seoDescription', event.target.value)
					}
					maxLength={limits.seoDescription}
					rows={3}
					placeholder={values.summary}
					aria-invalid={Boolean(errors.seoDescription)}
				/>
			</FormField>
			<SearchResultPreview
				url={serviceSiteUrl(values.slug || '…')}
				title={values.seoTitle.trim() || values.title}
				description={values.seoDescription.trim() || values.summary}
			/>
			{shareImage}
		</SectionCard>
	);
}
