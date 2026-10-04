import { Plus } from 'lucide-react';

import { FieldError } from '@/components/snippets/form-field/form-field';
import { ListItemControls } from '@/components/snippets/list-item-controls/list-item-controls';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	serviceFieldLimits as limits,
	serviceFormMessages
} from '@/constants/services';
import type { ServiceSectionProps } from '@/types/service-form';
import { moveItem, nextKey, removeItem, replaceItem } from '@/utils/list-items';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';

const { fields, sections } = serviceFormMessages;

/** 0–10 question / answer pairs, reorderable. */
export function ServiceFaqsSection({
	values,
	setField,
	errors
}: ServiceSectionProps) {
	const { faqs } = values;

	return (
		<SectionCard
			title={sections.faqs}
			description={sections.faqsLead}
		>
			{faqs.length ? (
				<ol className="flex flex-col gap-4">
					{faqs.map((item, index) => {
						const questionId = `service-faq-${index}-question`;
						const answerId = `service-faq-${index}-answer`;
						const questionError = errors[`faqs.${index}.question`];
						const answerError = errors[`faqs.${index}.answer`];

						return (
							<li
								key={item.key}
								className="flex items-start gap-3 rounded-lg border p-3"
							>
								<span className="mt-7 w-5 shrink-0 text-sm text-muted-foreground tabular-nums">
									{index + 1}
								</span>
								<div className="flex flex-1 flex-col gap-3">
									<div className="flex flex-col gap-2">
										<Label htmlFor={questionId}>
											{fields.faqQuestion}
										</Label>
										<Input
											id={questionId}
											value={item.value.question}
											onChange={(event) =>
												setField(
													'faqs',
													replaceItem(faqs, index, {
														...item.value,
														question:
															event.target.value
													})
												)
											}
											maxLength={limits.faqQuestion}
											aria-invalid={Boolean(
												questionError
											)}
										/>
										<FieldError message={questionError} />
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor={answerId}>
											{fields.faqAnswer}
										</Label>
										<Textarea
											id={answerId}
											value={item.value.answer}
											onChange={(event) =>
												setField(
													'faqs',
													replaceItem(faqs, index, {
														...item.value,
														answer: event.target
															.value
													})
												)
											}
											maxLength={limits.faqAnswer}
											rows={3}
											aria-invalid={Boolean(answerError)}
										/>
										<FieldError message={answerError} />
									</div>
								</div>
								<div className="mt-6">
									<ListItemControls
										index={index}
										count={faqs.length}
										itemLabel={`${fields.faqQuestion} ${index + 1}`}
										onMove={(offset) =>
											setField(
												'faqs',
												moveItem(faqs, index, offset)
											)
										}
										onRemove={() =>
											setField(
												'faqs',
												removeItem(faqs, index)
											)
										}
									/>
								</div>
							</li>
						);
					})}
				</ol>
			) : (
				<p className="text-sm text-muted-foreground">{fields.noFaqs}</p>
			)}
			<FieldError message={errors.faqs} />
			<div>
				<Button
					type="button"
					variant="outline"
					disabled={faqs.length >= limits.faqsMax}
					onClick={() =>
						setField('faqs', [
							...faqs,
							{
								key: nextKey(),
								value: { question: '', answer: '' }
							}
						])
					}
				>
					<Plus />
					{fields.addFaq}
				</Button>
			</div>
		</SectionCard>
	);
}
