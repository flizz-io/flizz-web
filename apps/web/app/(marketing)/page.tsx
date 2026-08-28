import { Faq } from '@/components/features/home/faq';
import { FinalCta } from '@/components/features/home/final-cta';
import { Hero } from '@/components/features/home/hero';
import { MarqueeStatement } from '@/components/features/home/marquee-statement';
import { PortfolioTeaser } from '@/components/features/home/portfolio-teaser';
import { Problem } from '@/components/features/home/problem';
import { Proof } from '@/components/features/home/proof';
import { ServicesTeaser } from '@/components/features/home/services-teaser';
import { Solution } from '@/components/features/home/solution';
import { Testimonials } from '@/components/features/home/testimonials';
import { WhyUs } from '@/components/features/home/why-us';

export default function HomePage() {
	const totalSections = 9;

	return (
		<>
			<Hero />
			<Proof />
			<ServicesTeaser
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<PortfolioTeaser
				sectionIndex={2}
				totalSections={totalSections}
			/>
			<Testimonials
				sectionIndex={3}
				totalSections={totalSections}
			/>
			<WhyUs
				sectionIndex={4}
				totalSections={totalSections}
			/>
			<Problem
				sectionIndex={5}
				totalSections={totalSections}
			/>
			{/* TODO: two process variants stacked for comparison — keep one. */}
			<Solution
				sectionIndex={6}
				totalSections={totalSections}
			/>
			<MarqueeStatement
				sectionIndex={7}
				totalSections={totalSections}
			/>
			<Faq
				sectionIndex={8}
				totalSections={totalSections}
			/>
			<FinalCta
				sectionIndex={9}
				totalSections={totalSections}
			/>
		</>
	);
}
