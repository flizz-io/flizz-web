'use client';

import { useId, type ReactNode } from 'react';

import { AddBlockMenu } from './add-block-menu';
import { BlockControls } from './block-controls';
import { BlockFields } from './block-fields';
import { blockEditorMessages, blockLimits, blockTypeLabels } from './constants';
import { newEditorBlock } from './convert';
import type { BodyImageUploadSlot, EditorBlock } from './types';
import type { ArticleBlockType } from '@workspace/api-services';

interface BlockEditorProps {
	blocks: EditorBlock[];
	onChange: (blocks: EditorBlock[]) => void;
	readOnly?: boolean;
	/**
	 * Errors keyed by path within the body — `"3"` for a whole block,
	 * `"3.alt"` for one of its fields — as the API reports them under `body.`.
	 */
	errors?: Record<string, string | undefined>;
	/** Renders the app's uploader in image blocks; omit while uploads aren't possible. */
	renderImageUpload?: (slot: BodyImageUploadSlot) => ReactNode;
}

function errorsFor(
	errors: BlockEditorProps['errors'],
	index: number
): string[] {
	if (!errors) return [];
	const prefix = String(index);

	return Object.entries(errors).flatMap(([path, message]) =>
		message && (path === prefix || path.startsWith(`${prefix}.`))
			? [message]
			: []
	);
}

/**
 * An article body as an ordered list of typed blocks — the `ArticleBlock`
 * JSON, edited one block at a time. Blocks are added from a menu, moved with
 * buttons and removed; text boxes take a small markup for bold, italic, code
 * and links, previewed under each box.
 */
export function BlockEditor({
	blocks,
	onChange,
	readOnly = false,
	errors,
	renderImageUpload
}: BlockEditorProps) {
	const baseId = useId();
	const full = blocks.length >= blockLimits.blocksMax;

	const insertAt = (index: number, type: ArticleBlockType) =>
		onChange([
			...blocks.slice(0, index),
			newEditorBlock(type),
			...blocks.slice(index)
		]);

	const replaceAt = (index: number, block: EditorBlock) =>
		onChange(
			blocks.map((entry, position) =>
				position === index ? block : entry
			)
		);

	const move = (index: number, offset: number) => {
		const target = index + offset;
		if (target < 0 || target >= blocks.length) return;
		const next = [...blocks];
		const [moved] = next.splice(index, 1);
		if (moved) next.splice(target, 0, moved);
		onChange(next);
	};

	const removeAt = (index: number) =>
		onChange(blocks.filter((_, position) => position !== index));

	return (
		<div className="flex flex-col gap-4">
			{blocks.length ? (
				<ol className="flex flex-col gap-3">
					{blocks.map((block, index) => {
						const label = `${blockTypeLabels[block.type]} ${index + 1}`;
						const blockErrors = errorsFor(errors, index);

						return (
							<li
								key={block.key}
								className="flex flex-col gap-3 rounded-lg border p-3 aria-invalid:border-destructive"
								aria-invalid={blockErrors.length > 0}
								aria-label={label}
							>
								<div className="flex items-center justify-between gap-3">
									<p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
										{label}
									</p>
									{readOnly ? null : (
										<BlockControls
											index={index}
											count={blocks.length}
											label={label}
											onMove={(offset) =>
												move(index, offset)
											}
											onRemove={() => removeAt(index)}
										/>
									)}
								</div>
								<BlockFields
									block={block}
									id={`${baseId}-${block.key}`}
									readOnly={readOnly}
									onChange={(next) => replaceAt(index, next)}
									renderImageUpload={renderImageUpload}
								/>
								{blockErrors.map((message) => (
									<p
										key={message}
										className="text-sm text-destructive"
									>
										{message}
									</p>
								))}
								{readOnly ||
								index === blocks.length - 1 ? null : (
									<div className="-mb-1 flex justify-center">
										<AddBlockMenu
											compact
											disabled={full}
											onAdd={(type) =>
												insertAt(index + 1, type)
											}
										/>
									</div>
								)}
							</li>
						);
					})}
				</ol>
			) : (
				<p className="text-sm text-muted-foreground">
					{blockEditorMessages.empty}
				</p>
			)}
			{readOnly ? null : (
				<div>
					<AddBlockMenu
						disabled={full}
						onAdd={(type) => insertAt(blocks.length, type)}
					/>
				</div>
			)}
		</div>
	);
}
