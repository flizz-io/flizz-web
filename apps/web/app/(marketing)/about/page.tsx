import type { Metadata } from 'next';

import { AboutCta } from '@/components/features/about/about-cta';
import { AboutGuarantees } from '@/components/features/about/about-guarantees';
import { AboutHero } from '@/components/features/about/about-hero';
import { AboutMission } from '@/components/features/about/about-mission';
import { AboutOperating } from '@/components/features/about/about-operating';
import { AboutOrigin } from '@/components/features/about/about-origin';
import { AboutTeam } from '@/components/features/about/about-team';
import { AboutValues } from '@/components/features/about/about-values';
import { showTeamSection } from '@/constants/about';

export const metadata: Metadata = {
	title: 'About',
	description:
		'Flizz started in 2024 building its own products, and moved into services from there. Seven people, four of them founders, and the terms of every engagement stated up front.'
};

export default function AboutPage() {
	const totalSections = 7;

	return (
		<>
			<AboutHero />
			<AboutMission
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<AboutOrigin
				sectionIndex={2}
				totalSections={totalSections}
			/>
			<AboutValues
				sectionIndex={3}
				totalSections={totalSections}
			/>
			<AboutOperating
				sectionIndex={4}
				totalSections={totalSections}
			/>
			<AboutTeam
				sectionIndex={5}
				totalSections={totalSections}
				isVisible={showTeamSection}
			/>
			<AboutGuarantees
				sectionIndex={6}
				totalSections={totalSections}
			/>
			<AboutCta
				sectionIndex={7}
				totalSections={totalSections}
			/>
		</>
	);
}
