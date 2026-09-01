import type { ArticleBlock } from '@/types/articles';

/** Roughly average adult reading speed for technical prose. */
const wordsPerMinute = 200;

/** What looking at a diagram costs, in words. About twelve seconds. */
const imageWordEquivalent = 40;

function countWords(value: string): number {
	return value.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Counted from the body at render time rather than stored on the article, so
 * the figure can never go stale against an edited draft.
 */
export function getReadingMinutes(body: ArticleBlock[]): number {
	const words = body.reduce((total, block) => {
		switch (block.type) {
			case 'paragraph':
			case 'quote':
				return total + countWords(block.text);
			case 'heading':
				return total + countWords(block.text);
			case 'list':
				return (
					total +
					block.items.reduce((sum, item) => sum + countWords(item), 0)
				);
			case 'code':
				// Code is scanned, not read, so it counts for far less.
				return total + Math.ceil(countWords(block.code) / 4);
			case 'image':
				// A diagram costs time to parse even though it carries no
				// prose. Roughly twelve seconds, plus whatever the caption says.
				return (
					total +
					imageWordEquivalent +
					countWords(block.caption ?? '')
				);
		}
	}, 0);

	return Math.max(1, Math.round(words / wordsPerMinute));
}

/** e.g. "12 August 2026" — spelled out, since articles are read not scanned. */
export function formatArticleDate(isoDate: string): string {
	return new Date(isoDate).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}
