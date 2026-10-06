import type { ArticleFormValues } from '@/types/article-form';
import {
	ArticleBlockType,
	ArticleCategory,
	PublishStatus,
	type ArticleRecord,
	type CreateArticlePayload,
	type UpdateArticlePayload
} from '@workspace/api-services';
import {
	newEditorBlock,
	toArticleBlocks,
	toEditorBlocks
} from '@workspace/text-editor';

const BODY_ERROR_PREFIX = 'body.';

/** A new article's starting values — one empty paragraph to write into. */
export function emptyArticleValues(): ArticleFormValues {
	return {
		title: '',
		slug: '',
		excerpt: '',
		category: ArticleCategory.ENGINEERING,
		tags: [],
		authorUuid: '',
		body: [newEditorBlock(ArticleBlockType.PARAGRAPH)],
		seoTitle: '',
		seoDescription: '',
		noindex: false,
		status: PublishStatus.DRAFT,
		publishAt: ''
	};
}

export function articleToValues(article: ArticleRecord): ArticleFormValues {
	return {
		title: article.title,
		slug: article.slug,
		excerpt: article.excerpt,
		category: article.category,
		tags: article.tags,
		authorUuid: article.author?.uuid ?? '',
		body: toEditorBlocks(article.body),
		seoTitle: article.seoTitle ?? '',
		seoDescription: article.seoDescription ?? '',
		noindex: article.noindex,
		status: article.status,
		publishAt: article.publishAt ?? ''
	};
}

function contentPayload(values: ArticleFormValues) {
	return {
		title: values.title,
		excerpt: values.excerpt,
		category: values.category,
		tags: values.tags,
		authorUuid: values.authorUuid || null,
		body: toArticleBlocks(values.body),
		seoTitle: values.seoTitle.trim() || null,
		seoDescription: values.seoDescription.trim() || null,
		noindex: values.noindex
	};
}

/** A new article — always a Draft; a blank slug lets the API make one. */
export function toCreateArticlePayload(
	values: ArticleFormValues
): CreateArticlePayload {
	const slug = values.slug.trim();

	return {
		...contentPayload(values),
		...(slug ? { slug } : {}),
		publishAt: values.publishAt || null
	};
}

/** Every field — the form always saves the whole article. */
export function toUpdateArticlePayload(
	values: ArticleFormValues
): UpdateArticlePayload {
	return {
		...contentPayload(values),
		slug: values.slug,
		status: values.status,
		publishAt: values.publishAt || null
	};
}

/** The API's `body.3.alt` errors, re-keyed as the editor reads them (`3.alt`). */
export function bodyErrorsOf(errors: Record<string, string>) {
	return Object.fromEntries(
		Object.entries(errors).flatMap(([path, message]) =>
			path === 'body'
				? []
				: path.startsWith(BODY_ERROR_PREFIX)
					? [[path.slice(BODY_ERROR_PREFIX.length), message]]
					: []
		)
	);
}

/** Adds a tag unless it's blank, too long, already there (any case) or one too many. */
export function addTag(
	tags: string[],
	raw: string,
	max: number,
	maxLength: number
) {
	const tag = raw.trim().slice(0, maxLength);
	if (
		!tag ||
		tags.length >= max ||
		tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())
	) {
		return tags;
	}

	return [...tags, tag];
}
