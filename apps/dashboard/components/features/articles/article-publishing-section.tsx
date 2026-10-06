'use client';

import { FormField } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { VisibilityBadge } from '@/components/snippets/visibility-badge/visibility-badge';
import { articleFormMessages } from '@/constants/articles';
import { publishStatusLabels } from '@/constants/services';
import { useIsClient } from '@/hooks/use-is-client';
import type { ArticleSectionProps } from '@/types/article-form';
import { isoToLocalInput, localInputToIso } from '@/utils/local-date-time';
import { ArticleVisibility, PublishStatus } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';

interface ArticlePublishingSectionProps extends ArticleSectionProps {
	/** A new article is always created as a Draft. */
	isNew: boolean;
}

const { fields, sections } = articleFormMessages;

/** What the website would do with these values — before saving. */
function previewVisibility(status: PublishStatus, publishAt: string) {
	if (status === PublishStatus.DRAFT) return ArticleVisibility.DRAFT;

	return publishAt && new Date(publishAt).getTime() > Date.now()
		? ArticleVisibility.SCHEDULED
		: ArticleVisibility.LIVE;
}

/** Status and publish date. */
export function ArticlePublishingSection({
	values,
	setField,
	errors,
	isNew
}: ArticlePublishingSectionProps) {
	// The date input shows local time, which the server can't know.
	const isClient = useIsClient();

	return (
		<SectionCard
			title={sections.publishing}
			description={sections.publishingLead}
		>
			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					id="article-status"
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
							setField('status', value as PublishStatus)
						}
						disabled={isNew}
					>
						<SelectTrigger
							id="article-status"
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
				<FormField
					id="article-publish-at"
					label={fields.publishAt}
					hint={fields.publishAtHint}
					error={errors.publishAt}
				>
					<div className="flex gap-2">
						<Input
							id="article-publish-at"
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
		</SectionCard>
	);
}
