'use client';

import { ChevronDown } from 'lucide-react';

import { projectScopeChoices, projectStartChoices } from '@/constants/contact';
import { ContactField, ContactFormStatus } from '@/enums/contact';
import { useContactForm } from '@/hooks/use-contact-form';
import type {
	ContactChoice,
	ContactFormValues,
	ContactFormVariationProps
} from '@/types/contact';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

import { ContactFormActions } from './contact-form-actions';
import { ContactFormReceipt } from './contact-form-receipt';
import { ContactFormShell } from './contact-form-shell';

/** Ties a blank to its message in the list under the sentence. */
function errorId(field: ContactField) {
	return `brief-${field}-error`;
}

interface BriefBlankProps {
	field: ContactField;
	label: string;
	value: string;
	placeholder: string;
	onValueChange: (value: string) => void;
	type?: 'text' | 'email';
	autoComplete?: string;
	invalid?: boolean;
	/** Width in characters where `field-sizing` isn't supported. */
	size?: number;
}

/**
 * A blank in the sentence. It grows with what's typed where the browser
 * supports it, and falls back to a fixed character width where it doesn't —
 * either way it stays on the baseline of the line it sits in.
 */
function BriefBlank({
	field,
	label,
	value,
	placeholder,
	onValueChange,
	type = 'text',
	autoComplete,
	invalid,
	size = 14
}: BriefBlankProps) {
	return (
		<span className="inline-block max-w-full align-baseline">
			<label
				htmlFor={field}
				className="sr-only"
			>
				{label}
			</label>
			<input
				id={field}
				name={field}
				type={type}
				value={value}
				size={size}
				autoComplete={autoComplete}
				placeholder={placeholder}
				aria-invalid={invalid}
				aria-describedby={invalid ? errorId(field) : undefined}
				onChange={(event) => onValueChange(event.target.value)}
				className={cn(
					'field-sizing-content max-w-full min-w-[6ch] border-b bg-transparent px-1 pb-0.5 text-center text-primary caret-primary transition-colors outline-none placeholder:font-serif placeholder:text-muted-foreground/50 placeholder:italic focus:border-primary focus:bg-primary/5',
					invalid
						? 'border-destructive'
						: 'border-primary/40 hover:border-primary/70'
				)}
			/>
		</span>
	);
}

interface BriefChoiceProps<TValue extends string> {
	field: ContactField;
	label: string;
	value: TValue | '';
	placeholder: string;
	choices: ContactChoice<TValue>[];
	onValueChange: (value: TValue) => void;
	invalid?: boolean;
}

/**
 * The same blank, for the two answers that are a fixed set. Native on purpose:
 * it keeps the keyboard and the phone picker that people already know, and it
 * sizes itself to the phrase it's showing.
 */
function BriefChoice<TValue extends string>({
	field,
	label,
	value,
	placeholder,
	choices,
	onValueChange,
	invalid
}: BriefChoiceProps<TValue>) {
	return (
		<span className="relative inline-block max-w-full align-baseline">
			<label
				htmlFor={field}
				className="sr-only"
			>
				{label}
			</label>
			<select
				id={field}
				name={field}
				value={value}
				aria-invalid={invalid}
				aria-describedby={invalid ? errorId(field) : undefined}
				onChange={(event) =>
					onValueChange(event.target.value as TValue)
				}
				className={cn(
					'field-sizing-content max-w-full cursor-pointer appearance-none border-b bg-transparent py-0 pr-5 pb-0.5 pl-1 transition-colors outline-none focus:border-primary focus:bg-primary/5',
					value === ''
						? 'font-serif text-muted-foreground/50 italic'
						: 'text-primary',
					invalid
						? 'border-destructive'
						: 'border-primary/40 hover:border-primary/70'
				)}
			>
				<option
					value=""
					disabled
				>
					{placeholder}
				</option>
				{choices.map((choice) => (
					<option
						key={choice.value}
						value={choice.value}
						className="bg-popover text-popover-foreground"
					>
						{choice.phrase}
					</option>
				))}
			</select>
			<ChevronDown
				aria-hidden
				className="pointer-events-none absolute top-1/2 right-1 size-[0.55em] -translate-y-1/2 text-primary/60"
			/>
		</span>
	);
}

