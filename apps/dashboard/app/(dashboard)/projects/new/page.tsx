import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ProjectForm } from '@/components/features/projects/project-form';
import { projectFormMessages, projectsPath } from '@/constants/projects';
import { getCurrentUser } from '@/utils/get-current-user';
import { Feature } from '@workspace/api-services';
import { Button } from '@workspace/ui/components/button';

export const metadata: Metadata = { title: projectFormMessages.newTitle };

/** Needs Projects › Create — anyone else goes back to the list. */
export default async function NewProjectPage() {
	const user = await getCurrentUser();
	if (!user?.permissions[Feature.PROJECTS].create) redirect(projectsPath);

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
				<h1 className="text-2xl font-semibold tracking-tight">
					{projectFormMessages.newTitle}
				</h1>
				<p className="max-w-prose text-muted-foreground">
					{projectFormMessages.newLead}
				</p>
			</div>
			<ProjectForm canSave />
		</>
	);
}
