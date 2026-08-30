'use client';

import { projectScopeChoices, projectStartChoices } from '@/constants/contact';
import {
	ContactField,
	ContactFormStatus,
	ProjectScope,
	ProjectStart
} from '@/enums/contact';
import { useContactForm } from '@/hooks/use-contact-form';
import type { ContactFormVariationProps } from '@/types/contact';
import { BorderBeam } from '@workspace/ui/components/border-beam';
import { Input } from '@workspace/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';

import { ContactFormActions } from './contact-form-actions';
import { ContactFormReceipt } from './contact-form-receipt';
import { ContactFormShell } from './contact-form-shell';

/** Marketing-page sizing for the packaged controls, which default to compact. */
const controlClassName = 'h-11 px-3.5 text-base md:text-base';
const triggerClassName =
	'w-full px-3.5 text-base data-[size=default]:h-11 md:text-base';

interface ClassicFieldProps {
	label: string;
	controlId?: string;
	labelId?: string;
	error?: string;
	errorId?: string;
	children: React.ReactNode;
	className?: string;
}

function ClassicField({
	label,
	controlId,
	labelId,
	error,
	errorId,
	children,
	className
}: ClassicFieldProps) {
	const labelClassName = cn(
		'font-mono text-[0.65rem] tracking-[0.2em] uppercase',
		error ? 'text-destructive' : 'text-muted-foreground'
	);

	return (
		<div className={cn('flex flex-col gap-2.5', className)}>
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

			{children}

			{error ? (
				<p
					id={errorId}
					className="font-mono text-xs text-destructive"
				>
					{error}
				</p>
			) : null}
		</div>
	);
}

/**
 * The plain variation: familiar labelled fields, with the personality kept to
 * the frame around them. For when the form has to be the least surprising
 * thing on the page.
 */
export function ContactFormClassic({
	sectionIndex,
	totalSections
}: ContactFormVariationProps) {
	const { values, errors, status, setField, submit, reset } =
		useContactForm();

	return (
		<ContactFormShell
			sectionIndex={sectionIndex}
			totalSections={totalSections}
			eyebrow="Start the conversation"
			title="Send us a message"
			description="Six fields, none of them a trick. Everything here goes to the same inbox a reply comes back from."
		>
			{status === ContactFormStatus.SUCCESS ? (
				<ContactFormReceipt
					values={values}
					onReset={reset}
				/>
			) : (
				<div className="relative">
					<span
						aria-hidden
						className="pointer-events-none absolute -inset-x-10 -top-10 h-48 bg-primary/10 blur-3xl"
					/>

					<form
						noValidate
						onSubmit={submit}
						className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm sm:p-10"
					>
						<div className="grid gap-6 sm:grid-cols-2">
							<ClassicField
								label="Name"
								controlId={ContactField.NAME}
								error={errors.name}
								errorId="classic-name-error"
							>
								<Input
									id={ContactField.NAME}
									name={ContactField.NAME}
									value={values.name}
									autoComplete="name"
									aria-invalid={Boolean(errors.name)}
									aria-describedby={
										errors.name
											? 'classic-name-error'
											: undefined
									}
									onChange={(event) =>
										setField(
											ContactField.NAME,
											event.target.value
										)
									}
									className={controlClassName}
								/>
							</ClassicField>

							<ClassicField
								label="Company (optional)"
								controlId={ContactField.COMPANY}
								error={errors.company}
								errorId="classic-company-error"
							>
								<Input
									id={ContactField.COMPANY}
									name={ContactField.COMPANY}
									value={values.company}
									autoComplete="organization"
									aria-invalid={Boolean(errors.company)}
									aria-describedby={
										errors.company
											? 'classic-company-error'
											: undefined
									}
									onChange={(event) =>
										setField(
											ContactField.COMPANY,
											event.target.value
										)
									}
									className={controlClassName}
								/>
							</ClassicField>

							<ClassicField
								className="sm:col-span-2"
								label="Email"
								controlId={ContactField.EMAIL}
								error={errors.email}
								errorId="classic-email-error"
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
											? 'classic-email-error'
											: undefined
									}
									onChange={(event) =>
										setField(
											ContactField.EMAIL,
											event.target.value
										)
									}
									className={controlClassName}
								/>
							</ClassicField>

							<ClassicField
								label="What the project is"
								controlId={ContactField.SCOPE}
								error={errors.scope}
								errorId="classic-scope-error"
							>
								<Select
									value={values.scope}
									onValueChange={(value) =>
										setField(
											ContactField.SCOPE,
											value as ProjectScope
										)
									}
								>
									<SelectTrigger
										id={ContactField.SCOPE}
										aria-invalid={Boolean(errors.scope)}
										aria-describedby={
											errors.scope
												? 'classic-scope-error'
												: undefined
										}
										className={triggerClassName}
									>
										<SelectValue placeholder="Pick the closest" />
									</SelectTrigger>
									<SelectContent>
										{projectScopeChoices.map((choice) => (
											<SelectItem
												key={choice.value}
												value={choice.value}
											>
												{choice.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</ClassicField>

							<ClassicField
								label="When you want to start"
								controlId={ContactField.START}
								error={errors.start}
								errorId="classic-start-error"
							>
								<Select
									value={values.start}
									onValueChange={(value) =>
										setField(
											ContactField.START,
											value as ProjectStart
										)
									}
								>
									<SelectTrigger
										id={ContactField.START}
										aria-invalid={Boolean(errors.start)}
										aria-describedby={
											errors.start
												? 'classic-start-error'
												: undefined
										}
										className={triggerClassName}
									>
										<SelectValue placeholder="Pick the closest" />
									</SelectTrigger>
									<SelectContent>
										{projectStartChoices.map((choice) => (
											<SelectItem
												key={choice.value}
												value={choice.value}
											>
												{choice.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</ClassicField>

							<ClassicField
								className="sm:col-span-2"
								label="The situation"
								controlId={ContactField.MESSAGE}
								error={errors.message}
								errorId="classic-message-error"
							>
								<Textarea
									id={ContactField.MESSAGE}
									name={ContactField.MESSAGE}
									value={values.message}
									placeholder="What you're trying to do, what's standing in the way, and any date you're working to."
									aria-invalid={Boolean(errors.message)}
									aria-describedby={
										errors.message
											? 'classic-message-error'
											: undefined
									}
									onChange={(event) =>
										setField(
											ContactField.MESSAGE,
											event.target.value
										)
									}
									className="min-h-36 resize-none px-3.5 py-3 text-base leading-relaxed md:text-base"
								/>
							</ClassicField>
						</div>

						<ContactFormActions
							className="mt-9"
							status={status}
							errors={errors}
							submitLabel="Send message"
						/>

						<BorderBeam
							duration={12}
							size={280}
							className="from-transparent via-primary to-transparent"
						/>
					</form>
				</div>
			)}
		</ContactFormShell>
	);
}
