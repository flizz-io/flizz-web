import type { Metadata } from 'next';

import { PortfolioArchive } from '@/components/features/portfolio/portfolio-archive';
import { PortfolioCta } from '@/components/features/portfolio/portfolio-cta';
import { PortfolioHero } from '@/components/features/portfolio/portfolio-hero';
import { PortfolioReel } from '@/components/features/portfolio/portfolio-reel';
import { siteConfig } from '@/configs/site';
import { portfolioHeroLead } from '@/constants/portfolio';

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

export default function PortfolioPage() {
	const totalSections = 3;

	return (
		<>
			<PortfolioHero />
			<PortfolioReel
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<PortfolioArchive
				sectionIndex={2}
				totalSections={totalSections}
			/>
			<PortfolioCta
				sectionIndex={3}
				totalSections={totalSections}
			/>
		</>
	);
}
