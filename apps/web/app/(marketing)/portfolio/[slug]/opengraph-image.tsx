import { ImageResponse } from 'next/og';

import { ShareCard } from '@/components/snippets/share-card/share-card';
import { siteConfig } from '@/configs/site';
import { shareCardColors, shareImageSize } from '@/constants/seo';
import {
	getPortfolioProject,
	getPortfolioProjects
} from '@/utils/projects-api';

export const alt = 'Flizz case study: the project, its sector and its result';
export const size = shareImageSize;
export const contentType = 'image/png';

export async function generateStaticParams() {
	return (await getPortfolioProjects()).map((project) => ({
		slug: project.slug
	}));
}

/**
 * Generated rather than designed per project, so every share card is correct
 * the moment a case study is published. The headline result travels with the
 * name — the card has to say what the work did, not just what it was called.
 */
export default async function OpengraphImage({
	params
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const project = await getPortfolioProject(slug);
	const headline = project?.results[0];

	return new ImageResponse(
		<ShareCard
			eyebrow={project?.sector ?? siteConfig.name}
			title={project?.name ?? siteConfig.tagline}
			footnote={project?.year}
			detail={
				headline ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 20,
							fontSize: 30
						}}
					>
						<div
							style={{
								display: 'flex',
								color: shareCardColors.muted
							}}
						>
							{headline.from}
						</div>
						<div
							style={{
								width: 40,
								height: 1,
								background: shareCardColors.rule
							}}
						/>
						<div
							style={{
								display: 'flex',
								color: shareCardColors.highlight
							}}
						>
							{headline.to}
						</div>
					</div>
				) : undefined
			}
		/>,
		size
	);
}
