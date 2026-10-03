import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ServicesTable } from '@/components/features/services/services-table';
import { homePath } from '@/constants/auth';
import { servicesMessages } from '@/constants/services';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import { Feature, getServicesService } from '@workspace/api-services';

export const metadata: Metadata = { title: servicesMessages.title };

/** Needs Services › View — anyone else goes back to Overview. */
export default async function ServicesPage() {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.SERVICES];
	if (!grant?.view) redirect(homePath);

	const services = await serverCall(
		getServicesService({}, await serverApiContext())
	);

	return (
		<>
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					{servicesMessages.title}
				</h1>
				<p className="max-w-prose text-muted-foreground">
					{servicesMessages.lead}
				</p>
			</div>
			<ServicesTable
				services={services}
				canEdit={grant.edit}
			/>
		</>
	);
}
