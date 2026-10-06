import type { Metadata } from 'next';

import { PortfolioArchive } from '@/components/features/portfolio/portfolio-archive';
import { PortfolioCta } from '@/components/features/portfolio/portfolio-cta';
import { PortfolioHero } from '@/components/features/portfolio/portfolio-hero';
import { PortfolioReelSection } from '@/components/features/portfolio/portfolio-reel-section';
import { portfolioHeroLead, portfolioReelVariant } from '@/constants/portfolio';
import { RoutePath } from '@/enums/routes';
import { buildPageMetadata } from '@/utils/metadata';
import { archiveOf, reelOf } from '@/utils/portfolio';
import { getPortfolioProjects } from '@/utils/projects-api';

export const metadata: Metadata = buildPageMetadata({
	title: 'Portfolio',
	description: portfolioHeroLead,
	path: RoutePath.PORTFOLIO
});

export default async function PortfolioPage() {
	const projects = await getPortfolioProjects();
	const hasReel = reelOf(projects).length > 0;
	const archive = archiveOf(projects);
	const hasArchive = archive.length > 0;

	// The counter is built from what actually renders — either list can be
	// empty while the portfolio is being filled in.
	const reelIndex = 1;
	const archiveIndex = reelIndex + (hasReel ? 1 : 0);
	const ctaIndex = archiveIndex + (hasArchive ? 1 : 0);
	const totalSections = ctaIndex;

	return (
		<>
			<PortfolioHero projects={projects} />
			<PortfolioReelSection
				projects={projects}
				variant={portfolioReelVariant}
				sectionIndex={reelIndex}
				totalSections={totalSections}
			/>
			<PortfolioArchive
				projects={archive}
				sectionIndex={archiveIndex}
				totalSections={totalSections}
			/>
			<PortfolioCta
				sectionIndex={ctaIndex}
				totalSections={totalSections}
			/>
		</>
	);
}
