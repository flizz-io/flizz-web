'use client';

import { ArrowRight, LoaderCircle } from 'lucide-react';

import { siteConfig } from '@/configs/site';
import { ContactFormStatus } from '@/enums/contact';
import type { ContactFieldErrors } from '@/types/contact';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface ContactFormActionsProps {
	status: ContactFormStatus;
	errors: ContactFieldErrors;
	submitLabel: string;
	className?: string;
}

/**
 * The submit row, shared by every variation. The note beside the button is the
 * one place a whole-form problem is stated — individual fields carry their own
 * message, so this only ever counts them.
 */
export function ContactFormActions({
	status,
	errors,
	submitLabel,
	className
}: ContactFormActionsProps) {
	const errorCount = Object.keys(errors).length;
	const isSubmitting = status === ContactFormStatus.SUBMITTING;

	let note = (
		<p className="font-mono text-xs text-muted-foreground">
			Goes straight to the team. No lists, no sequences.
		</p>
	);

	if (errorCount > 0) {
		note = (
			<p
				role="alert"
				className="font-mono text-xs text-destructive"
			>
				{errorCount === 1
					? 'One field needs another look.'
					: `${errorCount} fields need another look.`}
			</p>
		);
	} else if (status === ContactFormStatus.ERROR) {
		note = (
			<p
				role="alert"
				className="font-mono text-xs text-destructive"
			>
				That didn&apos;t send. Try again, or email{' '}
				{siteConfig.contactEmail}.
			</p>
		);
	}

	return (
		<div
			className={cn(
				'flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between',
				className
			)}
		>
			<div className="order-2 sm:order-1">{note}</div>

			<Button
				type="submit"
				size="lg"
				disabled={isSubmitting}
				className="order-1 h-12 self-start px-7 text-base shadow-[0_0_40px_-12px_var(--color-primary)] sm:order-2 sm:self-auto"
			>
				{isSubmitting ? (
					<>
						<LoaderCircle className="size-4 motion-safe:animate-spin" />
						Sending
					</>
				) : (
					<>
						{submitLabel}
						<ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
					</>
				)}
			</Button>
		</div>
	);
}
