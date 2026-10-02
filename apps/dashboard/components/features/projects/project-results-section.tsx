import { Plus } from 'lucide-react';

import { FieldError } from '@/components/features/projects/form-field';
import { ListItemControls } from '@/components/features/projects/list-item-controls';
import { SectionCard } from '@/components/features/projects/section-card';
import {
	projectFieldLimits as limits,
	projectFormMessages
} from '@/constants/projects';
import type { ProjectSectionProps, ResultValue } from '@/types/project-form';
import { moveItem, nextKey, removeItem, replaceItem } from '@/utils/list-items';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';

const { fields, sections } = projectFormMessages;

const resultParts: { part: keyof ResultValue; label: string }[] = [
	{ part: 'label', label: fields.resultLabel },
	{ part: 'from', label: fields.resultFrom },
	{ part: 'to', label: fields.resultTo }
];

/** 1–6 before → after pairs, reorderable; the first is the headline. */
export function ProjectResultsSection({
	values,
	setField,
	errors
}: ProjectSectionProps) {
	const { results } = values;

	return (
		<SectionCard
			title={sections.results}
			description={sections.resultsLead}
		>
			<ol className="flex flex-col gap-4">
				{results.map((item, index) => (
					<li
						key={item.key}
						className="flex flex-col gap-2 rounded-lg border p-3"
					>
						<div className="flex items-start gap-3">
							<span className="mt-7 w-5 shrink-0 text-sm text-muted-foreground tabular-nums">
								{index + 1}
							</span>
							<div className="grid flex-1 gap-3 sm:grid-cols-3">
								{resultParts.map(({ part, label }) => {
									const id = `project-result-${index}-${part}`;
									const error =
										errors[`results.${index}.${part}`];

									return (
										<div
											key={part}
											className="flex flex-col gap-2"
										>
											<Label htmlFor={id}>{label}</Label>
											<Input
												id={id}
												value={item.value[part]}
												onChange={(event) =>
													setField(
														'results',
														replaceItem(
															results,
															index,
															{
																...item.value,
																[part]: event
																	.target
																	.value
															}
														)
													)
												}
												maxLength={limits.resultField}
												aria-invalid={Boolean(error)}
											/>
											<FieldError message={error} />
										</div>
									);
								})}
							</div>
							<div className="mt-6">
								<ListItemControls
									index={index}
									count={results.length}
									itemLabel={`${sections.results} ${index + 1}`}
									onMove={(offset) =>
										setField(
											'results',
											moveItem(results, index, offset)
										)
									}
									onRemove={() =>
										setField(
											'results',
											removeItem(results, index)
										)
									}
									canRemove={results.length > 1}
								/>
							</div>
						</div>
					</li>
				))}
			</ol>
			<FieldError message={errors.results} />
			<div>
				<Button
					type="button"
					variant="outline"
					disabled={results.length >= limits.resultsMax}
					onClick={() =>
						setField('results', [
							...results,
							{
								key: nextKey(),
								value: { label: '', from: '', to: '' }
							}
						])
					}
				>
					<Plus />
					{fields.addResult}
				</Button>
			</div>
		</SectionCard>
	);
}
