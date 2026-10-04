'use client';

import Image from 'next/image';
import { useState } from 'react';

import { ListItemControls } from '@/components/snippets/list-item-controls/list-item-controls';
import {
	projectFieldLimits as limits,
	projectFormMessages
} from '@/constants/projects';
import type { ProjectGalleryImage } from '@workspace/api-services';
import { Input } from '@workspace/ui/components/input';

const PREVIEW_WIDTH = 320;
const PREVIEW_HEIGHT = 240;

interface GalleryItemProps {
	image: ProjectGalleryImage;
	index: number;
	count: number;
	busy: boolean;
	readOnly: boolean;
	onMove: (offset: number) => void;
	onRemove: () => void;
	/** Saves the caption — called on blur, only when it changed. */
	onCaption: (caption: string | null) => void;
}

/** One gallery image: preview, caption, and its place in the order. */
export function GalleryItem({
	image,
	index,
	count,
	busy,
	readOnly,
	onMove,
	onRemove,
	onCaption
}: GalleryItemProps) {
	const [caption, setCaption] = useState(image.caption ?? '');
	const { fields } = projectFormMessages;
	const label = `${fields.gallery} ${index + 1}`;

	const commit = () => {
		const next = caption.trim() || null;
		if (next !== image.caption) onCaption(next);
	};

	return (
		<li className="flex flex-col gap-2 rounded-lg border p-2">
			<div className="aspect-4/3 overflow-hidden rounded-md bg-muted">
				<Image
					src={image.url}
					alt={image.caption ?? label}
					width={PREVIEW_WIDTH}
					height={PREVIEW_HEIGHT}
					className="size-full object-contain"
					unoptimized
				/>
			</div>
			<Input
				value={caption}
				onChange={(event) => setCaption(event.target.value)}
				onBlur={commit}
				maxLength={limits.caption}
				placeholder={fields.captionPlaceholder}
				aria-label={`${fields.caption}: ${label}`}
				disabled={readOnly || busy}
			/>
			{readOnly ? null : (
				<div className="flex justify-end">
					<ListItemControls
						index={index}
						count={count}
						itemLabel={label}
						onMove={onMove}
						onRemove={onRemove}
						disabled={busy}
					/>
				</div>
			)}
		</li>
	);
}
