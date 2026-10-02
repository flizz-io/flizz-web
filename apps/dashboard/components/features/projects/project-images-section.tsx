'use client';

import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { GalleryItem } from '@/components/features/projects/gallery-item';
import { SectionCard } from '@/components/features/projects/section-card';
import { ImageUploader } from '@/components/snippets/image-uploader/image-uploader';
import { uploadLimitsKb } from '@/constants/media';
import {
	projectFieldLimits as limits,
	projectFormMessages,
	projectImageSizes
} from '@/constants/projects';
import { moveItem } from '@/utils/list-items';
import {
	addGalleryImageService,
	ApiError,
	clearProjectCoverService,
	ImageFit,
	reorderGalleryService,
	retireGalleryImageService,
	updateGalleryCaptionService,
	uploadProjectCoverService,
	type ProjectImages
} from '@workspace/api-services';
import { Label } from '@workspace/ui/components/label';

interface ProjectImagesSectionProps {
	projectUuid: string;
	initial: ProjectImages;
	readOnly: boolean;
	/** After any change — the list's thumbnails and "last changed" move on. */
	onChanged: () => void;
}

const COVER_WIDTH = 480;
const COVER_HEIGHT = 300;

const { fields, sections, images: imageMessages } = projectFormMessages;

/**
 * Cover and gallery. Each change is saved straight away through the image
 * endpoints — separate from the form's Save, which covers the fields.
 */
export function ProjectImagesSection({
	projectUuid,
	initial,
	readOnly,
	onChanged
}: ProjectImagesSectionProps) {
	const [images, setImages] = useState(initial);
	const [busy, setBusy] = useState(false);
	const { cover, gallery } = images;
	const galleryFull = gallery.length >= limits.galleryMax;

	const accept = (next: ProjectImages, message: string) => {
		setImages(next);
		toast.success(message);
		onChanged();
	};

	/** For actions outside the uploader, which reports its own errors. */
	const run = async (task: () => Promise<void>) => {
		setBusy(true);
		try {
			await task();
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
		} finally {
			setBusy(false);
		}
	};

	const reorder = (index: number, offset: number) =>
		run(async () => {
			const order = moveItem(gallery, index, offset).map(
				(image) => image.uuid
			);
			accept(
				await reorderGalleryService(projectUuid, order),
				imageMessages.reordered
			);
		});

	return (
		<SectionCard
			title={sections.images}
			description={sections.imagesLead}
		>
			<div className="flex flex-col gap-3">
				<Label>{fields.cover}</Label>
				<div className="flex aspect-16/10 w-full max-w-md items-center justify-center overflow-hidden rounded-lg border bg-muted">
					{cover ? (
						<Image
							src={cover.url}
							alt=""
							width={COVER_WIDTH}
							height={COVER_HEIGHT}
							className="size-full object-contain"
							unoptimized
						/>
					) : (
						<ImageOff className="size-6 text-muted-foreground" />
					)}
				</div>
				<p className="text-xs text-muted-foreground">
					{fields.coverHint}
				</p>
				{readOnly ? null : (
					<ImageUploader
						width={projectImageSizes.cover.width}
						height={projectImageSizes.cover.height}
						fit={ImageFit.INSIDE}
						maxKb={uploadLimitsKb.projectImage}
						labels={imageMessages.coverLabels}
						hasImage={Boolean(cover)}
						onUpload={async (file, size) =>
							accept(
								await uploadProjectCoverService(
									projectUuid,
									file,
									size
								),
								imageMessages.coverSaved
							)
						}
						onRemove={async () =>
							accept(
								await clearProjectCoverService(projectUuid),
								imageMessages.coverRemoved
							)
						}
					/>
				)}
			</div>

			<div className="flex flex-col gap-3">
				<Label>{fields.gallery}</Label>
				<p className="text-xs text-muted-foreground">
					{fields.galleryHint(limits.galleryMax)}
				</p>
				{gallery.length ? (
					<ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{gallery.map((image, index) => (
							<GalleryItem
								key={image.uuid}
								image={image}
								index={index}
								count={gallery.length}
								busy={busy}
								readOnly={readOnly}
								onMove={(offset) => reorder(index, offset)}
								onRemove={() =>
									run(async () =>
										accept(
											await retireGalleryImageService(
												projectUuid,
												image.uuid
											),
											imageMessages.galleryRemoved
										)
									)
								}
								onCaption={(caption) =>
									run(async () =>
										accept(
											await updateGalleryCaptionService(
												projectUuid,
												image.uuid,
												caption
											),
											imageMessages.captionSaved
										)
									)
								}
							/>
						))}
					</ol>
				) : (
					<p className="text-sm text-muted-foreground">
						{fields.galleryEmpty}
					</p>
				)}
				{readOnly ? null : galleryFull ? (
					<p className="text-sm text-muted-foreground">
						{fields.galleryFull(limits.galleryMax)}
					</p>
				) : (
					<ImageUploader
						width={projectImageSizes.gallery.width}
						height={projectImageSizes.gallery.height}
						fit={ImageFit.INSIDE}
						maxKb={uploadLimitsKb.projectImage}
						labels={imageMessages.galleryLabels}
						hasImage={false}
						onUpload={async (file, size) =>
							accept(
								await addGalleryImageService(
									projectUuid,
									file,
									size
								),
								imageMessages.galleryAdded
							)
						}
					/>
				)}
			</div>
		</SectionCard>
	);
}
