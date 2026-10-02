import { Plus } from 'lucide-react';

import { FieldError } from '@/components/features/projects/form-field';
import { ListItemControls } from '@/components/features/projects/list-item-controls';
import {
	projectFieldLimits as limits,
	projectFormMessages
} from '@/constants/projects';
import type { KeyedItem } from '@/types/project-form';
import { moveItem, nextKey, removeItem, replaceItem } from '@/utils/list-items';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';

interface StoryListFieldProps {
	/** Field name — also the API's error path prefix (`brief.2`). */
	name: string;
	label: string;
	items: KeyedItem<string>[];
	onChange: (items: KeyedItem<string>[]) => void;
	errors: Record<string, string>;
}

/** One case-study section: 1–10 paragraphs, reorderable. */
export function StoryListField({
	name,
	label,
	items,
	onChange,
	errors
}: StoryListFieldProps) {
	return (
		<fieldset className="flex flex-col gap-3">
			<legend className="mb-1 text-sm font-medium">{label}</legend>
			<ol className="flex flex-col gap-3">
				{items.map((item, index) => {
					const id = `project-${name}-${index}`;
					const error = errors[`${name}.${index}`];

					return (
						<li
							key={item.key}
							className="flex flex-col gap-1"
						>
							<div className="flex items-start gap-2">
								<Textarea
									id={id}
									value={item.value}
									onChange={(event) =>
										onChange(
											replaceItem(
												items,
												index,
												event.target.value
											)
										)
									}
									maxLength={limits.storyItem}
									rows={3}
									aria-label={`${label} ${index + 1}`}
									aria-invalid={Boolean(error)}
								/>
								<ListItemControls
									index={index}
									count={items.length}
									itemLabel={`${label} ${index + 1}`}
									onMove={(offset) =>
										onChange(moveItem(items, index, offset))
									}
									onRemove={() =>
										onChange(removeItem(items, index))
									}
									canRemove={items.length > 1}
								/>
							</div>
							<FieldError message={error} />
						</li>
					);
				})}
			</ol>
			<FieldError message={errors[name]} />
			<div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={items.length >= limits.storyItemsMax}
					onClick={() =>
						onChange([...items, { key: nextKey(), value: '' }])
					}
				>
					<Plus />
					{projectFormMessages.fields.addParagraph}
				</Button>
			</div>
		</fieldset>
	);
}
