import type { InlineContent, TextSpan } from '@workspace/api-services';

/**
 * The small markup each text box takes, stored as spans — never as markup:
 * `**bold**`, `_italic_`, `` `code` ``, `[text](/path or https://…)`, and `\`
 * to escape any of those characters. See
 * docs/requirements/articles-crud.md#body-format.
 */

type Marks = Omit<TextSpan, 'text'>;

const BOLD = '**';
const ITALIC = '_';
const CODE = '`';
const ESCAPE = '\\';

const isWordChar = (char: string | undefined) =>
	char !== undefined && /[\p{L}\p{N}]/u.test(char);

const sameMarks = (a: Marks, b: Marks) =>
	a.bold === b.bold &&
	a.italic === b.italic &&
	a.code === b.code &&
	a.href === b.href;

/**
 * Drops empty spans and merges neighbours with the same marks — the same rule
 * the API applies, so what the editor shows is what gets stored.
 */
export function normaliseSpans(spans: InlineContent): InlineContent {
	return spans.reduce<InlineContent>((merged, span) => {
		if (!span.text) return merged;
		const previous = merged.at(-1);
		if (previous && sameMarks(previous, span)) {
			merged[merged.length - 1] = {
				...previous,
				text: previous.text + span.text
			};
		} else {
			merged.push(span);
		}
		return merged;
	}, []);
}

/** The next unescaped `token` at or after `from`, or -1. */
function findClosing(source: string, token: string, from: number) {
	for (let index = from; index < source.length; index += 1) {
		if (source[index] === ESCAPE) {
			index += 1;
			continue;
		}
		if (source.startsWith(token, index)) return index;
	}
	return -1;
}

const isSpace = (char: string | undefined) =>
	char !== undefined && /\s/u.test(char);

/**
 * `_` opens italics only at the start of a word and before a non-space, so
 * `snake_case` stays as typed.
 */
function opensItalic(source: string, index: number) {
	const next = source[index + 1];

	return (
		!isWordChar(source[index - 1]) && next !== undefined && !isSpace(next)
	);
}

/** The first unescaped `_` after a non-space closes them. */
function findItalicClose(source: string, from: number) {
	let index = findClosing(source, ITALIC, from);
	while (index !== -1 && isSpace(source[index - 1])) {
		index = findClosing(source, ITALIC, index + 1);
	}
	return index;
}

function unescape(text: string) {
	return text.replace(/\\(.)/gu, '$1');
}

function parseWithMarks(source: string, marks: Marks): InlineContent {
	const spans: InlineContent = [];
	let buffer = '';
	const flush = () => {
		if (buffer) spans.push({ text: buffer, ...marks });
		buffer = '';
	};

	let index = 0;
	while (index < source.length) {
		const char = source[index] ?? '';

		if (char === ESCAPE && index + 1 < source.length) {
			buffer += source[index + 1];
			index += 2;
			continue;
		}

		if (source.startsWith(BOLD, index)) {
			const close = findClosing(source, BOLD, index + BOLD.length);
			if (close > index + BOLD.length) {
				flush();
				spans.push(
					...parseWithMarks(
						source.slice(index + BOLD.length, close),
						{
							...marks,
							bold: true
						}
					)
				);
				index = close + BOLD.length;
				continue;
			}
		}

		if (char === ITALIC && opensItalic(source, index)) {
			const close = findItalicClose(source, index + 1);
			if (close > index + 1) {
				flush();
				spans.push(
					...parseWithMarks(source.slice(index + 1, close), {
						...marks,
						italic: true
					})
				);
				index = close + 1;
				continue;
			}
		}

		if (char === CODE) {
			const close = findClosing(source, CODE, index + 1);
			if (close > index + 1) {
				flush();
				spans.push({
					text: unescape(source.slice(index + 1, close)),
					...marks,
					code: true
				});
				index = close + 1;
				continue;
			}
		}

		if (char === '[' && !marks.href) {
			const textEnd = findClosing(source, ']', index + 1);
			if (textEnd > index + 1 && source[textEnd + 1] === '(') {
				const hrefEnd = findClosing(source, ')', textEnd + 2);
				const href = source.slice(textEnd + 2, hrefEnd).trim();
				if (hrefEnd !== -1 && href) {
					flush();
					spans.push(
						...parseWithMarks(source.slice(index + 1, textEnd), {
							...marks,
							href
						})
					);
					index = hrefEnd + 1;
					continue;
				}
			}
		}

		buffer += char;
		index += 1;
	}
	flush();

	return spans;
}

/** Markup → spans. Unclosed markers are kept as typed. */
export function parseInlineMarkup(source: string): InlineContent {
	return normaliseSpans(parseWithMarks(source, {}));
}

/**
 * Escapes what would otherwise open a mark. Inside italics every `_` is
 * escaped, since any of them could close the run early.
 */
function escapeText(text: string, inItalic: boolean) {
	return text
		.replace(/[\\`*[\]]/gu, (char) => `${ESCAPE}${char}`)
		.replace(/_/gu, (char, offset: number) =>
			!inItalic &&
			isWordChar(text[offset - 1]) &&
			isWordChar(text[offset + 1])
				? char
				: `${ESCAPE}${char}`
		);
}

/** Italic runs can't start or end on a space — keep those spaces outside. */
function splitEdgeSpaces(text: string) {
	const match = /^(\s*)([\s\S]*?)(\s*)$/u.exec(text);

	return {
		before: match?.[1] ?? '',
		core: match?.[2] ?? text,
		after: match?.[3] ?? ''
	};
}

function serializeSpan(span: TextSpan) {
	const { before, core, after } = span.italic
		? splitEdgeSpaces(span.text)
		: { before: '', core: span.text, after: '' };
	if (!core) return escapeText(span.text, false);

	let markup = span.code
		? `${CODE}${core.replace(/[\\`]/gu, (char) => `${ESCAPE}${char}`)}${CODE}`
		: escapeText(core, Boolean(span.italic));
	if (span.italic) markup = `${ITALIC}${markup}${ITALIC}`;
	if (span.bold) markup = `${BOLD}${markup}${BOLD}`;
	if (span.href) markup = `[${markup}](${span.href})`;

	return `${escapeText(before, false)}${markup}${escapeText(after, false)}`;
}

/** Spans → markup, for editing a saved article. */
export function serializeInlineMarkup(spans: InlineContent): string {
	return normaliseSpans(spans).map(serializeSpan).join('');
}

/** Spans as plain text — previews, counts and empty checks. */
export function inlineText(spans: InlineContent): string {
	return spans.map((span) => span.text).join('');
}
