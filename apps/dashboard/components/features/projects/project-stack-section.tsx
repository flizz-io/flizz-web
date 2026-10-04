'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';

import { FieldError } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	projectFieldLimits as limits,
	projectFormMessages
} from '@/constants/projects';
import type { ProjectSectionProps } from '@/types/project-form';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';

const { fields, sections } = projectFormMessages;

/** Tools and languages as chips — Enter adds, × removes; no duplicates. */
export function ProjectStackSection({
	values,
	setField,
	errors
}: ProjectSectionProps) {
	const [draft, setDraft] = useState('');
	const { stack } = values;
	const full = stack.length >= limits.stackMax;

	const add = () => {
		const chip = draft.trim();
		if (!chip || full) return;
		const duplicate = stack.some(
			(existing) => existing.toLowerCase() === chip.toLowerCase()
		);
		if (!duplicate) setField('stack', [...stack, chip]);
		setDraft('');
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			add();
		}
	};

	const chipErrors = stack
		.map((_, index) => errors[`stack.${index}`])
		.filter(Boolean);

	return (
		<SectionCard
			title={sections.stack}
			description={sections.stackLead}
		>
			{stack.length ? (
				<ul className="flex flex-wrap gap-2">
					{stack.map((chip, index) => (
						<li key={chip}>
							<Badge
								variant="secondary"
								className="gap-1 pr-1"
							>
								{chip}
								<button
									type="button"
									onClick={() =>
										setField(
											'stack',
											stack.filter(
												(_, position) =>
													position !== index
											)
										)
									}
									className="rounded-sm p-0.5 hover:bg-foreground/10 disabled:pointer-events-none"
									aria-label={fields.removeChip(chip)}
								>
									<X className="size-3" />
								</button>
							</Badge>
						</li>
					))}
				</ul>
			) : null}
			<div className="flex flex-col gap-2">
				<Label htmlFor="project-stack">{fields.stackInput}</Label>
				<div className="flex gap-2 sm:max-w-sm">
					<Input
						id="project-stack"
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
						onKeyDown={handleKeyDown}
						maxLength={limits.stackChip}
						placeholder={fields.stackPlaceholder}
						disabled={full}
					/>
					<Button
						type="button"
						variant="outline"
						onClick={add}
						disabled={full || !draft.trim()}
					>
						<Plus />
						{fields.addChip}
					</Button>
				</div>
				<FieldError message={errors.stack ?? chipErrors[0]} />
			</div>
		</SectionCard>
	);
}
