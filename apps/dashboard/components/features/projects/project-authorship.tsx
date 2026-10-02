import { projectFormMessages } from '@/constants/projects';
import { relativeTime } from '@/utils/relative-time';
import type { ProjectRecord } from '@workspace/api-services';

/** "Created by … · Last changed by …" under the project's title. */
export function ProjectAuthorship({ project }: { project: ProjectRecord }) {
	const { createdBy, updatedBy, someone } = projectFormMessages;

	return (
		<p className="text-sm text-muted-foreground">
			{createdBy(
				project.createdBy?.name ?? someone,
				relativeTime(project.createdAt)
			)}
			{' · '}
			{updatedBy(
				project.updatedBy?.name ?? someone,
				relativeTime(project.updatedAt)
			)}
		</p>
	);
}