/**
 * The signature variation: the form is a sentence you finish. A first message
 * to a studio is a piece of writing, so this asks for one instead of breaking
 * it into a stack of labelled boxes — and the blanks collect exactly the same
 * fields the other two variations do.
 */
export function ContactFormBrief({
	sectionIndex,
	totalSections
}: ContactFormVariationProps) {
	const { values, errors, status, setField, submit, reset } =
		useContactForm();

	// Messages live under the sentence rather than beside each blank: a note
	// hung off an inline field would break the line it belongs to.
	const errorEntries = Object.entries(errors) as [
		keyof ContactFormValues,
		string
	][];

	return (
		<ContactFormShell
			sectionIndex={sectionIndex}
			totalSections={totalSections}
			eyebrow="Start the conversation"
			title="Write us a brief"
			description="Finish the sentence. It takes a minute, and it tells us more than a page of dropdowns would."
		>
			{status === ContactFormStatus.SUCCESS ? (
				<ContactFormReceipt
					values={values}
					onReset={reset}
				/>
			) : (
				<form
					noValidate
					onSubmit={submit}
				>
					<p className="font-heading text-xl leading-[2.3] font-medium text-balance text-foreground sm:text-2xl sm:leading-[2.2]">
						Hi Flizz — I&apos;m{' '}
						<BriefBlank
							field={ContactField.NAME}
							label="Your name"
							value={values.name}
							placeholder="your name"
							autoComplete="name"
							invalid={Boolean(errors.name)}
							onValueChange={(value) =>
								setField(ContactField.NAME, value)
							}
						/>{' '}
						from{' '}
						<BriefBlank
							field={ContactField.COMPANY}
							label="Company (optional)"
							value={values.company}
							placeholder="company"
							autoComplete="organization"
							invalid={Boolean(errors.company)}
							onValueChange={(value) =>
								setField(ContactField.COMPANY, value)
							}
						/>
						. We&apos;re{' '}
						<BriefChoice
							field={ContactField.SCOPE}
							label="What the project is"
							value={values.scope}
							placeholder="what we need help with"
							choices={projectScopeChoices}
							invalid={Boolean(errors.scope)}
							onValueChange={(value) =>
								setField(ContactField.SCOPE, value)
							}
						/>
						, and I&apos;d like to start{' '}
						<BriefChoice
							field={ContactField.START}
							label="When you want to start"
							value={values.start}
							placeholder="when"
							choices={projectStartChoices}
							invalid={Boolean(errors.start)}
							onValueChange={(value) =>
								setField(ContactField.START, value)
							}
						/>
						. You can reach me at{' '}
						<BriefBlank
							field={ContactField.EMAIL}
							label="Your email address"
							type="email"
							size={22}
							value={values.email}
							placeholder="name@company.com"
							autoComplete="email"
							invalid={Boolean(errors.email)}
							onValueChange={(value) =>
								setField(ContactField.EMAIL, value)
							}
						/>
						.
					</p>

					{errorEntries.length > 0 ? (
						<ul className="mt-8 space-y-1.5 border-l-2 border-destructive pl-4">
							{errorEntries.map(([field, message]) => (
								<li
									key={field}
									id={`brief-${field}-error`}
									className="font-mono text-xs text-destructive"
								>
									{message}
								</li>
							))}
						</ul>
					) : null}

					<div className="mt-12 border-t border-border pt-10">
						<label
							htmlFor={ContactField.MESSAGE}
							className="font-mono text-xs tracking-[0.2em] text-primary uppercase"
						>
							Here&apos;s the situation
						</label>
						<Textarea
							id={ContactField.MESSAGE}
							name={ContactField.MESSAGE}
							value={values.message}
							aria-invalid={Boolean(errors.message)}
							aria-describedby={
								errors.message
									? errorId(ContactField.MESSAGE)
									: undefined
							}
							placeholder="What you're trying to do, what's standing in the way, and any date you're working to."
							onChange={(event) =>
								setField(
									ContactField.MESSAGE,
									event.target.value
								)
							}
							className="mt-5 min-h-40 resize-none rounded-none border-0 border-b border-border bg-transparent px-0 py-2 text-base leading-relaxed placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-0 md:text-lg dark:bg-transparent"
						/>
					</div>

					<ContactFormActions
						className="mt-10"
						status={status}
						errors={errors}
						submitLabel="Send the brief"
					/>
				</form>
			)}
		</ContactFormShell>
	);
}
