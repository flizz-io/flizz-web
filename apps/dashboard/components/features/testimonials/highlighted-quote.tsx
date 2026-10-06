import { Fragment } from 'react';

import { splitOnHighlights } from '@/utils/testimonial-form';
import { cn } from '@workspace/ui/lib/utils';

interface HighlightedQuoteProps {
	quote: string;
	highlights: string[];
	className?: string;
}

/** The quote with its highlights lit, as the home page sets them. */
export function HighlightedQuote({
	quote,
	highlights,
	className
}: HighlightedQuoteProps) {
	return (
		<p className={cn('text-pretty', className)}>
			{splitOnHighlights(quote, highlights).map((part, index) => (
				<Fragment key={index}>
					{part.lit ? (
						<span className="font-medium text-primary">
							{part.text}
						</span>
					) : (
						part.text
					)}
				</Fragment>
			))}
		</p>
	);
}
