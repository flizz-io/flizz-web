import type { Metadata } from 'next';

import { siteConfig } from '@/configs/site';
import { OgType } from '@/enums/seo';
import type { PageImage, PageMetadataInput } from '@/types/seo';

/**
 * `{ images }` only when there is one. Even an `images: undefined` key counts
 * as set and hides the route's generated `opengraph-image`.
 */
function toImageField(image?: PageImage) {
	if (!image) return {};

	return {
		images: [
			{
				url: image.url,
				alt: image.alt,
				width: image.width,
				height: image.height
			}
		]
	};
}

/**
 * The full metadata for one page: title, description, canonical, robots and
 * the whole Open Graph and Twitter set.
 *
 * Next merges metadata shallowly, so a page that sets `openGraph` replaces the
 * root layout's object outright and one that doesn't inherits the home page's
 * title and URL. Building every page's set here means no page can drop a field.
 * Leave `image` out to keep the route's generated `opengraph-image`.
 */
export function buildPageMetadata({
	title,
	description,
	path,
	absoluteTitle = false,
	type = OgType.WEBSITE,
	image,
	noindex = false,
	keywords,
	article
}: PageMetadataInput): Metadata {
	const imageField = toImageField(image);
	const shared = {
		url: path,
		siteName: siteConfig.name,
		locale: siteConfig.locale,
		title,
		description,
		...imageField
	};

	return {
		title: absoluteTitle ? { absolute: title } : title,
		description,
		keywords,
		alternates: { canonical: path },
		robots: { index: !noindex, follow: true },
		openGraph:
			type === OgType.ARTICLE
				? { ...shared, type: 'article', ...article }
				: { ...shared, type: 'website' },
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			...imageField
		}
	};
}
