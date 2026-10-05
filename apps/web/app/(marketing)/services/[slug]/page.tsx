import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { ServiceDetailHero } from '@/components/features/services/service-detail-hero';
import { ServiceFaqs } from '@/components/features/services/service-faqs';
import { ServiceHandover } from '@/components/features/services/service-handover';
import { ServiceProblem } from '@/components/features/services/service-problem';
import { ServiceRelated } from '@/components/features/services/service-related';
import { ServicesCta } from '@/components/features/services/services-cta';
import { serviceDetailBackNav } from '@/constants/services';
import {
	getCatalogueService,
	getCatalogueServices,
	getServiceRedirect
} from '@/utils/services-api';

interface ServicePageProps {
	params: Promise<{ slug: string }>;
}

/**
 * Every published service is built ahead; one published later renders on
 * its first visit and is cached from then on (`dynamicParams` stays on).
 */
export async function generateStaticParams() {
	return (await getCatalogueServices()).map((service) => ({
		slug: service.slug
	}));
}

export async function generateMetadata({
	params
}: ServicePageProps): Promise<Metadata> {
	const { slug } = await params;
	const service = await getCatalogueService(slug);

	if (!service) return {};

	return {
		title: service.seoTitle ?? service.title,
		description: service.seoDescription ?? service.summary,
		...(service.ogImage
			? { openGraph: { images: [{ url: service.ogImage }] } }
			: {})
	};
}

export default async function ServicePage({ params }: ServicePageProps) {
	const { slug } = await params;
	const [service, services] = await Promise.all([
		getCatalogueService(slug),
		getCatalogueServices()
	]);

	if (!service) {
		// A renamed service keeps its old URL working.
		const current = await getServiceRedirect(slug);
		if (current) permanentRedirect(`/services/${current}`);
		notFound();
	}

	const related = services.filter(
		(entry) =>
			entry.category === service.category && entry.slug !== service.slug
	);
	const hasFaqs = service.faqs.length > 0;

	// "Nearby" and the FAQs drop out when empty, so the counter has to be
	// built from what actually renders.
	const totalSections = 3 + Number(hasFaqs) + Number(related.length > 0);
	const faqsIndex = 3;
	const relatedIndex = faqsIndex + Number(hasFaqs);

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
			{hasFaqs ? (
				<ServiceFaqs
					faqs={service.faqs}
					sectionIndex={faqsIndex}
					totalSections={totalSections}
				/>
			) : null}
			<ServiceRelated
				services={related}
				category={service.category}
				sectionIndex={relatedIndex}
				totalSections={totalSections}
			/>
			<ServicesCta
				sectionIndex={totalSections}
				totalSections={totalSections}
				// Not lower-cased: it would render MVP, AI, API and SaaS as
				// mvp, ai, api and saas.
				heading={`Thinking about ${service.title}?`}
				lead="Bring the problem rather than a spec. A free discovery call will tell you whether this is the right answer, or whether something smaller would do."
				ctaLabel="Book a discovery call →"
				booking
			/>
		</>
	);
}
