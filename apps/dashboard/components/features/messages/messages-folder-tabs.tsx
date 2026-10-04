import Link from 'next/link';

import {
	contactFolderLabels,
	contactFolderOrder
} from '@/constants/contact-messages';
import { inboxHref } from '@/utils/contact-messages';
import {
	ContactFolder,
	type ContactMessageSummary
} from '@workspace/api-services';
import { cn } from '@workspace/ui/lib/utils';

const folderCount: Record<
	ContactFolder,
	(summary: ContactMessageSummary) => number
> = {
	[ContactFolder.INBOX]: (summary) => summary.inbox,
	[ContactFolder.UNREAD]: (summary) => summary.unread,
	[ContactFolder.ARCHIVED]: (summary) => summary.archived,
	[ContactFolder.SPAM]: (summary) => summary.spam,
	[ContactFolder.ALL]: (summary) => summary.all
};

interface MessagesFolderTabsProps {
	current: ContactFolder;
	search: string;
	summary: ContactMessageSummary;
}

/** The inbox tabs, each with its count. Links, so a tab is a shareable URL. */
export function MessagesFolderTabs({
	current,
	search,
	summary
}: MessagesFolderTabsProps) {
	return (
		<nav
			aria-label="Folders"
			className="flex flex-wrap gap-1 border-b"
		>
			{contactFolderOrder.map((folder) => {
				const active = folder === current;

				return (
					<Link
						key={folder}
						href={inboxHref({ folder, search })}
						aria-current={active ? 'page' : undefined}
						className={cn(
							'-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm transition-colors',
							active
								? 'border-primary font-medium text-foreground'
								: 'border-transparent text-muted-foreground hover:text-foreground'
						)}
					>
						{contactFolderLabels[folder]}
						<span className="rounded-full bg-muted px-1.5 text-xs tabular-nums">
							{folderCount[folder](summary)}
						</span>
					</Link>
				);
			})}
		</nav>
	);
}
