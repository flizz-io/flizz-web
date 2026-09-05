'use client';

import { Check } from 'lucide-react';
import { useMemo } from 'react';

import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { projectScopeChoices } from '@/constants/contact';
import type { ContactFormValues } from '@/types/contact';
import { formatNextBusinessDay } from '@/utils/date';
import { Button } from '@workspace/ui/components/button';

interface ContactFormReceiptProps {
	values: ContactFormValues;
	onReset: () => void;
}

/**
 * What replaces the form once it sends, shared by every variation. It reads
 * back what we understood and names the date the reply is due, so the promise
 * made in the hero lands on something specific rather than repeating itself.
 */
export function ContactFormReceipt({
	values,
	onReset
}: ContactFormReceiptProps) {
	const replyBy = useMemo(() => formatNextBusinessDay(), []);
	const about = projectScopeChoices.find(
		(choice) => choice.value === values.scope
	)?.label;

	const rows = [
		{ term: 'From', value: values.name },
		{ term: 'About', value: about ?? 'Your project' },
		{ term: 'Reply by', value: replyBy }
	];

	return (
		<SchematicFrame className="border border-border bg-card/60 backdrop-blur-sm motion-safe:animate-in motion-safe:duration-500 motion-safe:fade-in-0">
			<div className="px-6 py-14 text-center sm:px-10">
				<span
					aria-hidden
					className="relative mx-auto flex size-14 items-center justify-center border border-primary/40"
				>
					<span className="absolute inset-0 -z-10 bg-primary/20 blur-2xl" />
					<Check className="size-6 text-primary" />
				</span>

				<h3 className="mt-8 font-heading text-3xl font-semibold tracking-tight text-foreground">
					Message sent.
				</h3>
				<p className="mx-auto mt-4 max-w-sm text-base text-pretty text-muted-foreground">
					It&apos;s with the team now. The reply comes from a person
					at a real address — you can just answer it.
				</p>

				<dl className="mx-auto mt-10 max-w-sm divide-y divide-border border-y border-border text-left">
					{rows.map((row) => (
						<div
							key={row.term}
							className="flex items-baseline justify-between gap-4 py-3"
						>
							<dt className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase">
								{row.term}
							</dt>
							<dd className="truncate text-right text-sm text-foreground">
								{row.value}
							</dd>
						</div>
					))}
				</dl>

				<Button
					type="button"
					variant="outline"
					onClick={onReset}
					className="mt-9 h-10 px-5"
				>
					Send another
				</Button>
			</div>
		</SchematicFrame>
	);
}
