import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { DeleteServiceButton } from '@/components/features/services/delete-service-button';
import { ServiceForm } from '@/components/features/services/service-form';
import { ServiceProjectsSection } from '@/components/features/services/service-projects-section';
import { ServiceStatusBadge } from '@/components/features/services/service-status-badge';
import { RecordAuthorship } from '@/components/snippets/record-authorship/record-authorship';
import { homePath } from '@/constants/auth';
import {
	serviceFormMessages,
	servicesMessages,
	servicesPath
} from '@/constants/services';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import { ApiError, Feature, getServiceService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;

interface ServicePageProps {
	params: Promise<{ uuid: string }>;
}

export const metadata: Metadata = { title: servicesMessages.title };

/** A deleted, unknown or malformed id is a 404. */
async function loadService(uuid: string) {
	try {
		return await serverCall(
			getServiceService(uuid, await serverApiContext())
		);
	} catch (error) {
		if (
			error instanceof ApiError &&
			(error.status === NOT_FOUND_STATUS ||
				error.status === BAD_REQUEST_STATUS)
		) {
			notFound();
		}
		throw error;
	}
}

/** Needs Services › View; the form is read-only without Edit. */
export default async function ServicePage({ params }: ServicePageProps) {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.SERVICES];
	if (!grant?.view) redirect(homePath);

	const service = await loadService((await params).uuid);

	return (
		<>
			<div className="flex flex-col gap-2">
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="self-start"
				>
					<Link href={servicesPath}>
						<ArrowLeft />
						{serviceFormMessages.backToList}
					</Link>
				</Button>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-semibold tracking-tight">
								{service.title}
							</h1>
							<ServiceStatusBadge status={service.status} />
						</div>
						<p className="text-sm text-muted-foreground">
							{serviceFormMessages.editLead(service.slug)}
						</p>
						<RecordAuthorship {...service} />
						{grant.edit ? null : (
							<p className="text-sm text-muted-foreground">
								{serviceFormMessages.readOnly}
							</p>
						)}
					</div>
					{grant.delete ? (
						<DeleteServiceButton
							uuid={service.uuid}
							title={service.title}
							projectCount={service.projectCount}
						/>
					) : null}
				</div>
			</div>
			<ServiceForm
				service={service}
				canSave={grant.edit}
			/>
			<div className="max-w-4xl">
				<ServiceProjectsSection projects={service.projects} />
			</div>
		</>
	);
}
