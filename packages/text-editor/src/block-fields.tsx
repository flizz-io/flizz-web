import Image from 'next/image';
import type { ReactNode } from 'react';

import {
	blockEditorMessages,
	blockLimits,
	imageAspectLabels
} from './constants';
import { parseInlineMarkup } from './inline-markup';
import { InlinePreview } from './inline-preview';
import type { BodyImageUploadSlot, EditorBlock, EditorImage } from './types';
import { ArticleBlockType, ArticleImageAspect } from '@workspace/api-services';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';

const messages = blockEditorMessages;
const limits = blockLimits;

const PREVIEW_WIDTH = 480;
const PREVIEW_HEIGHT = 270;

export interface BlockFieldsProps<T extends EditorBlock = EditorBlock> {
	block: T;
	/** Unique per block — the base for the inputs' ids. */
	id: string;
	readOnly: boolean;
	onChange: (block: T) => void;
	renderImageUpload?: (slot: BodyImageUploadSlot) => ReactNode;
}

interface MarkupFieldProps {
	id: string;
	label: string;
	value: string;
	maxLength: number;
	rows: number;
	readOnly: boolean;
	onChange: (value: string) => void;
	/** Lists preview each line as its own item. */
	multiline?: boolean;
}

/** A text box that takes inline marks, with the preview under it. */
function MarkupField({
	id,
	label,
	value,
	maxLength,
	rows,
	readOnly,
	onChange,
	multiline
}: MarkupFieldProps) {
	const lines = multiline
		? value.split(/\r?\n/u).filter((line) => line.trim())
		: [value];

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Textarea
				id={id}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				maxLength={maxLength}
				rows={rows}
				readOnly={readOnly}
			/>
			<p className="text-xs text-muted-foreground">
				{messages.markupHint}
			</p>
			{value.trim() ? (
				<div className="rounded-md bg-muted/40 px-3 py-2 text-sm">
					<p className="mb-1 text-xs text-muted-foreground">
						{messages.preview}
					</p>
					{multiline ? (
						<ul className="list-disc pl-5">
							{lines.map((line, index) => (
								// Lines have no identity beyond their position.

								<li key={index}>
									<InlinePreview
										content={parseInlineMarkup(line)}
									/>
								</li>
							))}
						</ul>
					) : (
						<p>
							<InlinePreview content={parseInlineMarkup(value)} />
						</p>
					)}
				</div>
			) : null}
		</div>
	);
}

