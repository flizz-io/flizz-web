import type { Metadata } from 'next';

import { PortfolioArchive } from '@/components/features/portfolio/portfolio-archive';
import { PortfolioCta } from '@/components/features/portfolio/portfolio-cta';
import { PortfolioHero } from '@/components/features/portfolio/portfolio-hero';
import { PortfolioReelSection } from '@/components/features/portfolio/portfolio-reel-section';
import { siteConfig } from '@/configs/site';
import { portfolioHeroLead, portfolioReelVariant } from '@/constants/portfolio';
import { archiveOf, reelOf } from '@/utils/portfolio';
import { getPortfolioProjects } from '@/utils/projects-api';

export const metadata: Metadata = {
	title: 'Portfolio',
	description: portfolioHeroLead,
	alternates: { canonical: `${siteConfig.url}/portfolio` },
	openGraph: {
		type: 'website',
		url: `${siteConfig.url}/portfolio`,
		siteName: siteConfig.fullname,
		title: `Portfolio — ${siteConfig.name}`,
		description: portfolioHeroLead
	},
	twitter: {
		card: 'summary_large_image',
		title: `Portfolio — ${siteConfig.name}`,
		description: portfolioHeroLead
	}
};

/** Backstop for scheduled launches — edits revalidate on demand. */
export const revalidate = 300;

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
