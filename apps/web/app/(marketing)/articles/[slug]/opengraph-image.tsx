import { ImageResponse } from 'next/og';

import { ShareCard } from '@/components/snippets/share-card/share-card';
import { siteConfig } from '@/configs/site';
import { articles } from '@/constants/articles';
import { shareImageSize } from '@/constants/seo';

export const alt = 'Flizz article: its title, category and author';
export const size = shareImageSize;
export const contentType = 'image/png';

export function generateStaticParams() {
	return articles.map((article) => ({ slug: article.slug }));
}

/**
 * Generated rather than designed per article, so every share card is correct
 * the moment a piece is published and nobody has to remember to make one.
 */
export default async function OpengraphImage({
	params
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const article = articles.find((entry) => entry.slug === slug);

	return new ImageResponse(
		<ShareCard
			eyebrow={article?.category ?? siteConfig.name}
			title={article?.title ?? siteConfig.tagline}
			footnote={article?.author}
		/>,
		size
	);
}
