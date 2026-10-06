import type { InlineContent } from '@workspace/api-services';

interface InlinePreviewProps {
	content: InlineContent;
}

/**
 * How a text box's marks will read — bold, italic, code and links. Links
 * don't navigate here; their target shows on hover.
 */
export function InlinePreview({ content }: InlinePreviewProps) {
	return (
		<>
			{content.map((span, index) => {
				let node: React.ReactNode = span.text;
				if (span.code) {
					node = (
						<code className="rounded bg-muted px-1 font-mono text-[0.9em]">
							{node}
						</code>
					);
				}
				if (span.italic) node = <em>{node}</em>;
				if (span.bold) node = <strong>{node}</strong>;
				if (span.href) {
					node = (
						<span
							className="text-primary underline underline-offset-2"
							title={span.href}
						>
							{node}
						</span>
					);
				}

				// Spans have no identity beyond their position in the text.

				return <span key={index}>{node}</span>;
			})}
		</>
	);
}
