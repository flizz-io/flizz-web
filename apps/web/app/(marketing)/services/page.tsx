import type { Metadata } from 'next';

import { ServicesCatalogue } from '@/components/features/services/services-catalogue';
import { ServicesCta } from '@/components/features/services/services-cta';
import { ServicesHero } from '@/components/features/services/services-hero';
import { staticPageSeo } from '@/constants/seo';
import { RoutePath } from '@/enums/routes';
import { buildPageMetadata } from '@/utils/metadata';
import { getCatalogueServices } from '@/utils/services-api';

export const metadata: Metadata = buildPageMetadata({
	...staticPageSeo[RoutePath.SERVICES],
	path: RoutePath.SERVICES
});

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
