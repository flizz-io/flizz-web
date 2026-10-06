import { visibilityLabels } from '@/constants/projects';
import { ProjectVisibility } from '@workspace/api-services';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';

const visibilityTone: Record<ProjectVisibility, string> = {
	[ProjectVisibility.DRAFT]: 'text-muted-foreground',
	[ProjectVisibility.SCHEDULED]:
		'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
	[ProjectVisibility.LIVE]:
		'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
};

/** Draft / Scheduled / Live — whether the website shows it right now. */
export function VisibilityBadge({
	visibility
}: {
	visibility: ProjectVisibility;
}) {
	return (
		<Badge
			variant="outline"
			className={cn(visibilityTone[visibility])}
		>
			{visibilityLabels[visibility]}
		</Badge>
	);
}
