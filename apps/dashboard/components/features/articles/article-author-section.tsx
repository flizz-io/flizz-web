import { FormField } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { articleFormMessages } from '@/constants/articles';
import { allFilterValue } from '@/constants/filters';
import type { ArticleSectionProps } from '@/types/article-form';
import type { ArticleAuthorOption } from '@workspace/api-services';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';

interface ArticleAuthorSectionProps extends ArticleSectionProps {
	authors: ArticleAuthorOption[];
}

const { fields, sections } = articleFormMessages;

/** The byline — someone from the About page, or the company. */
export function ArticleAuthorSection({
	values,
	setField,
	errors,
	authors
}: ArticleAuthorSectionProps) {
	// A Select item can't have an empty value, so "no author" has a sentinel.
	const value = values.authorUuid || allFilterValue;

	return (
		<SectionCard
			title={sections.author}
			description={sections.authorLead}
		>
			<FormField
				id="article-author"
				label={fields.author}
				hint={authors.length ? undefined : fields.noAuthors}
				error={errors.authorUuid}
				className="sm:max-w-sm"
			>
				<Select
					value={value}
					onValueChange={(next) =>
						setField(
							'authorUuid',
							next === allFilterValue ? '' : next
						)
					}
				>
					<SelectTrigger
						id="article-author"
						className="w-full"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={allFilterValue}>
							{fields.noAuthor}
						</SelectItem>
						{authors.map((author) => (
							<SelectItem
								key={author.uuid}
								value={author.uuid}
							>
								{author.designation
									? `${author.name} — ${author.designation}`
									: author.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FormField>
		</SectionCard>
	);
}
