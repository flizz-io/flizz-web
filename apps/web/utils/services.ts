import { serviceCategoryCardBases } from '@/constants/home';
import type { ServiceCategory } from '@/enums/services';
import type { ServiceCategoryCard } from '@/types/home';
import type { Service } from '@/types/services';

/** One category's services, in catalogue order. */
export function servicesInCategory<T extends Service>(
	services: T[],
	category: ServiceCategory
): T[] {
	return services.filter((service) => service.category === category);
}

/** The home teaser's rail, each category listing its published services. */
export function serviceCategoryCardsOf(
	services: Service[]
): ServiceCategoryCard[] {
	return serviceCategoryCardBases.map((card) => ({
		...card,
		services: servicesInCategory(services, card.category)
	}));
}
