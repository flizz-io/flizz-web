import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ProjectsTable } from '@/components/features/projects/projects-table';
import { homePath } from '@/constants/auth';
import { newProjectPath, projectsMessages } from '@/constants/projects';
import { getCurrentUser } from '@/utils/get-current-user';
import { serverApiContext, serverCall } from '@/utils/server-api';
import { Feature, getProjectsService } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

export const metadata: Metadata = { title: projectsMessages.title };

/** Needs Projects › View — anyone else goes back to Overview. */
export default async function ProjectsPage() {
	const user = await getCurrentUser();
	const grant = user?.permissions[Feature.PROJECTS];
	if (!grant?.view) redirect(homePath);

	const projects = await serverCall(
		getProjectsService({}, await serverApiContext())
	);

	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						{projectsMessages.title}
					</h1>
					<p className="max-w-prose text-muted-foreground">
						{projectsMessages.lead}
					</p>
				</div>
				{grant.create ? (
					<Button asChild>
						<Link href={newProjectPath}>
							<Plus />
							{projectsMessages.newProject}
						</Link>
					</Button>
				) : null}
			</div>
			<ProjectsTable
				projects={projects}
				canEdit={grant.edit}
			/>
		</>
	);
}
