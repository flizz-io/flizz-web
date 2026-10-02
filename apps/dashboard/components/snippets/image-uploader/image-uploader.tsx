'use client';

import { ImageUp, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { toast } from 'sonner';

import {
	acceptedImageTypes,
	defaultImageSize,
	maxUploadKb,
	uploaderMessages
} from '@/constants/media';
import { ApiError } from '@/utils/api-error';
import { Button } from '@workspace/ui/components/button';

type ImageFit = 'cover' | 'inside';

interface ImageUploaderProps {
	/** Output width in px (64–2048). Default 512. */
	width?: number;
	/** Output height in px (64–2048). Default 512. */
	height?: number;
	/** `cover` crops to fill; `inside` keeps the whole image. Default `cover`. */
	fit?: ImageFit;
	/** Whether there's an uploaded image to replace or remove. */
	hasImage: boolean;
	/** Uploads the chosen file — resolves when the parent has the new image. */
	onUpload: (
		file: File,
		size: { width: number; height: number; fit: ImageFit }
	) => Promise<void>;
	/** Clears the image; omit to hide "Remove". */
	onRemove?: () => Promise<void>;
}

/**
 * Pick-and-upload controls for one image. The output size is a prop (512×512
 * cover by default) sent with the file; the API resizes and stores it through
 * the shared media library. Over-size files are refused here before any
 * upload — the API enforces the same limit.
 */
export function ImageUploader({
	width = defaultImageSize.width,
	height = defaultImageSize.height,
	fit = defaultImageSize.fit,
	hasImage,
	onUpload,
	onRemove
}: ImageUploaderProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [pending, setPending] = useState(false);

	const run = async (task: () => Promise<void>) => {
		setPending(true);
		try {
			await task();
		} catch (error) {
			toast.error(
				error instanceof ApiError ? error.message : String(error)
			);
		} finally {
			setPending(false);
		}
	};

	const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		// Reset so choosing the same file again still fires a change.
		event.target.value = '';
		if (!file) return;

		const kb = Math.ceil(file.size / 1024);
		if (kb > maxUploadKb) {
			toast.error(uploaderMessages.tooLarge(kb));
			return;
		}

		await run(() => onUpload(file, { width, height, fit }));
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					variant="outline"
					disabled={pending}
					onClick={() => inputRef.current?.click()}
				>
					<ImageUp />
					{pending
						? uploaderMessages.uploading
						: hasImage
							? uploaderMessages.replace
							: uploaderMessages.choose}
				</Button>
				{hasImage && onRemove ? (
					<Button
						type="button"
						variant="ghost"
						disabled={pending}
						onClick={() => run(onRemove)}
					>
						<Trash2 />
						{uploaderMessages.remove}
					</Button>
				) : null}
			</div>
			<p className="text-xs text-muted-foreground">
				{uploaderMessages.hint(width, height)}
			</p>
			<input
				ref={inputRef}
				type="file"
				accept={acceptedImageTypes}
				className="hidden"
				onChange={handleFile}
			/>
		</div>
	);
}
