import Link from 'next/link';
import type { ReactNode } from 'react';

import type { InlineContent as InlineSpans } from '@workspace/api-services';

interface InlineContentProps {
	content: InlineSpans;
}

const linkClass =
	'text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-primary';

/** A site path (`/services/…`) rather than another domain. */
const isInternal = (href: string) => href.startsWith('/');

/**
 * Paragraph, list and quote text — spans with bold, italic, code and links.
 * Links to this site use `<Link>`; others open in a new tab.
 */
export function InlineContent({ content }: InlineContentProps) {
	return (
		<>
			{content.map((span, index) => {
				let node: ReactNode = span.text;
				if (span.code) {
					node = (
						<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
							{node}
						</code>
					);
				}
				if (span.italic) node = <em>{node}</em>;
				if (span.bold) {
					node = (
						<strong className="font-semibold text-foreground">
							{node}
						</strong>
					);
				}
				if (span.href) {
					node = isInternal(span.href) ? (
						<Link
							href={span.href}
							className={linkClass}
						>
							{node}
						</Link>
					) : (
						<a
							href={span.href}
							target="_blank"
							rel="noopener noreferrer"
							className={linkClass}
						>
							{node}
						</a>
					);
				}

				// Spans have no identity beyond their place in the text.

				return <span key={index}>{node}</span>;
			})}
		</>
	);
}
