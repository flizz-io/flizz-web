'use client';

import { SchematicFrame } from '@/components/snippets/schematic-frame/schematic-frame';
import { projectScopeChoices, projectStartChoices } from '@/constants/contact';
import {
	ContactField,
	ContactFormStatus,
	ProjectScope,
	ProjectStart
} from '@/enums/contact';
import { useContactForm } from '@/hooks/use-contact-form';
import type { ContactFormVariationProps } from '@/types/contact';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import {
	ToggleGroup,
	ToggleGroupItem
} from '@workspace/ui/components/toggle-group';
import { cn } from '@workspace/ui/lib/utils';

import { ContactFormActions } from './contact-form-actions';
import { ContactFormReceipt } from './contact-form-receipt';
import { ContactFormShell } from './contact-form-shell';

/** Strips every packaged box, ring and radius back to a bare readout line. */
const consoleFieldClassName =
	'h-auto rounded-none border-0 bg-transparent px-0 py-1 font-mono text-sm caret-primary shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0 dark:bg-transparent';

const chipClassName =
	'rounded-full border-border font-mono text-[0.7rem] tracking-wide data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary';

interface ConsoleRowProps {
	label: string;
	/** Set for a single labelable control — renders a real `<label for>`. */
	controlId?: string;
	/** Set for a group of controls, which a `<label>` can't point at. */
	labelId?: string;
	error?: string;
	errorId?: string;
	/** Lifts the label to the first line of a tall control. */
	alignTop?: boolean;
	children: React.ReactNode;
}

function ConsoleRow({
	label,
	controlId,
	labelId,
	error,
	errorId,
	alignTop,
	children
}: ConsoleRowProps) {
	const labelClassName = cn(
		'font-mono text-[0.65rem] tracking-[0.2em] uppercase',
		error ? 'text-destructive' : 'text-muted-foreground',
		alignTop && 'sm:pt-1.5'
	);

	return (
		<div
			className={cn(
				'grid gap-2 border-b border-border px-5 py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-0 sm:px-6',
				alignTop ? 'sm:items-start' : 'sm:items-center'
			)}
		>
			{controlId ? (
				<label
					htmlFor={controlId}
					className={labelClassName}
				>
					{label}
				</label>
			) : (
				<span
					id={labelId}
					className={labelClassName}
				>
					{label}
				</span>
			)}

			<div className="min-w-0 sm:border-l sm:border-border sm:pl-5">
				{children}
				{error ? (
					<p
						id={errorId}
						className="mt-1.5 font-mono text-xs text-destructive"
					>
						{error}
					</p>
				) : null}
			</div>
		</div>
	);
}

/**
 * The instrument-panel variation. Everything the site already draws as
 * schematic — mono labels, hairline rules, corner ticks — applied to the form
 * itself, with a readiness meter in place of a progress bar.
 */
