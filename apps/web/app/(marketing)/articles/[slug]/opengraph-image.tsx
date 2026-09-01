import { ImageResponse } from 'next/og';

import { siteConfig } from '@/configs/site';
import { articles } from '@/constants/articles';

export const alt = 'Flizz article';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
	return articles.map((article) => ({ slug: article.slug }));
}

/**
 * Generated rather than designed per article, so every share card is correct
 * the moment a piece is published and nobody has to remember to make one.
 * Deliberately plain — system fonts only, since loading the brand faces here
 * would mean shipping font binaries into the edge bundle for a 1200x630 png.
 */
export default async function OpengraphImage({
	params
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const article = articles.find((entry) => entry.slug === slug);

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				background: '#08060d',
				padding: '72px',
				color: '#f7f5fb'
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: 999,
						background: '#8b5cf6'
					}}
				/>
				<div
					style={{
						fontSize: 24,
						letterSpacing: 6,
						textTransform: 'uppercase',
						color: '#9d94b8'
					}}
				>
					{article?.category ?? siteConfig.name}
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					fontSize: article && article.title.length > 42 ? 64 : 78,
					lineHeight: 1.1,
					fontWeight: 600,
					letterSpacing: -1.5,
					maxWidth: 960
				}}
			>
				{article?.title ?? siteConfig.tagline}
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					fontSize: 24,
					color: '#9d94b8'
				}}
			>
				<div style={{ display: 'flex' }}>{siteConfig.fullname}</div>
				<div style={{ display: 'flex' }}>{article?.author ?? ''}</div>
			</div>
		</div>,
		size
	);
}
