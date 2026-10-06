import { ImageResponse } from 'next/og';

import { ShareCard } from '@/components/snippets/share-card/share-card';
import { siteConfig } from '@/configs/site';
import { shareImageSize } from '@/constants/seo';
import {
	getPublishedArticle,
	getPublishedArticles
} from '@/utils/articles-api';
import { serveUploadedShareImage } from '@/utils/share-card';

export const alt = 'Flizz article: its title, category and author';
export const size = shareImageSize;
export const contentType = 'image/png';

export async function generateStaticParams() {
	return (await getPublishedArticles()).map((article) => ({
		slug: article.slug
	}));
}

/**
 * The article's share image, else its cover, else a generated card — so every
 * share card is right the moment a piece is published. All three come from
 * this route: an image set in `generateMetadata` would replace it everywhere.
 */
export default async function OpengraphImage({
	params
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const article = await getPublishedArticle(slug);
	const uploaded = article?.ogImage ?? article?.coverImage;

	const renderCard = () =>
		new ImageResponse(
			<ShareCard
				eyebrow={article?.category ?? siteConfig.name}
				title={article?.title ?? siteConfig.tagline}
				footnote={article?.author?.name}
			/>,
			size
		);

	return uploaded
		? serveUploadedShareImage(uploaded, renderCard)
		: renderCard();
}
