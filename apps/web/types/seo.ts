import type { OgType } from '@/enums/seo';

/** A share image set on the page itself, instead of a generated one. */
export interface PageImage {
	/** Absolute, or relative to `metadataBase`. */
	url: string;
	/** Describes the image for screen readers and platforms that show it. */
	alt: string;
	width?: number;
	height?: number;
}

/** The `article:*` Open Graph tags for a dated piece. ISO 8601 dates. */
export interface PageArticleMeta {
	publishedTime?: string;
	modifiedTime?: string;
	/** Author names, or the URL of each author's profile. */
	authors?: string[];
	section?: string;
	tags?: string[];
}

export interface PageMetadataInput {
	/** Without the brand — the root template adds `— Flizz` to the tag. */
	title: string;
	description: string;
	/** The canonical path, e.g. `/services/mvp-development`. */
	path: string;
	/**
	 * Use `title` as the whole `<title>`, skipping the brand template — for the
	 * home page, whose title already leads with what the company does.
	 */
	absoluteTitle?: boolean;
	/** `website` unless set. `article` adds the `article:*` tags. */
	type?: OgType;
	/**
	 * Replaces the page's generated `opengraph-image`. Every page segment has
	 * one, since a page's `openGraph` drops any image inherited from a parent.
	 */
	image?: PageImage;
	/** Keeps a single record out of search results. */
	noindex?: boolean;
	keywords?: string[];
	article?: PageArticleMeta;
}

/** Search and share copy for a page without a database record. */
export interface PageSeo {
	/** Short page name — the eyebrow on the page's generated share card. */
	label: string;
	title: string;
	description: string;
}
