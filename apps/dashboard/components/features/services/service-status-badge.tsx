import { serviceStatusLabels } from '@/constants/services';
import { PublishStatus } from '@workspace/api-services';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';

const statusTone: Record<PublishStatus, string> = {
	[PublishStatus.DRAFT]: 'text-muted-foreground',
	[PublishStatus.PUBLISHED]:
		'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
};

/** Draft / Live — whether the website shows the service. */
export function ServiceStatusBadge({ status }: { status: PublishStatus }) {
	return (
		<Badge
			variant="outline"
			className={cn(statusTone[status])}
		>
			{serviceStatusLabels[status]}
		</Badge>
	);
}
