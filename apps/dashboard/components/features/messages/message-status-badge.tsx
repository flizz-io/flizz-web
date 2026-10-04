import { contactStatusLabels } from '@/constants/contact-messages';
import { ContactMessageStatus } from '@workspace/api-services';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';

const statusTone: Record<ContactMessageStatus, string> = {
	[ContactMessageStatus.NEW]: 'border-primary/40 bg-primary/10 text-primary',
	[ContactMessageStatus.READ]: 'text-muted-foreground',
	[ContactMessageStatus.REPLIED]:
		'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
	[ContactMessageStatus.ARCHIVED]: 'text-muted-foreground',
	[ContactMessageStatus.SPAM]:
		'border-destructive/40 bg-destructive/10 text-destructive'
};

export function MessageStatusBadge({
	status
}: {
	status: ContactMessageStatus;
}) {
	return (
		<Badge
			variant="outline"
			className={cn(statusTone[status])}
		>
			{contactStatusLabels[status]}
		</Badge>
	);
}
