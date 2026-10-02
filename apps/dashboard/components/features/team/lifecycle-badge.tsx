import { lifecycleLabels } from '@/constants/team';
import { UserLifecycle } from '@/enums/user';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';

const lifecycleTone: Record<UserLifecycle, string> = {
	[UserLifecycle.INVITED]:
		'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
	[UserLifecycle.ACTIVE]:
		'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
	[UserLifecycle.SUSPENDED]:
		'border-destructive/40 bg-destructive/10 text-destructive'
};

export function LifecycleBadge({ lifecycle }: { lifecycle: UserLifecycle }) {
	return (
		<Badge
			variant="outline"
			className={cn(lifecycleTone[lifecycle])}
		>
			{lifecycleLabels[lifecycle]}
		</Badge>
	);
}
