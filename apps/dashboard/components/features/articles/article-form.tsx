'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { ArticleAuthorSection } from '@/components/features/articles/article-author-section';
import { ArticleBasicsSection } from '@/components/features/articles/article-basics-section';
import { ArticleBodySection } from '@/components/features/articles/article-body-section';
import { ArticleImageField } from '@/components/features/articles/article-image-field';
import { ArticlePublishingSection } from '@/components/features/articles/article-publishing-section';
import { ArticleSeoSection } from '@/components/features/articles/article-seo-section';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	articleFormMessages,
	articleImageSizes,
	articlePath
} from '@/constants/articles';
import { shareImageSize } from '@/constants/seo';
import type { ArticleFormValues, SetArticleField } from '@/types/article-form';
import {
	articleToValues,
	emptyArticleValues,
	toCreateArticlePayload,
	toUpdateArticlePayload
} from '@/utils/article-form';
import {
	ApiError,
	clearArticleCoverService,
	clearArticleOgImageService,
	createArticleService,
	updateArticleService,
	uploadArticleCoverService,
	uploadArticleOgImageService,
	type ArticleAuthorOption,
	type ArticleRecord,
	type ArticleTag
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

interface ArticleFormProps {
	/** Omitted for a new article. */
	article?: ArticleRecord;
	/** Edit (or Create, for a new one). Without it the form is read-only. */
	canSave: boolean;
	authors: ArticleAuthorOption[];
	tagSuggestions: ArticleTag[];
}

const messages = articleFormMessages;

/**
 * The whole article on one page. Fields and the body save together with
 * Save; the cover and share image save as they change, once it exists.
 */
export function ArticleForm({
	article,
	canSave,
	authors,
	tagSuggestions
}: ArticleFormProps) {
	const router = useRouter();
	const [saved, setSaved] = useState(article);
	const [values, setValues] = useState<ArticleFormValues>(() =>
		article ? articleToValues(article) : emptyArticleValues()
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [pending, setPending] = useState(false);
	const readOnly = !canSave;

	const setField = useCallback<SetArticleField>((field, value) => {
		setValues((current) => ({ ...current, [field]: value }));
	}, []);

	const refresh = useCallback(() => router.refresh(), [router]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (readOnly) return;
		setPending(true);
		setErrors({});
		try {
			if (saved) {
				const next = await updateArticleService(
					saved.uuid,
					toUpdateArticlePayload(values)
				);
				setSaved(next);
				setValues(articleToValues(next));
				toast.success(messages.saved(next.title));
				router.refresh();
			} else {
				const created = await createArticleService(
					toCreateArticlePayload(values)
				);
				toast.success(messages.created(created.title));
				router.push(articlePath(created.uuid));
			}
		} catch (error) {
			if (!(error instanceof ApiError)) throw error;
			setErrors(error.fieldErrors);
			toast.error(
				Object.keys(error.fieldErrors).length
					? messages.fixErrors
					: error.message
			);
		} finally {
			setPending(false);
		}
	};

	const sectionProps = { values, setField, errors };

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			className="flex max-w-4xl flex-col gap-6"
		>
			<fieldset
				disabled={readOnly || pending}
				className="flex min-w-0 flex-col gap-6"
			>
				<ArticleBasicsSection
					{...sectionProps}
					tagSuggestions={tagSuggestions}
				/>
				<ArticleAuthorSection
					{...sectionProps}
					authors={authors}
				/>
				<SectionCard
					title={messages.sections.cover}
					description={messages.sections.coverLead}
				>
					{saved ? (
						<ArticleImageField
							label={messages.fields.cover}
							hint={messages.sections.coverLead}
							initial={saved.cover}
							pick={(media) => media.cover}
							width={articleImageSizes.cover.width}
							height={articleImageSizes.cover.height}
							aspectClass="aspect-video"
							labels={messages.images.coverLabels}
							savedMessage={messages.images.coverSaved}
							removedMessage={messages.images.coverRemoved}
							readOnly={readOnly}
							upload={(file, size) =>
								uploadArticleCoverService(
									saved.uuid,
									file,
									size
								)
							}
							remove={() => clearArticleCoverService(saved.uuid)}
							onChanged={refresh}
						/>
					) : (
						<p className="text-sm text-muted-foreground">
							{messages.fields.coverAfterCreate}
						</p>
					)}
				</SectionCard>
				<ArticleBodySection
					{...sectionProps}
					articleUuid={saved?.uuid ?? null}
					readOnly={readOnly}
				/>
				<ArticleSeoSection
					{...sectionProps}
					shareImage={
						saved ? (
							<ArticleImageField
								label={messages.fields.shareImage}
								hint={messages.fields.shareImageHint}
								initial={saved.ogImage}
								pick={(media) => media.ogImage}
								width={shareImageSize.width}
								height={shareImageSize.height}
								aspectClass="aspect-1200/630"
								labels={messages.images.shareLabels}
								savedMessage={messages.images.shareSaved}
								removedMessage={messages.images.shareRemoved}
								readOnly={readOnly}
								upload={(file, size) =>
									uploadArticleOgImageService(
										saved.uuid,
										file,
										size
									)
								}
								remove={() =>
									clearArticleOgImageService(saved.uuid)
								}
								onChanged={refresh}
							/>
						) : (
							<p className="text-sm text-muted-foreground">
								{messages.fields.shareImageAfterCreate}
							</p>
						)
					}
				/>
				<ArticlePublishingSection
					{...sectionProps}
					isNew={!saved}
				/>
			</fieldset>

			{readOnly ? null : (
				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={pending}
					>
						{pending
							? messages.saving
							: saved
								? messages.save
								: messages.create}
					</Button>
				</div>
			)}
		</form>
	);
}
