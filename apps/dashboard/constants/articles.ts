import { ArticleCategory } from '@workspace/api-services';

export const articlesPath = '/articles';
export const newArticlePath = `${articlesPath}/new`;
export const articlePath = (uuid: string) => `${articlesPath}/${uuid}`;

/** Same wording as the website's filters. */
export const articleCategoryLabels: Record<ArticleCategory, string> = {
	[ArticleCategory.ENGINEERING]: 'Engineering',
	[ArticleCategory.PRODUCT]: 'Product',
	[ArticleCategory.AI]: 'AI',
	[ArticleCategory.PRACTICE]: 'Practice'
};

/** Field limits — the API's (apps/api `articleLimits`); inputs stop here. */
export const articleFieldLimits = {
	title: 120,
	slug: 100,
	excerpt: 300,
	tag: 32,
	tagsMax: 8,
	seoTitle: 70,
	seoDescription: 200
} as const;

/** Upload sizes — the API's presets (`articleCover`, `articleBodyImage`). */
export const articleImageSizes = {
	cover: { width: 1920, height: 1080 },
	body: { width: 1600, height: 1600 }
} as const;

/** The public page an article lives at, for the search preview. */
export const articleSiteUrl = (slug: string) =>
	`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/articles/${slug}`;

export const articlesMessages = {
	title: 'Articles',
	lead: 'The writing on the website. An article shows there once it’s Published and its publish date (if any) has passed.',
	newArticle: 'New article',
	searchPlaceholder: 'Search title, slug or tag',
	anyCategory: 'All categories',
	anyStatus: 'All statuses',
	noArticles: 'No articles yet.',
	noResults: 'No articles match these filters.',
	noCover: 'No cover',
	noAuthor: 'Company byline',
	scheduledFor: (when: string) => `Goes live ${when}`,
	updatedBy: (name: string, when: string) => `${name} · ${when}`,
	columns: {
		article: 'Article',
		category: 'Category',
		author: 'Author',
		status: 'Status',
		published: 'Published',
		updated: 'Last updated'
	}
} as const;

export const articleFormMessages = {
	newTitle: 'New article',
	newLead:
		'It starts as a Draft. Add the cover, share image and body images once it’s saved, then publish when it’s ready.',
	editLead: (slug: string) => `/articles/${slug}`,
	backToList: 'All articles',
	readOnly: 'You can view this article but not change it.',
	create: 'Create draft',
	save: 'Save changes',
	saving: 'Saving…',
	created: (title: string) => `${title} created as a draft.`,
	saved: (title: string) => `${title} saved.`,
	fixErrors: 'Some fields need attention — see the messages below.',
	sections: {
		basics: 'Basics',
		basicsLead: 'What the article is and where it sits on the list page.',
		author: 'Author',
		authorLead:
			'The byline. Only people shown on the website’s About page can be picked; without one the article is bylined to the company.',
		cover: 'Cover',
		coverLead:
			'Optional. A wide banner on the article and a thumbnail on the list. Cropped to 16:9.',
		body: 'Body',
		bodyLead:
			'The article, one block at a time. The title is the page heading, so body headings start at H2.',
		seo: 'Search & social',
		seoLead:
			'Optional. How the page appears in search results and when shared. Empty fields fall back to the title and excerpt.',
		publishing: 'Publishing',
		publishingLead:
			'Public when Published and the publish date (if any) has passed.'
	},
	fields: {
		title: 'Title',
		titleHint: 'The page heading — say what the reader gets.',
		slug: 'Slug',
		slugHint:
			'The URL. Left empty, it’s made from the title. Changing it later keeps the old URL working — it redirects here.',
		slugPlaceholder: 'e.g. your-api-is-a-support-queue',
		excerpt: 'Excerpt',
		excerptHint:
			'One or two lines — the list entry, the lead under the title, and the search snippet unless an SEO description is set.',
		category: 'Category',
		tags: 'Tags',
		tagsHint: (max: number) =>
			`Up to ${max}. Press Enter or comma to add one; existing tags are suggested.`,
		tagsPlaceholder: 'Add a tag',
		removeTag: (tag: string) => `Remove tag ${tag}`,
		author: 'Author',
		noAuthor: 'No author — company byline',
		noAuthors:
			'Nobody is shown on the website yet. An admin turns that on under Team.',
		cover: 'Cover image',
		coverAfterCreate:
			'Save the article first — the cover is added to a saved article.',
		bodyImagesAfterCreate:
			'Save the article first — body images are uploaded to a saved article.',
		seoTitle: 'SEO title',
		seoTitleHint: (target: number) =>
			`Up to about ${target} characters show in search results.`,
		seoDescription: 'SEO description',
		seoDescriptionHint: (min: number, max: number) =>
			`${min}–${max} characters read best.`,
		shareImage: 'Share image',
		shareImageHint:
			'Shown when the article is shared on LinkedIn, X, Slack… Without one, the cover is used, then a generated card.',
		shareImageAfterCreate:
			'Save the article first — the share image is added to a saved article.',
		noindex: 'Hide from search engines',
		noindexHint:
			'For thin or announcement posts. The page still works, but search engines are asked not to list it and it stays out of the sitemap.',
		status: 'Status',
		publishAt: 'Publish date',
		publishAtHint:
			'Optional. In the future, the article stays hidden until then (it appears at the next site refresh after that time).',
		clearDate: 'Clear'
	},
	images: {
		coverSaved: 'Cover updated.',
		coverRemoved: 'Cover removed.',
		shareSaved: 'Share image updated.',
		shareRemoved: 'Share image removed.',
		bodyUploaded: 'Image uploaded — save the article to keep it.',
		coverLabels: {
			choose: 'Upload cover',
			replace: 'Replace cover',
			remove: 'Remove cover'
		},
		shareLabels: {
			choose: 'Upload share image',
			replace: 'Replace share image',
			remove: 'Remove share image'
		},
		bodyLabels: {
			choose: 'Upload image',
			replace: 'Replace image',
			remove: 'Remove image'
		}
	},
	delete: {
		button: 'Delete article',
		title: (title: string) => `Delete ${title}?`,
		body: 'It leaves the dashboard and the website. Its slugs stay reserved, so no other article can take its URL.',
		confirm: 'Delete',
		deleted: (title: string) => `${title} was deleted.`
	}
} as const;
