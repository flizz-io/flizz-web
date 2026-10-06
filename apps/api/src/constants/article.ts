/** Field limits for articles — docs/requirements/articles-crud.md#fields. */
export const articleLimits = {
	title: 120,
	excerpt: 300,
	tag: 32,
	tagsMax: 8,
	seoTitle: 70,
	seoDescription: 200,
	blocksMin: 1,
	blocksMax: 200,
	paragraph: 5000,
	spansMax: 100,
	heading: 120,
	listItemsMax: 30,
	listItem: 1000,
	quote: 1000,
	attribution: 120,
	code: 10000,
	codeLanguage: 30,
	imageAlt: 200,
	imageCaption: 300,
	href: 500
} as const;

/** Frame shapes an image block may ask for. */
export const articleImageAspects = ['16/9', '4/3', '1/1'] as const;

/**
 * Where a link in an article may point: a path on this site (`/services/…`,
 * not `//host`) or an absolute `https://` URL. Nothing else — no
 * `javascript:`, `mailto:` or plain `http:`.
 */
export const articleHrefPattern = /^(\/(?!\/)\S*|https:\/\/\S+)$/;
