import type { ArticleBlock, TextSpan } from '../schemas/article-schema.js';

/** Roughly average adult reading speed for technical prose. */
const wordsPerMinute = 200;

/** What looking at a diagram costs, in words. About twelve seconds. */
const imageWordEquivalent = 40;

/** Code is scanned, not read, so it counts for a quarter. */
const codeWordDivisor = 4;

function countWords(value: string): number {
	return value.trim().split(/\s+/u).filter(Boolean).length;
}

const spanWords = (spans: TextSpan[]) =>
	countWords(spans.map((span) => span.text).join(''));

/**
 * Minutes to read a body — computed on every read, never stored, so it can't
 * go stale against an edit. Images add a fixed cost plus their caption, so a
 * diagram never makes an article look shorter.
 */
export function readingMinutesOf(body: ArticleBlock[]): number {
	const words = body.reduce((total, block) => {
		switch (block.type) {
			case 'paragraph':
			case 'quote':
				return total + spanWords(block.content);
			case 'heading':
				return total + countWords(block.text);
			case 'list':
				return (
					total +
					block.items.reduce((sum, item) => sum + spanWords(item), 0)
				);
			case 'code':
				return (
					total + Math.ceil(countWords(block.code) / codeWordDivisor)
				);
			case 'image':
				return (
					total +
					imageWordEquivalent +
					countWords(block.caption ?? '')
				);
		}
	}, 0);

	return Math.max(1, Math.round(words / wordsPerMinute));
}