export function ContactFormConsole({
	sectionIndex,
	totalSections
}: ContactFormVariationProps) {
	const {
		values,
		errors,
		status,
		setField,
		submit,
		reset,
		completedCount,
		requiredCount
	} = useContactForm();

	const isReady = completedCount === requiredCount;

	return (
		<ContactFormShell
			sectionIndex={sectionIndex}
			totalSections={totalSections}
			eyebrow="Start the conversation"
			title="Open a channel"
			description="Six lines, most of them one word. The meter fills as you go, so you can see what's left before you commit to it."
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
					<SchematicFrame className="border border-border bg-card/50 backdrop-blur-sm">
						<div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-6">
							<span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
								Open channel
							</span>
							<span
								className={cn(
									'font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors',
									isReady
										? 'text-primary'
										: 'text-muted-foreground'
								)}
							>
								{isReady ? 'Ready' : 'Standby'}
							</span>
						</div>

						<ConsoleRow
							label="Name"
							controlId={ContactField.NAME}
							error={errors.name}
							errorId="console-name-error"
						>
							<Input
								id={ContactField.NAME}
								name={ContactField.NAME}
								value={values.name}
								autoComplete="name"
								placeholder="Who we're replying to"
								aria-invalid={Boolean(errors.name)}
								aria-describedby={
									errors.name
										? 'console-name-error'
										: undefined
								}
								onChange={(event) =>
									setField(
										ContactField.NAME,
										event.target.value
									)
								}
								className={consoleFieldClassName}
							/>
						</ConsoleRow>

						<ConsoleRow
							label="Company"
							controlId={ContactField.COMPANY}
							error={errors.company}
							errorId="console-company-error"
						>
							<Input
								id={ContactField.COMPANY}
								name={ContactField.COMPANY}
								value={values.company}
								autoComplete="organization"
								placeholder="Optional"
								aria-invalid={Boolean(errors.company)}
								aria-describedby={
									errors.company
										? 'console-company-error'
										: undefined
								}
								onChange={(event) =>
									setField(
										ContactField.COMPANY,
										event.target.value
									)
								}
								className={consoleFieldClassName}
							/>
						</ConsoleRow>

						<ConsoleRow
							label="Email"
							controlId={ContactField.EMAIL}
							error={errors.email}
							errorId="console-email-error"
						>
							<Input
								id={ContactField.EMAIL}
								name={ContactField.EMAIL}
								type="email"
								value={values.email}
								autoComplete="email"
								placeholder="name@company.com"
								aria-invalid={Boolean(errors.email)}
								aria-describedby={
									errors.email
										? 'console-email-error'
										: undefined
								}
								onChange={(event) =>
									setField(
										ContactField.EMAIL,
										event.target.value
									)
								}
								className={consoleFieldClassName}
							/>
						</ConsoleRow>

						<ConsoleRow
							alignTop
							label="Scope"
							labelId="console-scope-label"
							error={errors.scope}
							errorId="console-scope-error"
						>
							<ToggleGroup
								type="single"
								variant="outline"
								size="sm"
								value={values.scope}
								aria-labelledby="console-scope-label"
								className="w-full flex-wrap"
								onValueChange={(value) =>
									value &&
									setField(
										ContactField.SCOPE,
										value as ProjectScope
									)
								}
							>
								{projectScopeChoices.map((choice) => (
									<ToggleGroupItem
										key={choice.value}
										value={choice.value}
										className={chipClassName}
									>
										{choice.label}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</ConsoleRow>

						<ConsoleRow
							alignTop
							label="Start"
							labelId="console-start-label"
							error={errors.start}
							errorId="console-start-error"
						>
							<ToggleGroup
								type="single"
								variant="outline"
								size="sm"
								value={values.start}
								aria-labelledby="console-start-label"
								className="w-full flex-wrap"
								onValueChange={(value) =>
									value &&
									setField(
										ContactField.START,
										value as ProjectStart
									)
								}
							>
								{projectStartChoices.map((choice) => (
									<ToggleGroupItem
										key={choice.value}
										value={choice.value}
										className={chipClassName}
									>
										{choice.label}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</ConsoleRow>

						<ConsoleRow
							alignTop
							label="Message"
							controlId={ContactField.MESSAGE}
							error={errors.message}
							errorId="console-message-error"
						>
							<Textarea
								id={ContactField.MESSAGE}
								name={ContactField.MESSAGE}
								value={values.message}
								placeholder="The problem, who it affects, and any date you're working to."
								aria-invalid={Boolean(errors.message)}
								aria-describedby={
									errors.message
										? 'console-message-error'
										: undefined
								}
								onChange={(event) =>
									setField(
										ContactField.MESSAGE,
										event.target.value
									)
								}
								className={cn(
									consoleFieldClassName,
									'min-h-28 resize-none leading-relaxed md:text-sm'
								)}
							/>
						</ConsoleRow>

						<div className="flex items-center gap-3 px-5 py-4 sm:px-6">
							<span
								aria-hidden
								className="flex gap-1"
							>
								{Array.from(
									{ length: requiredCount },
									(_, index) => (
										<span
											key={index}
											className={cn(
												'h-2 w-5 transition-colors duration-300',
												index < completedCount
													? 'bg-primary'
													: 'bg-muted-foreground/20'
											)}
										/>
									)
								)}
							</span>
							<span className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
								{completedCount} / {requiredCount} ready
							</span>
						</div>
					</SchematicFrame>

					<ContactFormActions
						className="mt-8"
						status={status}
						errors={errors}
						submitLabel="Transmit"
					/>
				</form>
			)}
		</ContactFormShell>
	);
}
