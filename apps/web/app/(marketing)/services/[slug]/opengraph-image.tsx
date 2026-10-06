import { ImageResponse } from 'next/og';

import { ShareCard } from '@/components/snippets/share-card/share-card';
import { siteConfig } from '@/configs/site';
import { shareImageSize } from '@/constants/seo';
import {
	getCatalogueService,
	getCatalogueServices
} from '@/utils/services-api';
import { serveUploadedShareImage, siteHost } from '@/utils/share-card';

export const alt = 'Flizz service: its name and category';
export const size = shareImageSize;
export const contentType = 'image/png';

export async function generateStaticParams() {
	return (await getCatalogueServices()).map((service) => ({
		slug: service.slug
	}));
}

/**
 * The service's uploaded share image when it has one, otherwise a generated
 * card. Both come from this route, so `generateMetadata` never sets an image —
 * one there would replace this route's card on every service.
 */
export default async function OpengraphImage({
	params
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const service = await getCatalogueService(slug);

	const renderCard = () =>
		new ImageResponse(
			<ShareCard
				eyebrow={service?.category ?? siteConfig.name}
				title={service?.title ?? siteConfig.tagline}
				footnote={siteHost}
			/>,
			size
		);

	return service?.ogImage
		? serveUploadedShareImage(service.ogImage, renderCard)
		: renderCard();
}
