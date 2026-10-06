'use client';

import { toast } from 'sonner';

import { FieldError } from '@/components/snippets/form-field/form-field';
import { ImageUploader } from '@/components/snippets/image-uploader/image-uploader';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { articleFormMessages, articleImageSizes } from '@/constants/articles';
import { uploadLimitsKb } from '@/constants/media';
import type { ArticleSectionProps } from '@/types/article-form';
import { bodyErrorsOf } from '@/utils/article-form';
import {
	ImageFit,
	uploadArticleBodyImageService
} from '@workspace/api-services';
import { BlockEditor } from '@workspace/text-editor';

interface ArticleBodySectionProps extends ArticleSectionProps {
	/** Body images upload to a saved article; `null` while it's new. */
	articleUuid: string | null;
	readOnly: boolean;
}

const { fields, sections, images } = articleFormMessages;

/** The block editor, with this app's uploader in its image blocks. */
export function ArticleBodySection({
	values,
	setField,
	errors,
	articleUuid,
	readOnly
}: ArticleBodySectionProps) {
	return (
		<SectionCard
			title={sections.body}
			description={sections.bodyLead}
		>
			<BlockEditor
				blocks={values.body}
				onChange={(body) => setField('body', body)}
				readOnly={readOnly}
				errors={bodyErrorsOf(errors)}
				renderImageUpload={
					articleUuid
						? (slot) => (
								<ImageUploader
									width={articleImageSizes.body.width}
									height={articleImageSizes.body.height}
									fit={ImageFit.INSIDE}
									maxKb={uploadLimitsKb.articleImage}
									labels={images.bodyLabels}
									hasImage={slot.hasImage}
									onUpload={async (file, size) => {
										const image =
											await uploadArticleBodyImageService(
												articleUuid,
												file,
												size
											);
										slot.onUploaded(image);
										toast.success(images.bodyUploaded);
									}}
									onRemove={async () => slot.onRemove()}
								/>
							)
						: undefined
				}
			/>
			{articleUuid || readOnly ? null : (
				<p className="text-xs text-muted-foreground">
					{fields.bodyImagesAfterCreate}
				</p>
			)}
			<FieldError message={errors.body} />
		</SectionCard>
	);
}
