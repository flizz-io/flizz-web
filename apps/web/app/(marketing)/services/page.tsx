import type { Metadata } from 'next';

import { ServicesCatalogue } from '@/components/features/services/services-catalogue';
import { ServicesCta } from '@/components/features/services/services-cta';
import { ServicesHero } from '@/components/features/services/services-hero';
import { getCatalogueServices } from '@/utils/services-api';

export const metadata: Metadata = {
	title: 'Services',
	description:
		'Services across custom software, AI and automation, e-commerce and mobile — and a straight answer about when an off-the-shelf tool would do instead.'
};

export default async function ServicesPage() {
	const services = await getCatalogueServices();
	const totalSections = 2;

	return (
		<>
			<ServicesHero services={services} />
			<ServicesCatalogue
				services={services}
				sectionIndex={1}
				totalSections={totalSections}
			/>
			<ServicesCta
				sectionIndex={2}
				totalSections={totalSections}
			/>
		</>
	);
}
