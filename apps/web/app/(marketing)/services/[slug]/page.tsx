import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ServiceDetailHero } from '@/components/features/services/service-detail-hero';
import { ServiceHandover } from '@/components/features/services/service-handover';
import { ServiceProblem } from '@/components/features/services/service-problem';
import { ServiceRelated } from '@/components/features/services/service-related';
import { ServicesCta } from '@/components/features/services/services-cta';
import { serviceDetailBackNav, services } from '@/constants/services';

interface ServicePageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
	return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
	params
}: ServicePageProps): Promise<Metadata> {
	const { slug } = await params;
	const service = services.find((entry) => entry.slug === slug);

	if (!service) return {};

	return {
		title: service.title,
		description: service.summary
	};
}

export default async function ServicePage({ params }: ServicePageProps) {
	const { slug } = await params;
	const service = services.find((entry) => entry.slug === slug);

	if (!service) notFound();

	const related = services.filter(
		(entry) =>
			entry.category === service.category && entry.slug !== service.slug
	);

	// The "nearby" section drops out when a category holds only this service,
	// so the counter has to be built from what actually renders.
	const totalSections = related.length ? 4 : 3;

	return (
		<>
			<ServiceDetailHero
				service={service}
				backNav={serviceDetailBackNav}
			/>
			<ServiceProblem
				problem={service.problem}
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<ServiceHandover
				deliverables={service.deliverables}
				outcomes={service.outcomes}
				sectionIndex={2}
				totalSections={totalSections}
			/>
			<ServiceRelated
				services={related}
				category={service.category}
				sectionIndex={3}
				totalSections={totalSections}
			/>
			<ServicesCta
				sectionIndex={related.length ? 4 : 3}
				totalSections={totalSections}
				// Not lower-cased: it would render MVP, AI, API and SaaS as
				// mvp, ai, api and saas.
				heading={`Thinking about ${service.title}?`}
				lead="Bring the problem rather than a spec. A free discovery call will tell you whether this is the right answer, or whether something smaller would do."
				ctaLabel="Book a discovery call →"
			/>
		</>
	);
}
