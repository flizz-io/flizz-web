'use client';

import { X } from 'lucide-react';
import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { FormField } from '@/components/snippets/form-field/form-field';
import {
	articleFieldLimits as limits,
	articleFormMessages
} from '@/constants/articles';
import { addTag } from '@/utils/article-form';
import type { ArticleTag } from '@workspace/api-services';
import { Badge } from '@workspace/ui/components/badge';
import { Input } from '@workspace/ui/components/input';

interface ArticleTagsFieldProps {
	tags: string[];
	onChange: (tags: string[]) => void;
	/** Tags already in use, suggested as you type. */
	suggestions: ArticleTag[];
	error?: string;
}

const ADD_KEYS = new Set(['Enter', ',']);
const { fields } = articleFormMessages;

/** Chips plus an input; Enter or comma adds what's typed. */
export function ArticleTagsField({
	tags,
	onChange,
	suggestions,
	error
}: ArticleTagsFieldProps) {
	const [draft, setDraft] = useState('');
	const listId = useId();
	const full = tags.length >= limits.tagsMax;

	const commit = () => {
		onChange(addTag(tags, draft, limits.tagsMax, limits.tag));
		setDraft('');
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (ADD_KEYS.has(event.key)) {
			event.preventDefault();
			commit();
		} else if (event.key === 'Backspace' && !draft && tags.length) {
			onChange(tags.slice(0, -1));
		}
	};

	return (
		<FormField
			id="article-tags"
			label={fields.tags}
			hint={fields.tagsHint(limits.tagsMax)}
			error={error}
			aside={`${tags.length} / ${limits.tagsMax}`}
		>
			{tags.length ? (
				<ul className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<li key={tag}>
							<Badge
								variant="secondary"
								className="gap-1 pr-1"
							>
								{tag}
								<button
									type="button"
									onClick={() =>
										onChange(
											tags.filter(
												(entry) => entry !== tag
											)
										)
									}
									aria-label={fields.removeTag(tag)}
									className="rounded-sm p-0.5 hover:bg-foreground/10"
								>
									<X className="size-3" />
								</button>
							</Badge>
						</li>
					))}
				</ul>
			) : null}
			<Input
				id="article-tags"
				value={draft}
				onChange={(event) => setDraft(event.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={() => draft.trim() && commit()}
				maxLength={limits.tag}
				placeholder={fields.tagsPlaceholder}
				disabled={full}
				list={listId}
				aria-invalid={Boolean(error)}
			/>
			<datalist id={listId}>
				{suggestions
					.filter(({ tag }) => !tags.includes(tag))
					.map(({ tag }) => (
						<option
							key={tag}
							value={tag}
						/>
					))}
			</datalist>
		</FormField>
	);
}
