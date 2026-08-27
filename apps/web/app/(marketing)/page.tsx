import { Faq } from '@/components/features/home/faq';
import { FinalCta } from '@/components/features/home/final-cta';
import { Hero } from '@/components/features/home/hero';
import { MarqueeStatement } from '@/components/features/home/marquee-statement';
import { PortfolioTeaser } from '@/components/features/home/portfolio-teaser';
import { Problem } from '@/components/features/home/problem';
import { ServicesTeaser } from '@/components/features/home/services-teaser';
import { SocialProof } from '@/components/features/home/social-proof';
import { Solution } from '@/components/features/home/solution';
import { StatsStrip } from '@/components/features/home/stats-strip';
import { Testimonials } from '@/components/features/home/testimonials';
import { WhyUs } from '@/components/features/home/why-us';

export default function HomePage() {
	return (
		<>
			<Hero />
			<StatsStrip />
			<SocialProof />
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
