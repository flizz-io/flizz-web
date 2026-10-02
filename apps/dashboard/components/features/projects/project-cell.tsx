import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { projectPath, projectsMessages } from '@/constants/projects';
import type { ProjectListItem } from '@workspace/api-services';

const THUMB_WIDTH = 64;
const THUMB_HEIGHT = 40;

/** Cover thumbnail, name and slug — the first column of the Projects table. */
export function ProjectCell({ project }: { project: ProjectListItem }) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
				{project.coverUrl ? (
					<Image
						src={project.coverUrl}
						alt=""
						width={THUMB_WIDTH}
						height={THUMB_HEIGHT}
						className="size-full object-cover"
						unoptimized
					/>
				) : (
					<ImageOff
						className="size-4 text-muted-foreground"
						aria-label={projectsMessages.noCover}
					/>
				)}
			</div>
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
		</div>
	);
}
