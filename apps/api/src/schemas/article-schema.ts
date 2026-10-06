import { z } from 'zod';

import { slugSchema } from './slug-schema.js';
import {
	articleHrefPattern,
	articleImageAspects,
	articleLimits
} from '../constants/article.js';
import { ArticleSort } from '../enums/article-sort.js';
import { ArticleVisibility } from '../enums/article-visibility.js';
import { ArticleCategory, PublishStatus } from '../generated/prisma/enums.js';

const limits = articleLimits;

const text = (max: number) => z.string().trim().min(1).max(max);

/** Optional text — blank or `null` clears it. */
const optionalText = (max: number) =>
	z
		.string()
		.trim()
		.max(max)
		.nullable()
		.transform((value) => value || null);

/** One run of text with its marks. Absent marks are left out, never `false`. */
const textSpanSchema = z.object({
	text: z.string(),
	bold: z.literal(true).optional(),
	italic: z.literal(true).optional(),
	code: z.literal(true).optional(),
	href: z
		.string()
		.trim()
		.max(limits.href)
		.regex(
			articleHrefPattern,
			'Links go to a path on this site (/…) or an https:// address.'
		)
		.optional()
});

export type TextSpan = z.infer<typeof textSpanSchema>;

const sameMarks = (a: TextSpan, b: TextSpan) =>
	a.bold === b.bold &&
	a.italic === b.italic &&
	a.code === b.code &&
	a.href === b.href;

/**
 * Drops empty spans and merges neighbours with the same marks, so the same
 * text always stores the same way.
 */
export function normaliseSpans(spans: TextSpan[]): TextSpan[] {
	return spans.reduce<TextSpan[]>((merged, span) => {
		if (!span.text) return merged;
		const previous = merged.at(-1);
		if (previous && sameMarks(previous, span)) {
			merged[merged.length - 1] = {
				...previous,
				text: previous.text + span.text
			};
			return merged;
		}
		merged.push(span);
		return merged;
	}, []);
}

/** Inline content up to `max` characters, with at least one visible one. */
const inlineContent = (max: number) =>
	z
		.array(textSpanSchema)
		.max(limits.spansMax)
		.transform(normaliseSpans)
		.refine(
			(spans) => spans.some((span) => span.text.trim()),
			'Write some text.'
		)
		.refine(
			(spans) =>
				spans.reduce((sum, span) => sum + span.text.length, 0) <= max,
			`Keep it to ${max} characters.`
		);

const paragraphBlock = z.object({
	type: z.literal('paragraph'),
	content: inlineContent(limits.paragraph)
});

const headingBlock = z.object({
	type: z.literal('heading'),
	level: z.union([z.literal(2), z.literal(3)]),
	text: text(limits.heading)
});

const listBlock = z.object({
	type: z.literal('list'),
	ordered: z.boolean().optional(),
	items: z
		.array(inlineContent(limits.listItem))
		.min(1)
		.max(limits.listItemsMax)
});

const quoteBlock = z.object({
	type: z.literal('quote'),
	content: inlineContent(limits.quote),
	attribution: z.string().trim().max(limits.attribution).optional()
});

const codeBlock = z.object({
	type: z.literal('code'),
	language: text(limits.codeLanguage),
	code: z.string().min(1).max(limits.code)
});

/** Stores the media `uuid`; `src` is only ever added to responses. */
const imageBlock = z.object({
	type: z.literal('image'),
	mediaUuid: z.uuid().optional(),
	alt: text(limits.imageAlt),
	caption: z.string().trim().max(limits.imageCaption).optional(),
	aspect: z.enum(articleImageAspects).optional()
});

export const articleBlockSchema = z.discriminatedUnion('type', [
	paragraphBlock,
	headingBlock,
	listBlock,
	quoteBlock,
	codeBlock,
	imageBlock
]);

export type ArticleBlock = z.infer<typeof articleBlockSchema>;

export const articleBodySchema = z
	.array(articleBlockSchema)
	.min(limits.blocksMin, 'Add at least one block to the body.')
	.max(limits.blocksMax);

/** Trimmed, blank ones dropped, duplicates (ignoring case) dropped. */
const tagsSchema = z
	.array(z.string().trim().max(limits.tag))
	.transform((tags) =>
		tags.filter(
			(tag, index) =>
				tag &&
				tags.findIndex(
					(other) => other.toLowerCase() === tag.toLowerCase()
				) === index
		)
	)
	.pipe(z.array(z.string()).max(limits.tagsMax));

/** ISO date-time with an offset; `null` (or blank) clears it. */
const publishAt = z
	.union([z.iso.datetime({ offset: true }), z.literal('')])
	.nullable()
	.transform((value) => (value ? new Date(value) : null));

export const articleUuidSchema = z.object({ uuid: z.uuid() });

export const articleSlugParamSchema = z.object({ slug: slugSchema });

export const listArticlesQuerySchema = z.object({
	search: z.string().trim().max(120).optional(),
	category: z.enum(ArticleCategory).optional(),
	visibility: z.enum(ArticleVisibility).optional()
});

export const listPublicArticlesQuerySchema = z.object({
	search: z.string().trim().max(120).optional(),
	category: z.enum(ArticleCategory).optional(),
	tag: z.string().trim().max(limits.tag).optional(),
	sort: z.enum(ArticleSort).optional()
});

/** Everything the page says — required on create. */
const contentSchema = z.object({
	title: text(limits.title),
	excerpt: text(limits.excerpt),
	category: z.enum(ArticleCategory),
	tags: tagsSchema,
	/** A user shown on the website; `null` → the company byline. */
	authorUuid: z.uuid().nullable(),
	body: articleBodySchema,
	seoTitle: optionalText(limits.seoTitle),
	seoDescription: optionalText(limits.seoDescription),
	noindex: z.boolean()
});

/** A new article always starts as a Draft; the slug defaults to the title's. */
export const createArticleSchema = contentSchema.extend({
	slug: slugSchema.optional(),
	tags: contentSchema.shape.tags.optional(),
	authorUuid: contentSchema.shape.authorUuid.optional(),
	seoTitle: contentSchema.shape.seoTitle.optional(),
	seoDescription: contentSchema.shape.seoDescription.optional(),
	noindex: contentSchema.shape.noindex.optional(),
	publishAt: publishAt.optional()
});

export const updateArticleSchema = contentSchema
	.extend({
		slug: slugSchema,
		status: z.enum(PublishStatus),
		publishAt
	})
	.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ListArticlesFilters = z.infer<typeof listArticlesQuerySchema>;
export type ListPublicArticlesFilters = z.infer<
	typeof listPublicArticlesQuerySchema
>;
