import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { DeleteProjectButton } from '@/components/features/projects/delete-project-button';
import { ProjectForm } from '@/components/features/projects/project-form';
import { RecordAuthorship } from '@/components/snippets/record-authorship/record-authorship';
import { VisibilityBadge } from '@/components/snippets/visibility-badge/visibility-badge';
import { homePath } from '@/constants/auth';
import {
	projectFormMessages,
	projectsMessages,
	projectsPath
} from '@/constants/projects';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import {
	ApiError,
	Feature,
	getProjectService,
	getServiceOptionsService
} from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

const NOT_FOUND_STATUS = 404;
const BAD_REQUEST_STATUS = 400;

interface ProjectPageProps {
	params: Promise<{ uuid: string }>;
}

export const metadata: Metadata = { title: projectsMessages.title };

/** A deleted, unknown or malformed id is a 404. */
async function loadProject(uuid: string) {
	try {
		return await serverCall(
			getProjectService(uuid, await serverApiContext())
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

/** Needs Projects › View; the form is read-only without Edit. */
export default async function ProjectPage({ params }: ProjectPageProps) {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.PROJECTS];
	if (!grant?.view) redirect(homePath);

	const [project, serviceOptions] = await Promise.all([
		loadProject((await params).uuid),
		serverCall(getServiceOptionsService(await serverApiContext()))
	]);

	return (
		<>
			<div className="flex flex-col gap-2">
				<Button
					asChild
					variant="ghost"
					size="sm"
					className="self-start"
				>
					<Link href={projectsPath}>
						<ArrowLeft />
						{projectFormMessages.backToList}
					</Link>
				</Button>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-3">
							<h1 className="text-2xl font-semibold tracking-tight">
								{project.name}
							</h1>
							<VisibilityBadge visibility={project.visibility} />
						</div>
						<p className="text-sm text-muted-foreground">
							{projectFormMessages.editLead(project.slug)}
						</p>
						<RecordAuthorship {...project} />
						{grant.edit ? null : (
							<p className="text-sm text-muted-foreground">
								{projectFormMessages.readOnly}
							</p>
						)}
					</div>
					{grant.delete ? (
						<DeleteProjectButton
							uuid={project.uuid}
							name={project.name}
						/>
					) : null}
				</div>
			</div>
			<ProjectForm
				project={project}
				canSave={grant.edit}
				serviceOptions={serviceOptions}
			/>
		</>
	);
}
