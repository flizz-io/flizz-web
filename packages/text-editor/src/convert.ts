import {
	ArticleBlockType,
	ArticleImageAspect,
	type ArticleBlock
} from '@workspace/api-services';

import { parseInlineMarkup, serializeInlineMarkup } from './inline-markup';
import type { EditorBlock } from './types';

let keySeed = 0;

/** A fresh React key for a block. */
export function nextBlockKey() {
	keySeed += 1;
	return `block-${keySeed}`;
}

const LINE_BREAK = /\r?\n/u;

/** A new, empty block of `type`. */
export function newEditorBlock(type: ArticleBlockType): EditorBlock {
	const key = nextBlockKey();

	switch (type) {
		case ArticleBlockType.PARAGRAPH:
			return { key, type, markup: '' };
		case ArticleBlockType.HEADING:
			return { key, type, level: 2, text: '' };
		case ArticleBlockType.LIST:
			return { key, type, ordered: false, markup: '' };
		case ArticleBlockType.QUOTE:
			return { key, type, markup: '', attribution: '' };
		case ArticleBlockType.CODE:
			return { key, type, language: '', code: '' };
		case ArticleBlockType.IMAGE:
			return {
				key,
				type,
				alt: '',
				caption: '',
				aspect: ArticleImageAspect.WIDE
			};
	}
}

/** A saved body → editable blocks. */
export function toEditorBlocks(blocks: ArticleBlock[]): EditorBlock[] {
	return blocks.map((block): EditorBlock => {
		const key = nextBlockKey();

		switch (block.type) {
			case ArticleBlockType.PARAGRAPH:
				return {
					key,
					type: block.type,
					markup: serializeInlineMarkup(block.content)
				};
			case ArticleBlockType.HEADING:
				return { key, ...block };
			case ArticleBlockType.LIST:
				return {
					key,
					type: block.type,
					ordered: Boolean(block.ordered),
					markup: block.items.map(serializeInlineMarkup).join('\n')
				};
			case ArticleBlockType.QUOTE:
				return {
					key,
					type: block.type,
					markup: serializeInlineMarkup(block.content),
					attribution: block.attribution ?? ''
				};
			case ArticleBlockType.CODE:
				return { key, ...block };
			case ArticleBlockType.IMAGE:
				return {
					key,
					type: block.type,
					mediaUuid: block.mediaUuid,
					src: block.src,
					alt: block.alt,
					caption: block.caption ?? '',
					aspect: block.aspect ?? ArticleImageAspect.WIDE
				};
		}
	});
}

/** Editable blocks → the body the API stores. Optional fields left out when blank. */
export function toArticleBlocks(blocks: EditorBlock[]): ArticleBlock[] {
	return blocks.map((block): ArticleBlock => {
		switch (block.type) {
			case ArticleBlockType.PARAGRAPH:
				return {
					type: block.type,
					content: parseInlineMarkup(block.markup.trim())
				};
			case ArticleBlockType.HEADING:
				return {
					type: block.type,
					level: block.level,
					text: block.text.trim()
				};
			case ArticleBlockType.LIST:
				return {
					type: block.type,
					...(block.ordered ? { ordered: true } : {}),
					items: block.markup
						.split(LINE_BREAK)
						.map((line) => line.trim())
						.filter(Boolean)
						.map(parseInlineMarkup)
				};
			case ArticleBlockType.QUOTE:
				return {
					type: block.type,
					content: parseInlineMarkup(block.markup.trim()),
					...(block.attribution.trim()
						? { attribution: block.attribution.trim() }
						: {})
				};
			case ArticleBlockType.CODE:
				return {
					type: block.type,
					language: block.language.trim(),
					code: block.code
				};
			case ArticleBlockType.IMAGE:
				return {
					type: block.type,
					...(block.mediaUuid ? { mediaUuid: block.mediaUuid } : {}),
					alt: block.alt.trim(),
					...(block.caption.trim()
						? { caption: block.caption.trim() }
						: {}),
					aspect: block.aspect
				};
		}
	});
}
