import type { ReactNode } from 'react';

import { FormField } from '@/components/snippets/form-field/form-field';
import { SearchResultPreview } from '@/components/snippets/search-result-preview/search-result-preview';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { SeoCounter } from '@/components/snippets/seo-counter/seo-counter';
import {
	articleFieldLimits as limits,
	articleFormMessages,
	articleSiteUrl
} from '@/constants/articles';
import { searchSnippetTargets as targets } from '@/constants/seo';
import type { ArticleSectionProps } from '@/types/article-form';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';

interface ArticleSeoSectionProps extends ArticleSectionProps {
	/** The share image controls — only once the article exists. */
	shareImage: ReactNode;
}

const { fields, sections } = articleFormMessages;

/** SEO title and description, a search preview, the share image, noindex. */
export function ArticleSeoSection({
	values,
	setField,
	errors,
	shareImage
}: ArticleSeoSectionProps) {
	const titleLength = values.seoTitle.trim().length;
	const descriptionLength = values.seoDescription.trim().length;

	return (
		<SectionCard
			title={sections.seo}
			description={sections.seoLead}
		>
			<FormField
				id="article-seo-title"
				label={fields.seoTitle}
				hint={fields.seoTitleHint(targets.titleMax)}
				error={errors.seoTitle}
				aside={
					<SeoCounter
						length={titleLength}
						max={limits.seoTitle}
						warn={titleLength > targets.titleMax}
					/>
				}
			>
				<Input
					id="article-seo-title"
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
				id="article-seo-description"
				label={fields.seoDescription}
				hint={fields.seoDescriptionHint(
					targets.descriptionMin,
					targets.descriptionMax
				)}
				error={errors.seoDescription}
				aside={
					<SeoCounter
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
					id="article-seo-description"
					value={values.seoDescription}
					onChange={(event) =>
						setField('seoDescription', event.target.value)
					}
					maxLength={limits.seoDescription}
					rows={3}
					placeholder={values.excerpt}
					aria-invalid={Boolean(errors.seoDescription)}
				/>
			</FormField>
			<SearchResultPreview
				url={articleSiteUrl(values.slug || '…')}
				title={values.seoTitle.trim() || values.title}
				description={values.seoDescription.trim() || values.excerpt}
			/>
			{shareImage}
			<div className="flex items-start gap-3 rounded-lg border p-4">
				<Checkbox
					id="article-noindex"
					checked={values.noindex}
					onCheckedChange={(checked) =>
						setField('noindex', checked === true)
					}
					className="mt-0.5"
				/>
				<div className="flex flex-col gap-1">
					<Label htmlFor="article-noindex">{fields.noindex}</Label>
					<p className="text-xs text-muted-foreground">
						{fields.noindexHint}
					</p>
				</div>
			</div>
		</SectionCard>
	);
}
