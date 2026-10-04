'use client';

import Link from 'next/link';

import { consentCopy } from '@/constants/consent';
import { legalPaths } from '@/constants/legal';
import { useConsent } from '@/contexts/consent-context';
import { ConsentChoice } from '@/enums/consent';
import { Button } from '@workspace/ui/components/button';

/**
 * Asks once, until the visitor chooses; "Cookie settings" in the footer opens
 * it again. Accept and Reject carry equal weight — same size, one click each,
 * as UK GDPR/PECR expect. Mounted on `<body>`, outside the ScrollSmoother
 * wrapper, so `fixed` holds. Sits bottom-left, clear of the chat button.
 */
export function ConsentBanner() {
	const { choice, ready, settingsOpen, choose } = useConsent();

	if (!ready || (choice !== null && !settingsOpen)) return null;

	return (
		<section
			role="dialog"
			aria-modal="false"
			aria-labelledby="consent-title"
			aria-describedby="consent-body"
			className="fixed inset-x-3 bottom-3 z-50 rounded-xl border border-border bg-background/95 p-5 text-foreground shadow-lg backdrop-blur-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 sm:right-auto sm:bottom-5 sm:left-5 sm:max-w-md"
		>
			<h2
				id="consent-title"
				className="font-heading text-base font-semibold tracking-tight"
			>
				{consentCopy.title}
			</h2>
			<p
				id="consent-body"
				className="mt-2 text-sm text-pretty text-muted-foreground"
			>
				{consentCopy.body}{' '}
				<Link
					href={legalPaths.privacy}
					className="text-foreground underline underline-offset-4 hover:text-primary"
				>
					{consentCopy.policyLabel}
				</Link>
			</p>
			{settingsOpen && choice ? (
				<p className="mt-2 text-sm text-muted-foreground">
					{consentCopy.current(choice === ConsentChoice.ACCEPTED)}
				</p>
			) : null}
			<div className="mt-4 grid grid-cols-2 gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={() => choose(ConsentChoice.REJECTED)}
				>
					{consentCopy.reject}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => choose(ConsentChoice.ACCEPTED)}
				>
					{consentCopy.accept}
				</Button>
			</div>
		</section>
	);
}
