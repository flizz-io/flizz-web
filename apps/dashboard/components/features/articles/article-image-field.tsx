'use client';

import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { ImageUploader } from '@/components/snippets/image-uploader/image-uploader';
import type { UploaderLabels } from '@/constants/media';
import { uploadLimitsKb } from '@/constants/media';
import {
	ImageFit,
	type ArticleMedia,
	type ProjectImage
} from '@workspace/api-services';
import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';

const PREVIEW_WIDTH = 480;
const PREVIEW_HEIGHT = 270;

interface ArticleImageFieldProps {
	label: string;
	hint: string;
	initial: ProjectImage | null;
	/** Which of the two slots this field shows from the API's answer. */
	pick: (media: ArticleMedia) => ProjectImage | null;
	width: number;
	height: number;
	/** Tailwind aspect class for the preview frame. */
	aspectClass: string;
	labels: UploaderLabels;
	savedMessage: string;
	removedMessage: string;
	readOnly: boolean;
	upload: (
		file: File,
		size: { width: number; height: number; fit: ImageFit }
	) => Promise<ArticleMedia>;
	remove: () => Promise<ArticleMedia>;
	/** After a change — "last changed" moves on. */
	onChanged: () => void;
}

/** The cover or the share image — saved as it changes, apart from Save. */
export function ArticleImageField({
	label,
	hint,
	initial,
	pick,
	width,
	height,
	aspectClass,
	labels,
	savedMessage,
	removedMessage,
	readOnly,
	upload,
	remove,
	onChanged
}: ArticleImageFieldProps) {
	const [image, setImage] = useState(initial);

	const accept = (media: ArticleMedia, message: string) => {
		setImage(pick(media));
		toast.success(message);
		onChanged();
	};

	return (
		<div className="flex flex-col gap-3">
			<Label>{label}</Label>
			<div
				className={cn(
					'flex w-full max-w-md items-center justify-center overflow-hidden rounded-lg border bg-muted',
					aspectClass
				)}
			>
				{image ? (
					<Image
						src={image.url}
						alt=""
						width={PREVIEW_WIDTH}
						height={PREVIEW_HEIGHT}
						className="size-full object-cover"
						unoptimized
					/>
				) : (
					<ImageOff className="size-6 text-muted-foreground" />
				)}
			</div>
			<p className="text-xs text-muted-foreground">{hint}</p>
			{readOnly ? null : (
				<ImageUploader
					width={width}
					height={height}
					fit={ImageFit.COVER}
					maxKb={uploadLimitsKb.articleImage}
					labels={labels}
					hasImage={Boolean(image)}
					onUpload={async (file, size) =>
						accept(await upload(file, size), savedMessage)
					}
					onRemove={async () =>
						accept(await remove(), removedMessage)
					}
				/>
			)}
		</div>
	);
}
