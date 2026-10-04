import Link from 'next/link';

import { VisibilityBadge } from '@/components/features/projects/visibility-badge';
import { SectionCard } from '@/components/snippets/section-card/section-card';
import { projectPath } from '@/constants/projects';
import { serviceFormMessages } from '@/constants/services';
import type { ServiceProject } from '@workspace/api-services';

const { sections } = serviceFormMessages;

/** The portfolio projects that link here — why a delete may be blocked. */
export function ServiceProjectsSection({
	projects
}: {
	projects: ServiceProject[];
}) {
	return (
		<SectionCard
			title={sections.projects}
			description={sections.projectsLead}
		>
			{projects.length ? (
				<ul className="flex flex-col divide-y rounded-lg border">
					{projects.map((project) => (
						<li
							key={project.uuid}
							className="flex items-center justify-between gap-3 px-4 py-3"
						>
							<div className="min-w-0">
								<Link
									href={projectPath(project.uuid)}
									className="block truncate font-medium hover:underline"
								>
									{project.name}
								</Link>
								<p className="truncate text-sm text-muted-foreground">
									/{project.slug}
								</p>
							</div>
							<VisibilityBadge visibility={project.visibility} />
						</li>
					))}
				</ul>
			) : (
				<p className="text-sm text-muted-foreground">
					{sections.noProjects}
				</p>
			)}
		</SectionCard>
	);
}
