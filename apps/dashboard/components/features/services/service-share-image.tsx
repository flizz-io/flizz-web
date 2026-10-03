'use client';

import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { ImageUploader } from '@/components/snippets/image-uploader/image-uploader';
import { uploadLimitsKb } from '@/constants/media';
import { serviceFormMessages, shareImageSize } from '@/constants/services';
import {
	clearServiceOgImageService,
	ImageFit,
	uploadServiceOgImageService,
	type ServiceRecord
} from '@workspace/api-services';
import { Label } from '@workspace/ui/components/label';

interface ServiceShareImageProps {
	serviceUuid: string;
	initial: ServiceRecord['ogImage'];
	readOnly: boolean;
	/** After a change — "last changed" moves on. */
	onChanged: () => void;
}

const PREVIEW_WIDTH = 480;
const PREVIEW_HEIGHT = 252;

const { fields, images } = serviceFormMessages;

/** The 1200 × 630 share image — saved as it changes, apart from Save. */
export function ServiceShareImage({
	serviceUuid,
	initial,
	readOnly,
	onChanged
}: ServiceShareImageProps) {
	const [image, setImage] = useState(initial);

	const accept = (next: ServiceRecord, message: string) => {
		setImage(next.ogImage);
		toast.success(message);
		onChanged();
	};

	return (
		<div className="flex flex-col gap-3">
			<Label>{fields.shareImage}</Label>
			<div className="flex aspect-1200/630 w-full max-w-md items-center justify-center overflow-hidden rounded-lg border bg-muted">
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
			<p className="text-xs text-muted-foreground">
				{fields.shareImageHint}
			</p>
			{readOnly ? null : (
				<ImageUploader
					width={shareImageSize.width}
					height={shareImageSize.height}
					fit={ImageFit.COVER}
					maxKb={uploadLimitsKb.shareImage}
					labels={images.labels}
					hasImage={Boolean(image)}
					onUpload={async (file, size) =>
						accept(
							await uploadServiceOgImageService(
								serviceUuid,
								file,
								size
							),
							images.saved
						)
					}
					onRemove={async () =>
						accept(
							await clearServiceOgImageService(serviceUuid),
							images.removed
						)
					}
				/>
			)}
		</div>
	);
}
