import type {
	ArticleBlockType,
	ArticleImageAspect
} from '@workspace/api-services';

/**
 * A body block while it's being edited. Text that takes inline marks is kept
 * as the markup the author typed, so typing is never re-parsed under their
 * cursor; it becomes spans only on save (`toArticleBlocks`).
 */
interface EditorBlockBase {
	/** Stable React key — not saved. */
	key: string;
}

export interface EditorParagraph extends EditorBlockBase {
	type: ArticleBlockType.PARAGRAPH;
	markup: string;
}

export interface EditorHeading extends EditorBlockBase {
	type: ArticleBlockType.HEADING;
	level: 2 | 3;
	text: string;
}

export interface EditorList extends EditorBlockBase {
	type: ArticleBlockType.LIST;
	ordered: boolean;
	/** One item per line, each in markup. */
	markup: string;
}

export interface EditorQuote extends EditorBlockBase {
	type: ArticleBlockType.QUOTE;
	markup: string;
	attribution: string;
}

export interface EditorCode extends EditorBlockBase {
	type: ArticleBlockType.CODE;
	language: string;
	code: string;
}

export interface EditorImage extends EditorBlockBase {
	type: ArticleBlockType.IMAGE;
	mediaUuid?: string;
	/** For the preview only — never saved. */
	src?: string;
	alt: string;
	caption: string;
	aspect: ArticleImageAspect;
}

export type EditorBlock =
	| EditorParagraph
	| EditorHeading
	| EditorList
	| EditorQuote
	| EditorCode
	| EditorImage;

/** A body image just uploaded — what the image slot needs to show and save it. */
export interface UploadedBodyImage {
	uuid: string;
	url: string;
}

/** What the app passes to render its own uploader inside an image block. */
export interface BodyImageUploadSlot {
	hasImage: boolean;
	onUploaded: (image: UploadedBodyImage) => void;
	onRemove: () => void;
}
