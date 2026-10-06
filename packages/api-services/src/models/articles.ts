import type { UserReference } from './auth';
import type { ProjectImage } from './projects';
import type {
	ArticleBlockType,
	ArticleCategory,
	ArticleImageAspect,
	ArticleSortOrder,
	ArticleVisibility
} from '../enums/articles';
import type { PublishStatus } from '../enums/services';

/** One run of text with its marks. Absent marks are left out, never `false`. */
export interface TextSpan {
	text: string;
	bold?: true;
	italic?: true;
	code?: true;
	/** A path on the site (`/services/…`) or an `https://` URL. */
	href?: string;
}

/** Paragraph, list item and quote text. */
export type InlineContent = TextSpan[];

export interface ParagraphBlock {
	type: ArticleBlockType.PARAGRAPH;
	content: InlineContent;
}

export interface HeadingBlock {
	type: ArticleBlockType.HEADING;
	/** The title is the page's `h1`, so body headings start at 2. */
	level: 2 | 3;
	text: string;
}

export interface ListBlock {
	type: ArticleBlockType.LIST;
	ordered?: boolean;
	items: InlineContent[];
}

export interface QuoteBlock {
	type: ArticleBlockType.QUOTE;
	content: InlineContent;
	attribution?: string;
}

export interface CodeBlock {
	type: ArticleBlockType.CODE;
	language: string;
	code: string;
}

export interface ImageBlock {
	type: ArticleBlockType.IMAGE;
	/** Saved: the body upload's media id. Absent → the reserved slot. */
	mediaUuid?: string;
	/** Responses only — the URL `mediaUuid` resolves to. Never sent back. */
	src?: string;
	alt: string;
	caption?: string;
	aspect?: ArticleImageAspect;
}

/**
 * One unit of an article body — the JSON the API stores and the web renderer
 * is written against. See docs/requirements/articles-crud.md#body-format.
 */
export type ArticleBlock =
	| ParagraphBlock
	| HeadingBlock
	| ListBlock
	| QuoteBlock
	| CodeBlock
	| ImageBlock;

/** A public image block never carries the media id. */
export type PublicArticleBlock =
	Exclude<ArticleBlock, ImageBlock> | Omit<ImageBlock, 'mediaUuid'>;

/** A row on the dashboard list — `GET /api/articles`. */
export interface ArticleListItem {
	uuid: string;
	slug: string;
	title: string;
	category: ArticleCategory;
	tags: string[];
	status: PublishStatus;
	visibility: ArticleVisibility;
	publishAt: string | null;
	/** The public date — publish date, else first publish; null until then. */
	publishedAt: string | null;
	coverUrl: string | null;
	author: UserReference | null;
	updatedAt: string;
	updatedBy: UserReference | null;
}

/** The cover and share image — what the media endpoints return. */
export interface ArticleMedia {
	cover: ProjectImage | null;
	ogImage: ProjectImage | null;
}

/** One article with every field — `GET /api/articles/:uuid`. */
export interface ArticleRecord extends ArticleListItem, ArticleMedia {
	excerpt: string;
	body: ArticleBlock[];
	seoTitle: string | null;
	seoDescription: string | null;
	noindex: boolean;
	firstPublishedAt: string | null;
	createdAt: string;
	createdBy: UserReference | null;
}

/** `GET /api/articles` filters. */
export interface ArticleListQuery {
	search?: string;
	category?: ArticleCategory;
	visibility?: ArticleVisibility;
}

/** The author dropdown — people shown on the website. */
export interface ArticleAuthorOption {
	uuid: string;
	name: string;
	designation: string | null;
}

/** A tag in use, with how many articles carry it. */
export interface ArticleTag {
	tag: string;
	count: number;
}

/** Everything the page says — required on create (optional ones may be `null`). */
export interface ArticleContentPayload {
	title: string;
	excerpt: string;
	category: ArticleCategory;
	tags: string[];
	/** `null` → the company byline. */
	authorUuid: string | null;
	body: ArticleBlock[];
	seoTitle: string | null;
	seoDescription: string | null;
	noindex: boolean;
}

/** `POST /api/articles` — always a Draft; slug defaults to the title's. */
export type CreateArticlePayload = Pick<
	ArticleContentPayload,
	'title' | 'excerpt' | 'category' | 'body'
> &
	Partial<
		Omit<ArticleContentPayload, 'title' | 'excerpt' | 'category' | 'body'>
	> & { slug?: string; publishAt?: string | null };

/** `PATCH /api/articles/:uuid` — any subset. */
export type UpdateArticlePayload = Partial<
	ArticleContentPayload & {
		slug: string;
		status: PublishStatus;
		/** ISO date-time with an offset; `null` clears it. */
		publishAt: string | null;
	}
>;

/** The byline on the website. Unset links are left out. */
export interface PublicArticleAuthor {
	name: string;
	role: string;
	photo?: string;
	links: { linkedin?: string; x?: string; portfolio?: string };
}

/** A visible article on the website — list rows and static params. */
export interface PublicArticle {
	slug: string;
	title: string;
	excerpt: string;
	category: ArticleCategory;
	tags: string[];
	/** ISO date-time; the list is ordered by it. */
	publishedAt: string;
	/** ISO date-time — `dateModified` and the sitemap. */
	updatedAt: string;
	author?: PublicArticleAuthor;
	coverImage?: string;
	/** Computed by the API from the body on every read. */
	readingMinutes: number;
}

/** The detail page — the body plus the SEO fields. */
export interface PublicArticleDetail extends PublicArticle {
	body: PublicArticleBlock[];
	seoTitle?: string;
	seoDescription?: string;
	ogImage?: string;
	noindex?: true;
}

/** `GET /api/public/articles` filters. */
export interface PublicArticleListQuery {
	search?: string;
	category?: ArticleCategory;
	tag?: string;
	sort?: ArticleSortOrder;
}
