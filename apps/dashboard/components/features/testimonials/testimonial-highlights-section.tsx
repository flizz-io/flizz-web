'use client';

import { Highlighter, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { HighlightedQuote } from '@/components/features/testimonials/highlighted-quote';
import { FieldError } from '@/components/snippets/form-field/form-field';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import {
	testimonialFieldLimits as limits,
	testimonialFormMessages
} from '@/constants/testimonials';
import type { TestimonialSectionProps } from '@/types/testimonial-form';
import { quoteContains } from '@/utils/testimonial-form';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface TestimonialHighlightsSectionProps extends TestimonialSectionProps {
	readOnly: boolean;
}

const { fields, sections, highlightErrors } = testimonialFormMessages;

/**
 * The highlight picker: select words in the preview, press Highlight. A
 * phrase an edit of the quote has stranded is marked until it's removed.
 */
export function TestimonialHighlightsSection({
	values,
	setField,
	errors,
	readOnly
}: TestimonialHighlightsSectionProps) {
	const previewRef = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState('');
	const [problem, setProblem] = useState<string | null>(null);

	/** The trimmed text selected inside the preview, or nothing. */
	const readSelection = () => {
		const selection = window.getSelection();
		const preview = previewRef.current;
		const inside =
			selection &&
			!selection.isCollapsed &&
			preview?.contains(selection.anchorNode) &&
			preview.contains(selection.focusNode);

		setSelected(
			inside ? selection.toString().replace(/\s+/g, ' ').trim() : ''
		);
		setProblem(null);
	};

	const addHighlight = () => {
		const phrase = selected;
		const { highlights, quote } = values;

		if (!phrase || !quoteContains(quote, phrase)) {
			setProblem(highlightErrors.outside);
		} else if (phrase.length > limits.highlight) {
			setProblem(highlightErrors.tooLong(limits.highlight));
		} else if (highlights.length >= limits.highlightsMax) {
			setProblem(highlightErrors.full(limits.highlightsMax));
		} else if (
			highlights.some(
				(existing) => existing.toLowerCase() === phrase.toLowerCase()
			)
		) {
			setProblem(highlightErrors.duplicate);
		} else {
			setField('highlights', [...highlights, phrase]);
			setSelected('');
			window.getSelection()?.removeAllRanges();
		}
	};

	const removeHighlight = (phrase: string) =>
		setField(
			'highlights',
			values.highlights.filter((existing) => existing !== phrase)
		);

	return (
		<SectionCard
			title={sections.highlights}
			description={sections.highlightsLead}
		>
			<div className="flex flex-col gap-2">
				<p className="text-sm font-medium">{fields.preview}</p>
				<div
					ref={previewRef}
					onMouseUp={readSelection}
					onKeyUp={readSelection}
					className="rounded-md border bg-muted/30 px-4 py-3 font-serif text-lg leading-snug italic"
				>
					{values.quote.trim() ? (
						<HighlightedQuote
							quote={values.quote}
							highlights={values.highlights}
						/>
					) : (
						<p className="font-sans text-sm text-muted-foreground not-italic">
							{fields.emptyPreview}
						</p>
					)}
				</div>
			</div>

			{readOnly ? null : (
				<div className="flex flex-wrap items-center gap-3">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={!selected}
						onClick={addHighlight}
						className="max-w-full"
					>
						<Highlighter />
						<span className="truncate">
							{selected
								? fields.highlight(selected)
								: fields.highlightIdle}
						</span>
					</Button>
					<FieldError message={problem ?? undefined} />
				</div>
			)}

			{values.highlights.length ? (
				<ul className="flex flex-col gap-2">
					{values.highlights.map((phrase) => {
						const missing = !quoteContains(values.quote, phrase);

						return (
							<li
								key={phrase}
								className="flex flex-wrap items-center gap-2"
							>
								<Badge
									variant="outline"
									className={cn(
										'gap-1 pr-1 text-sm',
										missing
											? 'border-destructive/50 text-destructive'
											: 'border-primary/40 text-primary'
									)}
								>
									{phrase}
									{readOnly ? null : (
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											className="size-5"
											onClick={() =>
												removeHighlight(phrase)
											}
											aria-label={fields.removeHighlight(
												phrase
											)}
											title={fields.removeHighlight(
												phrase
											)}
										>
											<X />
										</Button>
									)}
								</Badge>
								{missing ? (
									<span className="text-sm text-destructive">
										{fields.missing}
									</span>
								) : null}
							</li>
						);
					})}
				</ul>
			) : (
				<p className="text-sm text-muted-foreground">
					{fields.noHighlights}
				</p>
			)}
			<FieldError message={errors.highlights} />
		</SectionCard>
	);
}
