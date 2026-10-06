import type { Metadata } from 'next';

import { Faq } from '@/components/features/home/faq';
import { FinalCta } from '@/components/features/home/final-cta';
import { Hero } from '@/components/features/home/hero';
import { PortfolioTeaser } from '@/components/features/home/portfolio-teaser';
import { Problem } from '@/components/features/home/problem';
import { Proof } from '@/components/features/home/proof';
import { ServicesTeaser } from '@/components/features/home/services-teaser';
import { Solution } from '@/components/features/home/solution';
import { StatsBand } from '@/components/features/home/stats-band';
import { Testimonials } from '@/components/features/home/testimonials';
import { WhoWeBuildFor } from '@/components/features/home/who-we-build-for';
import { WhyUs } from '@/components/features/home/why-us';
import { SectionReveals } from '@/components/snippets/section-reveals/section-reveals';
import { staticPageSeo } from '@/constants/seo';
import { RoutePath } from '@/enums/routes';
import { buildPageMetadata } from '@/utils/metadata';
import { portfolioMetaOf, sinceYearOf } from '@/utils/portfolio';
import { getHomeProjects, getPortfolioProjects } from '@/utils/projects-api';
import { serviceCategoryCardsOf } from '@/utils/services';
import { getCatalogueServices } from '@/utils/services-api';
import { getHomeTestimonials } from '@/utils/testimonials-api';

export const metadata: Metadata = buildPageMetadata({
	...staticPageSeo[RoutePath.HOME],
	path: RoutePath.HOME,
	// Already leads with what the company does and ends with the brand.
	absoluteTitle: true
});

export default async function HomePage() {
	const [homeProjects, projects, services, testimonials] = await Promise.all([
		getHomeProjects(),
		getPortfolioProjects(),
		getCatalogueServices(),
		getHomeTestimonials()
	]);
	// Testimonials drop out when none are published, so the counter is
	// built from what actually renders.
	const testimonialsCount = Number(testimonials.length > 0);
	const totalSections = 8 + testimonialsCount;
	const afterTestimonials = 3 + testimonialsCount;

	return (
		<>
			<Hero
				variation="cinematic"
				facts={{
					projectCount: projects.length,
					sinceYear: sinceYearOf(projects)
				}}
			/>
			{/* <Proof /> */}
			<ServicesTeaser
				categories={serviceCategoryCardsOf(services)}
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<PortfolioTeaser
				projects={homeProjects}
				meta={portfolioMetaOf(projects)}
				sectionIndex={2}
				totalSections={totalSections}
			/>
			<Testimonials
				testimonials={testimonials}
				sectionIndex={3}
				totalSections={totalSections}
			/>
			<WhyUs
				sectionIndex={afterTestimonials}
				totalSections={totalSections}
			/>
			<Problem
				sectionIndex={afterTestimonials + 1}
				totalSections={totalSections}
			/>
			<StatsBand />
			<Solution
				variation="scroll"
				sectionIndex={afterTestimonials + 2}
				totalSections={totalSections}
			/>
			<WhoWeBuildFor
				sectionIndex={afterTestimonials + 3}
				totalSections={totalSections}
				marqueeSpeed={0.5}
			/>
			<Faq
				sectionIndex={afterTestimonials + 4}
				totalSections={totalSections}
			/>
			<FinalCta
				sectionIndex={afterTestimonials + 5}
				totalSections={totalSections}
			/>
			{/* After the sections, so it finds them all mounted. */}
			<SectionReveals />
		</>
	);
}
