import { ArticleTagsField } from '@/components/features/articles/article-tags-field';
import {
	FormField,
	charCount
} from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	articleCategoryLabels,
	articleFieldLimits as limits,
	articleFormMessages
} from '@/constants/articles';
import type { ArticleSectionProps } from '@/types/article-form';
import { ArticleCategory, type ArticleTag } from '@workspace/api-services';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';

interface ArticleBasicsSectionProps extends ArticleSectionProps {
	tagSuggestions: ArticleTag[];
}

const { fields, sections } = articleFormMessages;

/** Title, slug, excerpt, category and tags. */
export function ArticleBasicsSection({
	values,
	setField,
	errors,
	tagSuggestions
}: ArticleBasicsSectionProps) {
	return (
		<SectionCard
			title={sections.basics}
			description={sections.basicsLead}
		>
			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					id="article-title"
					label={fields.title}
					hint={fields.titleHint}
					error={errors.title}
					aside={charCount(values.title, limits.title)}
				>
					<Input
						id="article-title"
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
					id="article-slug"
					label={fields.slug}
					hint={fields.slugHint}
					error={errors.slug}
				>
					<Input
						id="article-slug"
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
				id="article-excerpt"
				label={fields.excerpt}
				hint={fields.excerptHint}
				error={errors.excerpt}
				aside={charCount(values.excerpt, limits.excerpt)}
			>
				<Textarea
					id="article-excerpt"
					value={values.excerpt}
					onChange={(event) =>
						setField('excerpt', event.target.value)
					}
					maxLength={limits.excerpt}
					rows={2}
					required
					aria-invalid={Boolean(errors.excerpt)}
				/>
			</FormField>

			<div className="grid gap-5 sm:grid-cols-[16rem_1fr]">
				<FormField
					id="article-category"
					label={fields.category}
					error={errors.category}
				>
					<Select
						value={values.category}
						onValueChange={(value) =>
							setField('category', value as ArticleCategory)
						}
					>
						<SelectTrigger
							id="article-category"
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(ArticleCategory).map((option) => (
								<SelectItem
									key={option}
									value={option}
								>
									{articleCategoryLabels[option]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
				<ArticleTagsField
					tags={values.tags}
					onChange={(tags) => setField('tags', tags)}
					suggestions={tagSuggestions}
					error={errors.tags}
				/>
			</div>
		</SectionCard>
	);
}
