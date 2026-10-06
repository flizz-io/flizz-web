import { ArticleBlockType, ArticleImageAspect } from '@workspace/api-services';

/**
 * Character caps the boxes enforce while typing — the API's limits
 * (apps/api/src/constants/article.ts), so a save never fails on length.
 */
export const blockLimits = {
	paragraph: 5000,
	heading: 120,
	listItemsMax: 30,
	quote: 1000,
	attribution: 120,
	code: 10000,
	codeLanguage: 30,
	imageAlt: 200,
	imageCaption: 300,
	blocksMax: 200
} as const;

/** The order blocks appear in the "Add block" menu. */
export const blockTypeOrder: ArticleBlockType[] = [
	ArticleBlockType.PARAGRAPH,
	ArticleBlockType.HEADING,
	ArticleBlockType.LIST,
	ArticleBlockType.QUOTE,
	ArticleBlockType.CODE,
	ArticleBlockType.IMAGE
];

export const blockTypeLabels: Record<ArticleBlockType, string> = {
	[ArticleBlockType.PARAGRAPH]: 'Paragraph',
	[ArticleBlockType.HEADING]: 'Heading',
	[ArticleBlockType.LIST]: 'List',
	[ArticleBlockType.QUOTE]: 'Quote',
	[ArticleBlockType.CODE]: 'Code',
	[ArticleBlockType.IMAGE]: 'Image'
};

export const imageAspectLabels: Record<ArticleImageAspect, string> = {
	[ArticleImageAspect.WIDE]: 'Wide (16:9)',
	[ArticleImageAspect.STANDARD]: 'Standard (4:3)',
	[ArticleImageAspect.SQUARE]: 'Square (1:1)'
};

export const blockEditorMessages = {
	empty: 'The body is empty. Add the first block to start writing.',
	addBlock: 'Add block',
	addBlockAfter: 'Add a block below',
	moveUp: 'Move up',
	moveDown: 'Move down',
	remove: 'Remove block',
	markupHint:
		'**bold**, _italic_, `code`, [link text](/services/… or https://…). Escape a character with \\.',
	preview: 'Preview',
	text: 'Text',
	headingLevel: 'Level',
	headingLevels: { 2: 'Heading (H2)', 3: 'Subheading (H3)' },
	listItems: 'Items — one per line',
	listOrdered: 'Numbered list',
	quoteText: 'Quote',
	attribution: 'Attribution (optional)',
	codeLanguage: 'Language (ts, sql, text…)',
	code: 'Code',
	imageAlt: 'Alt text — what the image shows (required)',
	imageCaption: 'Caption (optional)',
	imageAspect: 'Frame',
	imagePending: 'No image yet — the slot shows as reserved on the site.',
	imageUploadUnavailable: 'Save the article first, then upload images.'
} as const;
