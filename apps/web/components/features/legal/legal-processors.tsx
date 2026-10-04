import { legalProcessors } from '@/constants/legal';

/**
 * The services that handle visitor data, one row each. Name and location sit
 * on the left so the list can be scanned for "who, and where" before reading
 * what each one does.
 */
export function LegalProcessors() {
	return (
		<ul className="mt-8 divide-y divide-border border-y border-border">
			{legalProcessors.map((processor) => (
				<li
					key={processor.name}
					className="grid gap-3 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8"
				>
					<div>
						<p className="font-heading text-lg font-semibold text-foreground">
							{processor.name}
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{processor.location}
						</p>
						{processor.consentRequired ? (
							<p className="mt-2 font-mono text-xs tracking-[0.18em] text-primary uppercase">
								With consent
							</p>
						) : null}
					</div>
					<div>
						<p className="text-lg leading-relaxed text-pretty text-foreground">
							{processor.purpose}
						</p>
						<p className="mt-2 leading-relaxed text-pretty text-muted-foreground">
							{processor.data}
						</p>
						<a
							href={processor.policyUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-3 inline-block text-sm text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-primary"
						>
							{processor.name} privacy policy
						</a>
					</div>
				</li>
			))}
		</ul>
	);
}
