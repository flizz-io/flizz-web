import type { ReactNode } from 'react';

import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';

interface FormFieldProps {
	id: string;
	label: string;
	hint?: string;
	error?: string;
	/** Shown after the label, e.g. "(optional)" or a character count. */
	aside?: ReactNode;
	className?: string;
	children: ReactNode;
}

/** Label, control, hint and the API's message for one field. */
export function FormField({
	id,
	label,
	hint,
	error,
	aside,
	className,
	children
}: FormFieldProps) {
	return (
		<div className={cn('flex flex-col gap-2', className)}>
			<div className="flex items-baseline justify-between gap-2">
				<Label htmlFor={id}>{label}</Label>
				{aside ? (
					<span className="text-xs text-muted-foreground">
						{aside}
					</span>
				) : null}
			</div>
			{children}
			{hint && !error ? (
				<p className="text-xs text-muted-foreground">{hint}</p>
			) : null}
			{error ? <FieldError message={error} /> : null}
		</div>
	);
}

export function FieldError({ message }: { message?: string }) {
	return message ? (
		<p className="text-sm text-destructive">{message}</p>
	) : null;
}

/** "42 / 200" under a length-capped field. */
export function charCount(value: string, max: number) {
	return `${value.length} / ${max}`;
}
