import type { Metadata } from 'next';

import { AboutCta } from '@/components/features/about/about-cta';
import { AboutGuarantees } from '@/components/features/about/about-guarantees';
import { AboutHero } from '@/components/features/about/about-hero';
import { AboutMission } from '@/components/features/about/about-mission';
import { AboutOperating } from '@/components/features/about/about-operating';
import { AboutOrigin } from '@/components/features/about/about-origin';
import { AboutTeam } from '@/components/features/about/about-team';
import { AboutValues } from '@/components/features/about/about-values';
import { RoutePath } from '@/enums/routes';
import { buildPageMetadata } from '@/utils/metadata';
import { getAboutTeam } from '@/utils/team-api';

export const metadata: Metadata = buildPageMetadata({
	title: 'About',
	description:
		'Flizz started in 2024 building its own products, and moved into services from there. Seven people, four of them founders, and the terms of every engagement stated up front.',
	path: RoutePath.ABOUT
});

export default async function AboutPage() {
	const team = await getAboutTeam();
	// The team section drops out while nobody is shown on the website, so
	// the counter is built from what actually renders.
	const hasTeam = team.length > 0;
	const totalSections = hasTeam ? 7 : 6;

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
				members={team}
				sectionIndex={5}
				totalSections={totalSections}
			/>
			<AboutGuarantees
				sectionIndex={hasTeam ? 6 : 5}
				totalSections={totalSections}
			/>
			<AboutCta
				sectionIndex={hasTeam ? 7 : 6}
				totalSections={totalSections}
			/>
		</>
	);
}
