import { ImageResponse } from 'next/og';

import { ShareCard } from '@/components/snippets/share-card/share-card';
import { siteConfig } from '@/configs/site';
import { shareImageSize, staticPageSeo } from '@/constants/seo';
import type { RoutePath } from '@/enums/routes';

export const siteHost = new URL(siteConfig.url).host;

const brandSuffix = ` — ${siteConfig.name}`;

/**
 * A generated share card from a label and a title — for pages without a
 * record, such as the legal pages.
 */
export function renderShareCard(label: string, title: string) {
	return new ImageResponse(
		<ShareCard
			eyebrow={label}
			title={title}
			footnote={siteHost}
		/>,
		shareImageSize
	);
}

/** The generated share card for home and the top-level pages. */
export function renderStaticPageShareCard(route: RoutePath) {
	const { label, title } = staticPageSeo[route];
	// The brand already sits in the card's footer.
	const cardTitle = title.replace(brandSuffix, '');

	return renderShareCard(label, cardTitle);
}

/**
 * Serves an uploaded share image as stored. `next/og` can't draw WebP, which
 * is what the media library outputs, so the bytes pass through untouched.
 * Falls back to `fallback` if the upload can't be fetched.
 */
export async function serveUploadedShareImage(
	url: string,
	fallback: () => ImageResponse
): Promise<Response> {
	const upload = await fetch(url);

	if (!upload.ok || !upload.body) return fallback();

	return new Response(upload.body, {
		headers: {
			'content-type': upload.headers.get('content-type') ?? 'image/webp'
		}
	});
}