function ImageFields({
	block,
	id,
	readOnly,
	onChange,
	renderImageUpload
}: BlockFieldsProps<EditorImage>) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex aspect-video w-full max-w-md items-center justify-center overflow-hidden rounded-lg border bg-muted">
				{block.src ? (
					<Image
						src={block.src}
						alt=""
						width={PREVIEW_WIDTH}
						height={PREVIEW_HEIGHT}
						className="size-full object-contain"
						unoptimized
					/>
				) : (
					<p className="px-4 text-center text-xs text-muted-foreground">
						{messages.imagePending}
					</p>
				)}
			</div>
			{readOnly ? null : renderImageUpload ? (
				renderImageUpload({
					hasImage: Boolean(block.mediaUuid),
					onUploaded: (image) =>
						onChange({
							...block,
							mediaUuid: image.uuid,
							src: image.url
						}),
					onRemove: () =>
						onChange({
							...block,
							mediaUuid: undefined,
							src: undefined
						})
				})
			) : (
				<p className="text-xs text-muted-foreground">
					{messages.imageUploadUnavailable}
				</p>
			)}
			<div className="flex flex-col gap-2">
				<Label htmlFor={`${id}-alt`}>{messages.imageAlt}</Label>
				<Input
					id={`${id}-alt`}
					value={block.alt}
					onChange={(event) =>
						onChange({ ...block, alt: event.target.value })
					}
					maxLength={limits.imageAlt}
					readOnly={readOnly}
				/>
			</div>
			<div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
				<div className="flex flex-col gap-2">
					<Label htmlFor={`${id}-caption`}>
						{messages.imageCaption}
					</Label>
					<Input
						id={`${id}-caption`}
						value={block.caption}
						onChange={(event) =>
							onChange({ ...block, caption: event.target.value })
						}
						maxLength={limits.imageCaption}
						readOnly={readOnly}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor={`${id}-aspect`}>
						{messages.imageAspect}
					</Label>
					<Select
						value={block.aspect}
						onValueChange={(value) =>
							onChange({
								...block,
								aspect: value as ArticleImageAspect
							})
						}
						disabled={readOnly}
					>
						<SelectTrigger
							id={`${id}-aspect`}
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.values(ArticleImageAspect).map((aspect) => (
								<SelectItem
									key={aspect}
									value={aspect}
								>
									{imageAspectLabels[aspect]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}

/** The inputs for one block, by type. */
export function BlockFields(props: BlockFieldsProps) {
	const { block, id, readOnly, onChange } = props;

	switch (block.type) {
		case ArticleBlockType.PARAGRAPH:
			return (
				<MarkupField
					id={`${id}-text`}
					label={messages.text}
					value={block.markup}
					maxLength={limits.paragraph}
					rows={4}
					readOnly={readOnly}
					onChange={(markup) => onChange({ ...block, markup })}
				/>
			);
		case ArticleBlockType.HEADING:
			return (
				<div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
					<div className="flex flex-col gap-2">
						<Label htmlFor={`${id}-level`}>
							{messages.headingLevel}
						</Label>
						<Select
							value={String(block.level)}
							onValueChange={(value) =>
								onChange({
									...block,
									level: value === '3' ? 3 : 2
								})
							}
							disabled={readOnly}
						>
							<SelectTrigger
								id={`${id}-level`}
								className="w-full"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{([2, 3] as const).map((level) => (
									<SelectItem
										key={level}
										value={String(level)}
									>
										{messages.headingLevels[level]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor={`${id}-text`}>{messages.text}</Label>
						<Input
							id={`${id}-text`}
							value={block.text}
							onChange={(event) =>
								onChange({ ...block, text: event.target.value })
							}
							maxLength={limits.heading}
							readOnly={readOnly}
						/>
					</div>
				</div>
			);
		case ArticleBlockType.LIST:
			return (
				<div className="flex flex-col gap-3">
					<MarkupField
						id={`${id}-items`}
						label={messages.listItems}
						value={block.markup}
						maxLength={limits.paragraph}
						rows={5}
						readOnly={readOnly}
						multiline
						onChange={(markup) => onChange({ ...block, markup })}
					/>
					<div className="flex items-center gap-2">
						<Checkbox
							id={`${id}-ordered`}
							checked={block.ordered}
							onCheckedChange={(checked) =>
								onChange({
									...block,
									ordered: checked === true
								})
							}
							disabled={readOnly}
						/>
						<Label htmlFor={`${id}-ordered`}>
							{messages.listOrdered}
						</Label>
					</div>
				</div>
			);
		case ArticleBlockType.QUOTE:
			return (
				<div className="flex flex-col gap-3">
					<MarkupField
						id={`${id}-text`}
						label={messages.quoteText}
						value={block.markup}
						maxLength={limits.quote}
						rows={3}
						readOnly={readOnly}
						onChange={(markup) => onChange({ ...block, markup })}
					/>
					<div className="flex flex-col gap-2">
						<Label htmlFor={`${id}-attribution`}>
							{messages.attribution}
						</Label>
						<Input
							id={`${id}-attribution`}
							value={block.attribution}
							onChange={(event) =>
								onChange({
									...block,
									attribution: event.target.value
								})
							}
							maxLength={limits.attribution}
							readOnly={readOnly}
						/>
					</div>
				</div>
			);
		case ArticleBlockType.CODE:
			return (
				<div className="flex flex-col gap-3">
					<div className="flex max-w-60 flex-col gap-2">
						<Label htmlFor={`${id}-language`}>
							{messages.codeLanguage}
						</Label>
						<Input
							id={`${id}-language`}
							value={block.language}
							onChange={(event) =>
								onChange({
									...block,
									language: event.target.value
								})
							}
							maxLength={limits.codeLanguage}
							readOnly={readOnly}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor={`${id}-code`}>{messages.code}</Label>
						<Textarea
							id={`${id}-code`}
							value={block.code}
							onChange={(event) =>
								onChange({ ...block, code: event.target.value })
							}
							maxLength={limits.code}
							rows={6}
							spellCheck={false}
							className="font-mono text-xs"
							readOnly={readOnly}
						/>
					</div>
				</div>
			);
		case ArticleBlockType.IMAGE:
			return (
				<ImageFields
					{...props}
					block={block}
					onChange={onChange}
				/>
			);
	}
}
