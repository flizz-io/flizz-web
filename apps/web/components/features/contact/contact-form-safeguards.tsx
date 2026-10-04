import type { Ref } from 'react';

import { contactHoneypotField } from '@/constants/contact';

interface ContactFormSafeguardsProps {
	turnstileRef: Ref<HTMLDivElement>;
}

/**
 * The spam checks every variation carries, just above its submit row: the
 * honeypot — a field no person sees or reaches by keyboard, so only bots fill
 * it — and the slot Cloudflare Turnstile shows a checkbox in when it isn't
 * sure about a visitor.
 */
export function ContactFormSafeguards({
	turnstileRef
}: ContactFormSafeguardsProps) {
	return (
		<>
			<label
				aria-hidden
				className="sr-only"
			>
				Leave this empty
				<input
					type="text"
					name={contactHoneypotField}
					tabIndex={-1}
					autoComplete="off"
					defaultValue=""
				/>
			</label>
			<div ref={turnstileRef} />
		</>
	);
}
