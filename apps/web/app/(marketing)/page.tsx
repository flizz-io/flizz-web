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
	return (
		<>
			<Hero />
			<Proof />
			<Problem />
			<Solution />
			<ServicesTeaser />
			<PortfolioTeaser />
			<MarqueeStatement />
			<WhyUs />
			<Testimonials />
			<Faq />
			<FinalCta />
		</>
	);
}
