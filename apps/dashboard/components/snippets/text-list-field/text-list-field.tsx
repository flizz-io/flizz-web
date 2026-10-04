import { Plus } from 'lucide-react';

import { FieldError } from '@/components/snippets/form-field/form-field';
import { ListItemControls } from '@/components/snippets/list-item-controls/list-item-controls';
import type { KeyedItem } from '@/types/list-items';
import { moveItem, nextKey, removeItem, replaceItem } from '@/utils/list-items';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';

interface TextListFieldProps {
	/** Field name — also the API's error path prefix (`brief.2`). */
	name: string;
	/** Prefix for the inputs' ids — `project`, `service`. */
	idPrefix: string;
	label: string;
	items: KeyedItem<string>[];
	onChange: (items: KeyedItem<string>[]) => void;
	errors: Record<string, string>;
	/** Characters per entry. */
	maxLength: number;
	/** Most entries the list may have. */
	maxItems: number;
	addLabel: string;
	rows?: number;
	hint?: string;
}

/** An ordered list of plain-text entries — at least one, reorderable. */
export function TextListField({
	name,
	idPrefix,
	label,
	items,
	onChange,
	errors,
	maxLength,
	maxItems,
	addLabel,
	rows = 3,
	hint
}: TextListFieldProps) {
	return (
		<fieldset className="flex flex-col gap-3">
			<legend className="mb-1 text-sm font-medium">{label}</legend>
			{hint ? (
				<p className="-mt-2 text-xs text-muted-foreground">{hint}</p>
			) : null}
			<ol className="flex flex-col gap-3">
				{items.map((item, index) => {
					const id = `${idPrefix}-${name}-${index}`;
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
									maxLength={maxLength}
									rows={rows}
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
					disabled={items.length >= maxItems}
					onClick={() =>
						onChange([...items, { key: nextKey(), value: '' }])
					}
				>
					<Plus />
					{addLabel}
				</Button>
			</div>
		</fieldset>
	);
}
