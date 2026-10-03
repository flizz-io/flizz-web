import type { LegalSummaryItem } from '@/types/legal';

interface LegalSummaryProps {
	items: LegalSummaryItem[];
}

/**
 * The plain-language version, before the full text. Most people read only
 * this, so it has to be true on its own — every line here is backed by a
 * section below.
 */
export function LegalSummary({ items }: LegalSummaryProps) {
	return (
		<section
			aria-labelledby="legal-summary-title"
			className="rounded-xl border border-border bg-card/60 px-6 py-7 sm:px-8"
		>
			<h2
				id="legal-summary-title"
				className="font-heading text-xl font-semibold tracking-tight text-foreground"
			>
				The short version
			</h2>
			<dl className="mt-5 divide-y divide-border">
				{items.map((item) => (
					<div
						key={item.term}
						className="grid gap-1 py-4 last:pb-0 sm:grid-cols-[9.5rem_1fr] sm:gap-6"
					>
						<dt className="font-medium text-foreground">
							{item.term}
						</dt>
						<dd className="text-pretty text-muted-foreground">
							{item.value}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
